// src/pages/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/'); // Navigates back to the HomePage
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
      </div>
      <div className="dashboard-content">
        {/* Existing content */}
        <button onClick={goToHomePage}>Go to HomePage</button> {/* New button to go back */}
      </div>
    </div>
  );
};

export default Dashboard;
