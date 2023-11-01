// src/components/GmailCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GmailCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Assuming your backend sends a success message upon successful authentication
    if (window.location.search.includes('success')) {
      navigate('/dashboard');
    } else {
      // Handle error (e.g., navigate to an error page or show an error message)
      navigate('/auth');
    }
  }, [navigate]);

  return null;
};

export default GmailCallback;