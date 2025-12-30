import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StartTrip from './pages/StartTrip';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripPlanner from './pages/TripPlanner';
import HotelsFood from './pages/HotelsFood';
import ExpenseTracker from './pages/ExpenseTracker';
import WeatherPage from './pages/WeatherPage';
import Profile from './pages/Profile';
import Community from './pages/Community';
import TripDetails from './pages/TripDetails';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/start-trip"
            element={user ? <StartTrip /> : <Navigate to="/login" />}
          />
          <Route
            path="/planner"
            element={user ? <TripPlanner /> : <Navigate to="/login" />}
          />
          <Route
            path="/finder"
            element={user ? <HotelsFood /> : <Navigate to="/login" />}
          />
          <Route
            path="/weather"
            element={user ? <WeatherPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/expenses"
            element={user ? <ExpenseTracker /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/community"
            element={user ? <Community /> : <Navigate to="/login" />}
          />
          <Route
            path="/trip/:id"
            element={user ? <TripDetails /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
