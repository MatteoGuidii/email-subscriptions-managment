import React, { useState } from 'react';
import './Auth.css';
import LoadingSpinner from './LoadingSpinner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const switchAuthModeHandler = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsLoading(true);

    const requestBody = {
      query: `
        mutation {
          createUser(input: {email: "${email}", password: "${password}"}) {
            _id
            email
          }
        }
      `
    };

    try {
      const response = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseBody = await response.json();
      if (responseBody.errors) {
        setError(responseBody.errors[0].message);
      } else {
        console.log('Success:', responseBody);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error, please try again later');
    }

    setIsLoading(false);
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
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={submitHandler}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error && !validateEmail(email) ? 'invalid-input' : ''}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error && password.trim().length < 6 ? 'invalid-input' : ''}
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={error && password !== confirmPassword ? 'invalid-input' : ''}
              />
            )}
            <button type="submit" disabled={isLoading}>
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <button
            className="toggle-btn"
            onClick={switchAuthModeHandler}
            disabled={isLoading}
          >
            Switch to {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
