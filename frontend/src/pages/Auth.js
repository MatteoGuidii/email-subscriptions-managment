import React, { useState } from 'react';

import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="info-panel">
          <h1>Welcome to MyApp</h1>
          <p>Manage your email subscriptions with ease.</p>
        </div>
        <div className="auth-card">
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            {!isLogin && <input type="password" placeholder="Confirm Password" required />}
            <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
          </form>
          <button className="toggle-btn" onClick={switchAuthModeHandler}>
            Switch to {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
