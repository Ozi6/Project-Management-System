import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Menu, X, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import logo from '../assets/logo5.png';
import FeaturesDropdown from './FeaturesDropdown';
import FeaturesContent from './FeaturesContent';
import ResourcesDropdown from './ResourcesDropdown';
import ResourcesContent from './ResourcesContent';

const Header = ({ title, action, rightContent }) => {
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { user } = useUser();
    
    // Check if user has admin role
    const isAdmin = user?.publicMetadata?.role === 'admin';

    const navigate = useNavigate();
    const handleLoginRedirect = () => {
        navigate('/login');
    };

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
        '/about',
        '/terms',
        '/privacy',
        '/faq'
    ].includes(location.pathname) || location.pathname.startsWith('/features/');

    // Desktop navigation for landing pages
    const renderDesktopNavigation = () => (
        <div className="hidden md:flex flex-1 justify-between items-center">
            <div className="flex items-center gap-3 lg:gap-6">
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
                    className="text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                    About Us
                </Link>
                
                {/* Admin-only Issues/Tickets link with enhanced visibility */}
                {isAdmin && (
                    <Link 
                        to="/admin/issues" 
                        className="text-sm lg:text-base text-orange-600 hover:text-orange-700 transition-colors duration-200 flex items-center"
                    >
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Issues
                    </Link>
                )}
            </div>
            <nav className="flex items-center gap-2 lg:gap-4">
                {/* Admin badge - UPDATED FOR LARGER SIZE */}
                {isAdmin && (
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm font-semibold shadow-md">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Admin
                    </div>
                )}
                
                <SignedOut>
                    <div className="flex items-center gap-2 lg:gap-3">
                        <button 
                            className="text-sm lg:text-base text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            onClick={handleLoginRedirect}
                        >
                            Log In
                        </button>
                        <Link 
                            to="/signup"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm lg:text-base px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                </SignedOut>
                <SignedIn>
                    <Link to="/profile" className="flex items-center">
                        {isAdmin && (
                            <div className="relative">
                                <UserButton />
                                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-600 border-2 border-white shadow-sm"></div>
                            </div>
                        )}
                        {!isAdmin && <UserButton />}
                    </Link>
                </SignedIn>
                
                {/* Rest of the navigation */}
            </nav>
        </div>
    );

    // Desktop title and action for non-landing pages
    const renderDesktopTitleAction = () => (
        <div className="hidden md:flex flex-1 justify-between items-center">
            <div className="flex items-center">
                <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 hover:text-gray-700 transition duration-200">
                    {title}
                </h2>
                
                {/* Add admin indicator for non-landing pages - UPDATED */}
                {isAdmin && (
                    <div className="ml-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm font-semibold shadow-md">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Admin
                    </div>
                )}
            </div>
            
            <div className="flex items-center gap-4">
                {rightContent}
                {/* Show action button on /projects or /bugs pages */}
                {action && (location.pathname === '/projects' || location.pathname === '/bugs') && (
                    <button
                        onClick={action.onClick}
                        className={`${
                            location.pathname === '/bugs' || location.pathname.includes('/incidents')
                                ? 'bg-rose-600 hover:bg-rose-700'
                                : 'bg-blue-600 hover:bg-blue-800'
                        } text-white px-3 py-1.5 lg:px-5 lg:py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md font-bold text-xs lg:text-sm`}
                    >
                        {action.icon}
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );

    // Mobile menu button
    const renderMobileMenuButton = () => (
        <button 
            className="md:hidden ml-auto p-1.5" 
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
    );

    // Mobile menu content
    const renderMobileMenu = () => {
        if (!isMobileMenuOpen) return null;

        return (
            <div className="md:hidden fixed inset-0 bg-white z-40 pt-14 overflow-y-auto">
                <div className="flex flex-col p-4 space-y-3">
                    {/* Add admin indicator at top of mobile menu - UPDATED */}
                    {isAdmin && (
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-md flex items-center justify-center mb-3 shadow-md">
                            <ShieldAlert className="h-5 w-5 mr-2" />
                            <span className="font-bold text-lg">Admin Account</span>
                        </div>
                    )}
                    
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
                            
                            {/* Admin-only Issues/Tickets link for mobile */}
                            {isAdmin && (
                                <Link 
                                    to="/admin/issues" 
                                    className="block py-2 border-b border-gray-200 text-lg text-orange-600 flex items-center"
                                >
                                    <AlertCircle className="mr-1 h-4 w-4" />
                                    Issues
                                </Link>
                            )}
                            
                            <div className="pt-4 flex flex-col gap-4">
                                <SignedOut>
                                    <button 
                                        className="w-full text-center py-3 border border-gray-300 rounded-lg text-lg"
                                        onClick={handleLoginRedirect}
                                    >
                                        Log In
                                    </button>
                                </SignedOut>
                                
                                <SignedIn>
                                    <div className="flex justify-center py-2">
                                        <Link to="/profile">
                                            <UserButton />
                                        </Link>
                                    </div>
                                </SignedIn>
                                
                                <Link 
                                    to="/signup" 
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
                                
                                {/* Admin-only Issues/Tickets link for mobile */}
                                {isAdmin && (
                                    <Link 
                                        to="/admin/issues" 
                                        className="block py-2 border-b border-gray-200 text-lg text-orange-600 flex items-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <AlertCircle className="mr-1 h-4 w-4" />
                                        Issues
                                    </Link>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-4 pt-2">
                                <SignedOut>
                                    <button 
                                        className="w-full text-center py-3 border border-gray-300 rounded-lg text-lg"
                                        onClick={handleLoginRedirect}
                                    >
                                        Log In
                                    </button>
                                </SignedOut>
                                
                                <SignedIn>
                                    <div className="flex justify-center py-2">
                                        <Link to="/profile">
                                            <UserButton />
                                        </Link>
                                    </div>
                                </SignedIn>
                                
                                <Link 
                                    to="/signup" 
                                    className="w-full text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
                                >
                                    Start Free
                                </Link>
                            </div>
                            
                            {action && location.pathname === '/projects' && (
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
            <header className="px-3 md:px-5 py-1.5 flex items-center w-full box-border h-14 bg-white/95 shadow-sm backdrop-blur-sm sticky top-0 z-[1000]">
                <Link to="/" className="flex items-center mr-3 md:mr-6">
                    <img 
                        src={logo} 
                        alt="PlanWise Logo" 
                        className="h-[26px] md:h-[32px] w-auto object-contain" 
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
                    <div className="absolute top-14 left-0 right-0 z-[999]">
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