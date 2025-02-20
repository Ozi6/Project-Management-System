import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ title, action }) =>
{
    const location = useLocation();

    const renderHeaderContent = () =>
    {
        if (['/login', '/signup', '/'].includes(location.pathname))
        {
            return(
                <>
                    <div className="text-4xl font-bold text-blue-600 logo">PlanWise</div>
                    <nav className="nav flex space-x-6">
                        <Link to="/login" className="text-lg text-gray-600 hover:text-blue-600 transition duration-200">Log In</Link>
                        <Link to="/signup" className="text-lg text-gray-600 hover:text-blue-600 transition duration-200">Sign Up</Link>
                    </nav>
                </>
            );
        }
        return(
            <div className="p-4 flex justify-between items-center w-full">
                <h2 className="text-3xl font-semibold text-gray-900 hover:text-gray-700 transition duration-200">
                    {title}
                </h2>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-bold"
                    >
                        {action.icon}
                        {action.label}
                    </button>
                )}
            </div>
        );
    };
    return(
        <header className={`header ${location.pathname !== '/' ? 'bg-white shadow-lg' : ''}`}>
            {renderHeaderContent()}
        </header>
    );
};

export default Header;
