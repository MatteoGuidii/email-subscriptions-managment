// src/components/GmailAuth.js
import React from 'react';

const GmailAuth = () => {
  const handleAuth = () => {
    // Redirect to server authentication route
    window.location.href = '/gmail/auth';
  };

  return (
    <button onClick={handleAuth}>Connect Gmail Account</button>
  );
};

export default GmailAuth;
