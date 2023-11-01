import React, { useState } from 'react';
import './Auth.css';
import LoadingSpinner from './LoadingSpinner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const switchAuthModeHandler = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulating a network request with a timeout
    setTimeout(() => {
      console.log('Email:', email);
      console.log('Password:', password);
      if (!isLogin) {
        console.log('Confirm Password:', confirmPassword);
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="info-panel">
          <h1>Welcome to MyApp</h1>
          <p>Manage your email subscriptions with ease.</p>
        </div>
        <div className="auth-card">
          {isLoading && (
            <div className="loading-overlay">
              <LoadingSpinner />
            </div>
          )}
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={submitHandler}>
            <input 
              type="email" 
              placeholder="Email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogin && (
              <input 
                type="password" 
                placeholder="Confirm Password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <button type="submit" disabled={isLoading}>{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <button className="toggle-btn" onClick={switchAuthModeHandler} disabled={isLoading}>
            Switch to {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
