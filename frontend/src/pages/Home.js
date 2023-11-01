// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Import the CSS

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to MyApp</h1>
      <p>Manage your email subscriptions with ease.</p>
      <div className="button-container">
        <Link to="/auth" className="button">Authenticate</Link>
        <Link to="/dashboard" className="button">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default Home;

