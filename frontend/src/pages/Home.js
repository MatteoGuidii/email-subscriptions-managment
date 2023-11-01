// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <h1>Welcome to MyApp</h1>
      <p>Manage your email subscriptions with ease.</p>
      <Link to="/auth">Authenticate</Link>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default Home;

