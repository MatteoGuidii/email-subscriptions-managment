// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Import the CSS

const Home = () => {
  return (
    <div className="container" data-aos="zoom-in">
      <h1>Welcome to MyApp</h1>
      <p>This application allows you to manage your email subscriptions. Authenticate to access and manage your subscriptions with ease.</p>
      <div className="button-container">
        <Link to="/auth" className="button">Authenticate</Link>
      </div>
    </div>
  );
};

export default Home;
