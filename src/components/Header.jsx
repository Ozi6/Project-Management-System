import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo2.png';
import FeaturesDropdown from './FeaturesDropdown';
import FeaturesContent from './FeaturesContent';

const Header = ({ title, action }) => {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const renderHeaderContent = () => {
        if (['/login', '/signup', '/'].includes(location.pathname)) {
            return (
                <>
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center">
                            <img 
                                src={logo} 
                                alt="PlanWise Logo" 
                                className="h-[32px] w-auto object-contain"
                            />
                        </Link>
                        <FeaturesDropdown 
                            isOpen={isDropdownOpen} 
                            setIsOpen={setIsDropdownOpen}
                        />
                    </div>
                    <nav className="flex gap-4">
                        <Link 
                            to="/login" 
                            className="text-gray-600 text-lg hover:text-blue-600 transition-colors duration-200"
                        >
                            Log In
                        </Link>
                        <Link 
                            to="/signup" 
                            className="text-gray-600 text-lg hover:text-blue-600 transition-colors duration-200"
                        >
                            Sign Up
                        </Link>
                    </nav>
                </>
            );
        }
        return (
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

    return (
        <div className="relative">
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="px-5 py-2 flex justify-between items-center w-full box-border h-16 bg-white shadow-sm sticky top-0 z-50"
            >
                {renderHeaderContent()}
            </motion.header>
            <AnimatePresence>
                {isDropdownOpen && <FeaturesContent isOpen={isDropdownOpen} />}
            </AnimatePresence>
        </div>
    );
};

export default Header;
