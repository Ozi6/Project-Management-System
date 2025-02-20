import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import './Header.css';

const Header = ({ title, action }) => {
  const location = useLocation();
  
  const renderHeaderContent = () => {
    // For login/signup pages
    if (['/login', '/signup', '/'].includes(location.pathname)) {
      return (
        <>
          <div className="logo">PlanWise</div>
          <nav className="nav">
            <Link to="/login" className="nav-link">Log In</Link>
            <Link to="/signup" className="nav-link signup">Sign Up</Link>
          </nav>
        </>
      );
    }
    
    // For authenticated pages
    return (
      <div className="p-4 flex justify-between items-center w-full">
        <h2 className="text-2xl font-semibold text-gray-800">
          {title}
        </h2>
        {action && (
          <button 
            onClick={action.onClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    );
  };

  return (
    <header className={`header ${location.pathname !== '/' ? 'bg-white shadow' : ''}`}>
      {renderHeaderContent()}
    </header>
  );
};

export default Header;