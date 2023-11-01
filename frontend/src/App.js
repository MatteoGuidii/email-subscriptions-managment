// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MainNavigation from './components/Navigation/MainNavigation';
import GmailCallback from './components/GmailCallback';
import Home from './pages/Home';  // Make sure to create this component

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
        <Routes>
          <Route path="/" element={<Home />} />  {/* Set Home as the default route */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gmail/callback" element={<GmailCallback />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
