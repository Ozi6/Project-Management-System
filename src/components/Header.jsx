// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">PlanWise</div>
      <nav className="nav">
        <Link to="/login" className="nav-link">Log In</Link>
        <Link to="/signup" className="nav-link signup">Sign Up</Link>
      </nav>
    </header>
  );
};

export default Header;