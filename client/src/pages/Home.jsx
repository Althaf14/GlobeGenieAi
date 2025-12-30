import React from 'react';

const Home = () => {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-extrabold mb-6 animate-fade-in-down drop-shadow-lg">
                GlobeGenie
            </h1>
            <p className="text-xl mb-12 text-blue-100 max-w-md text-center">
                Your AI-powered travel companion. Plan, track, and explore the world with ease.
            </p>

            <div className="space-y-4">
                <a
                    href="/start-trip"
                    className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-xl flex items-center justify-center"
                >
                    Start a New Trip
                </a>
                <p className="text-sm text-blue-300 text-center mt-4">
                    Already have an account? <a href="/login" className="underline hover:text-white">Log in</a>
                </p>
            </div>
        </div>
    );
};

export default Home;
