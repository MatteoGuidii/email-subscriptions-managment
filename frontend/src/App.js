import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; 
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

function RedirectToAuth() {
  let navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/auth");
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
        <Routes>
          <Route path="/" element={<RedirectToAuth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

