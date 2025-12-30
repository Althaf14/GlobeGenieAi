# GlobeGenieAI 🌍✈️

**GlobeGenieAI** is an intelligent, AI-powered tourism companion designed to simplify travel planning. It combines the power of **Google Gemini AI** for personalized itineraries with real-time data for hotels, restaurants, and weather to provide a seamless travel experience.

## 🚀 Features

- **🤖 AI Trip Planner**: Generate personalized day-by-day itineraries based on your destination, budget, and interests using Google Gemini AI.
- **hotel & Food Finder**: Discover top-rated hotels and restaurants near your destination using **OpenStreetMap (OSM)** and **Overpass API**.
- **User Authentication**: Secure signup and login functionality with JWT-based authentication.
- **⛅ Weather Updates**: Get real-time weather forecasts for your trip destinations.
- **💰 Expense Tracker**: Manage your travel budget and track expenses efficiently.
- **📱 Responsive Design**: Built with React and TailwindCSS for a modern, mobile-friendly interface.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TailwindCSS** (Styling)
- **Lucide React** (Icons)
- **Axios** (API Requests)
- **React Router** (Navigation)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **Google GenAI SDK** (AI Integration)
- **JWT & Bcrypt** (Authentication & Security)
- **Nodemon** (Development)

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Althaf14/GlobeGenieAi.git
cd GlobeGenieAi
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies.
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory, and install dependencies.
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
# App will run on http://localhost:5173
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.
