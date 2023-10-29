// src/components/Navigation/MainNavigation.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css'; 

const MainNavigation = () => {
    return (
      <header className="main-navigation">
        <div className="main-navigation__logo">
          <h1>MyApp</h1>
        </div>
        <nav className="main-navigation__items">
          <ul>
            <li>
              <NavLink to="/home" isActive={(match, location) => location.pathname === "/home"}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/auth" isActive={(match, location) => location.pathname === "/auth"}>Authenticate</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" isActive={(match, location) => location.pathname === "/dashboard"}>Dashboard</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    );
  };
  

export default React.memo(MainNavigation);
