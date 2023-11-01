// src/pages/Dashboard.js
import React from 'react';
import GmailAuth from '../components/GmailAuth';

const Dashboard = () => {
  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome, User!</p>
        </div>
        {/* Placeholder for future content */}
        <div className="dashboard-content">
          <p>Your email subscription management will appear here.</p>
          <GmailAuth />  {/* Include GmailAuth component here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;