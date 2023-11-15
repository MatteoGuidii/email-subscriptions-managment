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
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
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

    let requestBody;
if (isLogin) {
  requestBody = {
    query: `
      query {
        login(email: "${email}", password: "${password}") {
          userId
          token
        }
      }
    `
  };
} else {
  requestBody = {
    query: `
      mutation {
        createUser(input: {email: "${email}", password: "${password}"}) {
          _id
          email
        }
      }
    `
  };
}

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
    <div className="auth-background">
      <div className="container">
        <div className={`form-container ${isLogin ? 'sign-in' : 'sign-up'}`}>
          {isLogin ? (
            // Login form
            <form onSubmit={submitHandler}>
              <h1>Sign In</h1>
              {/* Social icons can be added here */}
              <span>or use your email password</span>
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
              <button className="forgot-password">
                Forget Your Password?
              </button>
              <button type="submit" disabled={isLoading}>
                Sign In
              </button>
            </form>
          ) : (
            // Sign-up form
            <form onSubmit={submitHandler}>
              <h1>Create Account</h1>
              {/* Social icons can be added here */}
              <span>or use your email for registration</span>
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
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" disabled={isLoading}>
                Sign Up
              </button>
            </form>
          )}
        </div>
        <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button onClick={switchAuthModeHandler} className={!isLogin ? "" : "hidden"}>
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button onClick={switchAuthModeHandler} className={isLogin ? "" : "hidden"}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
        {isLoading && (
          <div className="loading-overlay">
            <LoadingSpinner />
          </div>
        )}
        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default Auth;
