import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import logo from '../assets/logo5.png';
import FeaturesDropdown from './FeaturesDropdown';
import FeaturesContent from './FeaturesContent';

import ResourcesDropdown from './ResourcesDropdown';
import ResourcesContent from './ResourcesContent';

const Header = ({ title, action }) => {
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null); // 'features' or 'resources' or null

    const handleDropdownToggle = (dropdownName) => {
        if (activeDropdown === dropdownName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdownName);
        }
    };

    const renderHeaderContent = () => {
        if (['/login', '/signup', '/'].includes(location.pathname)) {
            return (
                <div className="flex-1 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <FeaturesDropdown 
                            isOpen={activeDropdown === 'features'}
                            onClick={() => handleDropdownToggle('features')}
                        />
                        <ResourcesDropdown 
                            isOpen={activeDropdown === 'resources'}
                            onClick={() => handleDropdownToggle('resources')}
                        />
                        <Link 
                            to="/solutions" 
                            className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Solutions
                        </Link>
                        
                        <Link 
                            to="/pricing" 
                            className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Pricing
                        </Link>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link 
                            to="/contact" 
                            className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Contact Sales
                        </Link>
                        <Link 
                            to="/login" 
                            className="text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/signup" 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                            transition-colors duration-200 text-lg font-semibold"
                        >
                            Start Free
                        </Link>
                    </nav>
                </div>
            );
        }
        return (
            <div className="flex-1 flex justify-between items-center">
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

    return (
        <div className="relative">
            <header className="px-6 py-2 flex items-center w-full box-border h-16 bg-white shadow-sm sticky top-0 z-50">
                <Link to="/" className="flex items-center mr-8">
                    <img 
                        src={logo} 
                        alt="PlanWise Logo" 
                        className="h-[40px] w-auto object-contain" // Even larger at 48px
                    />
                </Link>
                {renderHeaderContent()}
            </header>
            <AnimatePresence mode="wait">
                {activeDropdown && (
                    <div className="absolute top-full left-0 right-0 z-40">
                        {activeDropdown === 'features' ? (
                            <FeaturesContent 
                                isOpen={true}
                                setIsOpen={() => setActiveDropdown(null)}
                            />
                        ) : (
                            <ResourcesContent 
                                isOpen={true}
                                setIsOpen={() => setActiveDropdown(null)}
                            />
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Header;
