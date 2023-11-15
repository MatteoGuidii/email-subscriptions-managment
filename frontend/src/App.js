import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import './App.css';
import Auth from './pages/Auth'; // Import your Auth component


const HomePage = () => {
  useEffect(() => {
    AOS.init({ duration: 1700 });
  }, []);

  const navigate = useNavigate();

  const handleAuthenticate = () => {
    navigate('/authenticate'); // Redirects to the authentication page
  };

  return (
    <div className="App">
      <div className="authentication-section">
        <button className="app-button" onClick={handleAuthenticate}>Authenticate</button>
      </div>
      <header className="App-header">
        <h1>Your Website Title</h1>
      </header>
      <main>
        <section data-aos="fade-up" className="content-section">
          <h2>Section Title 1</h2>
          <p>This content will animate in from the bottom as you scroll down.</p>
        </section>
        <section data-aos="fade-right" className="content-section">
          <h2>Section Title 2</h2>
          <p>This content will slide in from the right as you scroll down.</p>
        </section>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/authenticate" element={<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;
