import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  return (
    <div className="container">
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        { !isLogin && <input type="password" placeholder="Confirm Password" required /> }
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <button onClick={switchAuthModeHandler}>
        Switch to {isLogin ? 'Sign Up' : 'Login'}
      </button>
    </div>
  );
};

export default Auth;
