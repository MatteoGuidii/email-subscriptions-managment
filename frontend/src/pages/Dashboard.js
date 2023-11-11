// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to Email Unsubscriber</h1>
      <p>This application automates the process of unsubscribing from your email account. Authenticate to get started.</p>
      <div className="button-container">
        <Link to="/auth" className="button">Authenticate</Link>
      </div>
    </div>
  );
};

export default Home;
