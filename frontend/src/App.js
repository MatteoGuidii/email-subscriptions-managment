// App.js

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS animations CSS

import './App.css'; // Import global styles here


// import './pages/Home.css'; // Import the Home page CSS

const App = () => {
  
  useEffect(() => {
    // Initialize AOS with a duration of 1700 milliseconds
    AOS.init({ duration: 1700 });
  }, []);

  return (
    <div className="App">
      {/* Authentication section without horizontal line */}
      <div className="authentication-section">
        <button className="auth-button">Authenticate</button>
      </div>
      <header className="App-header">
        <h1>Your Website Title</h1>
      </header>
  
      <main>
        <section data-aos="fade-up" className="content-section">
          {/* Content that will fade up on scroll */}
          <h2>Section Title 1</h2>
          <p>This content will animate in from the bottom as you scroll down.</p>
        </section>
  
        <section data-aos="fade-right" className="content-section">
          {/* Another section that will fade in from the right */}
          <h2>Section Title 2</h2>
          <p>This content will slide in from the right as you scroll down.</p>
        </section>
        {/* You can add as many sections as needed with different data-aos attributes */}
      </main>
    </div>
  );
};

export default App;
