import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import './App.css';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';


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
        <h1>Email Subscription Managment</h1>
      </header>
      <main>
        <section data-aos="fade-up" className="content-section">
          <h2>Automate Email Unsubscription</h2>
          <p>
            Explore our Python project designed to automate the process of unsubscribing from unwanted emails. 
            This tool uses advanced scripting to identify and unsubscribe from marketing emails, helping you manage your inbox more effectively.
          </p>
        </section>
        <section data-aos="fade-right" className="content-section">
          <h2>GitHub Repository</h2>
          <p>
            Check out the <a href="https://github.com/MatteoGuidii/Algorithm_Unsub_Management" target="_blank" rel="noopener noreferrer">GitHub repository</a> for detailed information 
            and instructions on how to use the script. Our comprehensive guide covers everything from setup to execution.
          </p>
        </section>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/authenticate" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Other routes... */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
