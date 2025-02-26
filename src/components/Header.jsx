import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo5.png';
import FeaturesDropdown from './FeaturesDropdown';
import FeaturesContent from './FeaturesContent';
import ResourcesDropdown from './ResourcesDropdown';
import ResourcesContent from './ResourcesContent';

const Header = ({ title, action }) => {
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Track window width for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDropdownToggle = (dropdownName) => {
        if (activeDropdown === dropdownName) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dropdownName);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Close any open dropdowns when toggling the mobile menu
        setActiveDropdown(null);
    };

    // Close mobile menu when navigating to a new page
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Update to include feature pages in landing page navigation style
    const isLandingPage = [
        '/login', 
        '/signup', 
        '/',
        '/features/project-management',
        '/features/team-collaboration',
        '/features/task-tracking',
        '/about'
    ].includes(location.pathname) || location.pathname.startsWith('/features/');

    // Desktop navigation for landing pages
    const renderDesktopNavigation = () => (
        <div className="hidden md:flex flex-1 justify-between items-center">
            <div className="flex items-center gap-4 lg:gap-8">
                <FeaturesDropdown 
                    isOpen={activeDropdown === 'features'}
                    onClick={() => handleDropdownToggle('features')}
                />
                <ResourcesDropdown 
                    isOpen={activeDropdown === 'resources'}
                    onClick={() => handleDropdownToggle('resources')}
                />
                <Link 
                    to="/about" 
                    className="text-base lg:text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                    About Us
                </Link>
            </div>
            <nav className="flex items-center gap-3 lg:gap-6">
               
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="text-base lg:text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200">
                            Log In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <Link to="/profile">
                        <UserButton/>
                    </Link>
                </SignedIn>
                <Link 
                    to="/signup" // Changed from "/profile" to "/signup"
                    className="bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-lg hover:bg-blue-700 
                    transition-colors duration-200 text-sm lg:text-lg font-semibold whitespace-nowrap"
                >
                    Start Free
                </Link>
            </nav>
        </div>
    );

    // Desktop title and action for non-landing pages
    const renderDesktopTitleAction = () => (
        <div className="hidden md:flex flex-1 justify-between items-center">
            <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 hover:text-gray-700 transition duration-200">
                {title}
            </h2>
            {action && (
                <button
                    onClick={action.onClick}
                    className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-bold text-sm lg:text-base"
                >
                    {action.icon}
                    {action.label}
                </button>
            )}
        </div>
    );

    // Mobile menu button
    const renderMobileMenuButton = () => (
        <button 
            className="md:hidden ml-auto p-2" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );

    // Mobile menu content
    const renderMobileMenu = () => {
        if (!isMobileMenuOpen) return null;

        return (
            <div className="md:hidden fixed inset-0 bg-white z-40 pt-16 overflow-y-auto">
                <div className="flex flex-col p-4 space-y-4">
                    {isLandingPage ? (
                        // Landing page mobile menu
                        <>
                            <button 
                                onClick={() => handleDropdownToggle('features')}
                                className="text-left py-2 border-b border-gray-200 text-lg font-medium"
                            >
                                Features
                            </button>
                            {activeDropdown === 'features' && (
                                <div className="pl-4 py-2">
                                    <FeaturesContent 
                                        isOpen={true}
                                        setIsOpen={() => setActiveDropdown(null)}
                                        isMobile={true}
                                    />
                                </div>
                            )}
                            
                            <button 
                                onClick={() => handleDropdownToggle('resources')}
                                className="text-left py-2 border-b border-gray-200 text-lg font-medium"
                            >
                                Resources
                            </button>
                            {activeDropdown === 'resources' && (
                                <div className="pl-4 py-2">
                                    <ResourcesContent 
                                        isOpen={true}
                                        setIsOpen={() => setActiveDropdown(null)}
                                        isMobile={true}
                                    />
                                </div>
                            )}
                            
                            <Link 
                                to="/about" 
                                className="block py-2 border-b border-gray-200 text-lg"
                            >
                                About Us
                            </Link>
                            
                            <div className="pt-4 flex flex-col gap-4">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full text-center py-3 border border-gray-300 rounded-lg text-lg">
                                            Log In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                
                                <SignedIn>
                                    <div className="flex justify-center py-2">
                                        <Link to="/profile">
                                            <UserButton/>
                                        </Link>
                                    </div>
                                </SignedIn>
                                
                                <Link 
                                    to="/signup" // Changed from "/profile" to "/signup"
                                    className="w-full text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
                                >
                                    Start Free
                                </Link>
                            </div>
                        </>
                    ) : (
                        // Non-landing page mobile menu
                        <>
                            <h2 className="text-2xl font-semibold text-gray-900 py-2 border-b border-gray-200">
                                {title}
                            </h2>
                            
                            {/* Add back navigation links for non-landing pages too */}
                            <div className="py-4 space-y-4">
                                <Link 
                                    to="/"
                                    className="block py-2 border-b border-gray-200 text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                
                                <Link 
                                    to="/about" 
                                    className="block py-2 border-b border-gray-200 text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                                
                                <Link 
                                    to="/solutions" 
                                    className="block py-2 border-b border-gray-200 text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Solutions
                                </Link>
                                
                            </div>
                            
                            <div className="flex flex-col gap-4 pt-2">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full text-center py-3 border border-gray-300 rounded-lg text-lg">
                                            Log In
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                
                                <SignedIn>
                                    <div className="flex justify-center py-2">
                                        <Link to="/profile">
                                            <UserButton/>
                                        </Link>
                                    </div>
                                </SignedIn>
                                
                                <Link 
                                    to="/signup" // Changed from "/profile" to "/signup"
                                    className="w-full text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
                                >
                                    Start Free
                                </Link>
                            </div>
                            
                            {action && (
                                <button
                                    onClick={() => {
                                        action.onClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-bold"
                                >
                                    {action.icon}
                                    {action.label}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            <header className="px-4 md:px-6 py-2 flex items-center w-full box-border h-16 bg-white/95 shadow-md backdrop-blur-sm sticky top-0 z-[1000]">
                <Link to="/" className="flex items-center mr-4 md:mr-8">
                    <img 
                        src={logo} 
                        alt="PlanWise Logo" 
                        className="h-[32px] md:h-[40px] w-auto object-contain" 
                    />
                </Link>
                {isLandingPage ? renderDesktopNavigation() : renderDesktopTitleAction()}
                {renderMobileMenuButton()}
            </header>
            
            {/* Mobile menu */}
            {renderMobileMenu()}
            
            {/* Desktop dropdowns */}
            <AnimatePresence mode="wait">
                {activeDropdown && windowWidth >= 768 && (
                    <div className="absolute top-full left-0 right-0 z-[999]">
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