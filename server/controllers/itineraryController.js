
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// Note: We instantiate AI inside the request to ensure process.env is fully loaded if this file was imported early.
// However, if we wanted to reuse the client, we could check if it's already created.
// For now, creating it per request is safe for low traffic and ensures the key is present.

const generateItinerary = async (req, res) => {
    try {
        const { days, budget, interests, destination } = req.body;
        console.log('Generating AI itinerary:', { days, budget, interests, destination });

        // Debug logging
        try {
            const debugLog = `[${new Date().toISOString()}] Request: ${JSON.stringify({ days, budget, interests, destination })}\nKey Present: ${!!process.env.GEMINI_API_KEY}\n`;
            fs.appendFileSync('debug_itinerary.log', debugLog);
        } catch (logErr) {
            console.error("Logging error", logErr);
        }

        if (!days || !budget) {
            return res.status(400).json({ message: 'Please provide days and budget' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            try { fs.appendFileSync('debug_itinerary.log', `Error: GEMINI_API_KEY is missing\n`); } catch (e) { }
            return res.status(500).json({ message: 'Server configuration error: Missing API Key' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
        Create a ${days}-day travel itinerary for ${destination || 'a generic city'} with a ${budget} budget.
        Interests: ${interests && interests.length > 0 ? interests.join(', ') : 'General'}.
        
        The output must be a valid JSON array where each object represents a day.
        Format:
        [
            {
                "day": 1,
                "activities": [
                    { "time": "Morning", "activity": "Activity Name", "type": "Type (e.g. Cultural)", "cost": "Cost (Low/Medium/High/Free)" },
                    { "time": "Afternoon", "activity": "Activity Name", "type": "Type", "cost": "Cost" },
                    { "time": "Evening", "activity": "Activity Name", "type": "Type", "cost": "Cost" }
                ]
            }
        ]
        
        Provide ONLY the JSON array. No markdown code blocks, no explanation.
        `;

        const runGeneration = async (retryCount = 0, model = "gemini-2.5-flash") => {
            try {
                console.log(`Attempting generation with ${model} (Attempt ${retryCount + 1})`);
                const response = await ai.models.generateContent({
                    model: model,
                    contents: prompt,
                });
                return response;
            } catch (error) {
                if (error.status === 503) {
                    if (retryCount < 3) {
                        console.log(`Model ${model} overloaded. Retrying... (${retryCount + 1}/3)`);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        return runGeneration(retryCount + 1, model);
                    } else if (model === "gemini-2.5-flash") {
                        console.log("Max retries reached for 2.5-flash. Falling back to 1.5-flash.");
                        try { fs.appendFileSync('debug_itinerary.log', `Fallback: Switching to gemini-1.5-flash due to overload.\n`); } catch (e) { }
                        return runGeneration(0, "gemini-1.5-flash");
                    }
                }
                throw error;
            }
        };

        try {
            const response = await runGeneration();

            const textResponse = response.text;
            console.log("AI Response:", textResponse);
            try { fs.appendFileSync('debug_itinerary.log', `AI Response Length: ${textResponse?.length}\n`); } catch (e) { }

            // Clean up code blocks if present (sometimes AI adds ```json ... ```)
            const cleanJson = textResponse.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

            const itinerary = JSON.parse(cleanJson);
            res.json(itinerary);

        } catch (aiError) {
            console.error("Gemini AI Error:", aiError);
            try { fs.appendFileSync('debug_itinerary.log', `AI Error: ${aiError.message}\nStack: ${aiError.stack}\n`); } catch (e) { }
            res.status(500).json({ message: 'AI generation failed', error: aiError.message });
        }

    } catch (error) {
        console.error('Itinerary Gen Error:', error);
        try { fs.appendFileSync('debug_itinerary.log', `Server Error: ${error.message}\n`); } catch (e) { }
        res.status(500).json({ message: 'Server error generating itinerary' });
    }
};

export { generateItinerary };
