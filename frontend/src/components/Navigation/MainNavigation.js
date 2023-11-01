// src/components/Navigation/MainNavigation.js
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './MainNavigation.css'; 

const MainNavigation = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <nav className="main-navigation__items">
        <ul>
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/home" isActive={(match, location) => location.pathname === "/home"}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" isActive={(match, location) => location.pathname === "/dashboard"}>Dashboard</NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to="/auth" isActive={(match, location) => location.pathname === "/auth"}>Authenticate</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default React.memo(MainNavigation);

