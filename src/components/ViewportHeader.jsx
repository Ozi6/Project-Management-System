import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { Menu, X, PlusCircle, Moon, Sun } from 'lucide-react';
// import { useDarkMode } from '../scripts/DarkModeContext';
import logo from '../assets/logo5.png';
import FeaturesDropdown from './FeaturesDropdown';
import ResourcesDropdown from './ResourcesDropdown';
import ResourcesContent from './ResourcesContent';
import ToggleButton from './ToggleButton';
import SearchBar from './SearchBar';
import { useSearch } from '../scripts/SearchContext';

const Header = ({ title, action, isHorizontalLayout, toggleLayout, onAddCategorizer, zoomLevel = 1, onZoomChange }) => {
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { performSearch, filterColumns } = useSearch();

    const handleSearch = (term) => {
        performSearch(term);
        filterColumns(columns, term);
    };

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
        setActiveDropdown(null);
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const isLandingPage =
        [
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
                    onClick={() => handleDropdownToggle('features')} />
                <ResourcesDropdown
                    isOpen={activeDropdown === 'resources'}
                    onClick={() => handleDropdownToggle('resources')} />
                <Link
                    to="/about"
                    className="text-base lg:text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200">
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
                        <UserButton />
                    </Link>
                </SignedIn>
                <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-lg hover:bg-blue-700 
                    transition-colors duration-200 text-sm lg:text-lg font-semibold whitespace-nowrap">
                    Go to Dashboard
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
        </div>
    );

    const renderMobileMenuButton = () => (
        <button
            className="md:hidden ml-auto p-2"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );

    const renderMobileMenu = () => {
        if (!isMobileMenuOpen) return null;

        return (
            <div className="md:hidden fixed inset-0 bg-white z-40 pt-16 overflow-y-auto">
                <div className="flex flex-col p-4 space-y-4">
                    {isLandingPage ? (
                        <>
                            <button
                                onClick={() => handleDropdownToggle('features')}
                                className="text-left py-2 border-b border-gray-200 text-lg font-medium">
                                Features
                            </button>
                            {activeDropdown === 'features' && (
                                <div className="pl-4 py-2">
                                    <FeaturesContent
                                        isOpen={true}
                                        setIsOpen={() => setActiveDropdown(null)}
                                        isMobile={true} />
                                </div>
                            )}

                            <button
                                onClick={() => handleDropdownToggle('resources')}
                                className="text-left py-2 border-b border-gray-200 text-lg font-medium">
                                Resources
                            </button>
                            {activeDropdown === 'resources' && (
                                <div className="pl-4 py-2">
                                    <ResourcesContent
                                        isOpen={true}
                                        setIsOpen={() => setActiveDropdown(null)}
                                        isMobile={true} />
                                </div>
                            )}
                            <Link
                                to="/about"
                                className="block py-2 border-b border-gray-200 text-lg">
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
                                            <UserButton />
                                        </Link>
                                    </div>
                                </SignedIn>

                                <Link
                                    to="/signup"
                                    className="w-full text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-medium"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-900 py-2 border-b border-gray-200">
                                {title}
                            </h2>
                            {/* Add back navigation links for non-landing pages too */}
                            <div className="py-4 space-y-4">
                                <Link
                                    to="/"
                                    className="block py-2 border-b border-gray-200 text-lg"
                                    onClick={() => setIsMobileMenuOpen(false)}>
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
                                    onClick={() => setIsMobileMenuOpen(false)}>
                                    Solutions
                                </Link>

                            </div>

                            <div className="flex flex-col gap-4 pt-2">
                                {onAddCategorizer && (
                                    <button
                                        onClick={() => {
                                            onAddCategorizer();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-center bg-green-600 text-white py-3 rounded-lg text-lg font-medium flex items-center justify-center">
                                        <PlusCircle size={20} className="mr-2" />
                                        Create Categorizer
                                    </button>
                                )}

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
                                            <UserButton />
                                        </Link>
                                    </div>
                                </SignedIn>

                                <Link
                                    to="/signup"
                                    className="w-full text-center bg-blue-600 text-white py-3 rounded-lg text-lg font-medium">
                                    Start Free
                                </Link>
                            </div>

                            {action && (
                                <button
                                    onClick={() => {
                                        action.onClick();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-bold">
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

    // Add a zoom control to the header
    const zoomOptions = [
        { label: "50%", value: 0.5 },
        { label: "70%", value: 0.7 },
        { label: "85%", value: 0.85 },
        { label: "100%", value: 1 },
    ];

    // Modified zoom control with better responsive design
    const renderZoomControl = () => {
        if (!onZoomChange) return null;

        return (
            <div className="hidden md:flex items-center">
                <span className="text-sm text-gray-600 mr-2">Zoom:</span>
                <select
                    value={zoomLevel}
                    onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                    className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                    {zoomOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    // Add a more compact zoom control for mobile
    const renderMobileZoomControl = () => {
        if (!onZoomChange) return null;

        return (
            <select
                value={zoomLevel}
                onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                className="md:hidden bg-white border border-gray-300 rounded-md px-1 py-1 text-xs"
                aria-label="Zoom level"
            >
                {zoomOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div className="relative">
            <header className="fixed top-0 left-0 right-0 px-2 sm:px-4 md:px-6 py-2 flex items-center w-full box-border h-16 bg-white/95 shadow-md backdrop-blur-sm z-[1000]">
                {/* Logo - Always visible but smaller on mobile */}
                <Link to="/" className="flex items-center mr-2 sm:mr-4 md:mr-8 flex-shrink-0">
                    <img
                        src={logo}
                        alt="PlanWise Logo"
                        className="h-[28px] sm:h-[32px] md:h-[40px] w-auto object-contain" />
                </Link>
                
                {/* Divider - Hide on very small screens */}
                <div className="hidden sm:block h-6 w-px bg-gray-300 mx-2 sm:mx-4" />
                
                {/* Toggle button - Always visible */}
                <div onClick={() => toggleLayout(!isHorizontalLayout)} className="mr-2 flex-shrink-0">
                    <ToggleButton isChecked={isHorizontalLayout} />
                </div>
                
                {/* Title or Navigation */}
                {isLandingPage ? renderDesktopNavigation() : (
                    <div className="hidden md:flex flex-1 justify-between items-center overflow-hidden">
                        <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 truncate">
                            {title}
                        </h2>
                    </div>
                )}
                
                {/* Mobile menu button - Order changed to be more accessible */}
                {renderMobileMenuButton()}
                
                {/* Controls - Responsive Layout */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-4 ml-auto mr-2 sm:mr-4 flex-shrink-0">
                    {/* Zoom Control */}
                    {renderZoomControl()}
                    {renderMobileZoomControl()}
                    
                    {/* Create Categorizer Button - Hide text on small screens */}
                    {onAddCategorizer && (
                        <button
                            onClick={onAddCategorizer}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 sm:px-3 md:px-4 lg:px-5 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-bold text-xs md:text-sm lg:text-base">
                            <PlusCircle size={windowWidth < 640 ? 16 : 20} className="sm:mr-2" />
                            <span className="hidden sm:inline">Create Categorizer</span>
                        </button>
                    )}
                    
                    {/* Action Button - Adapt to screen size */}
                    {action && (
                        <button
                            onClick={action.onClick}
                            className="bg-blue-600 hover:bg-blue-800 text-white px-2 py-2 sm:px-3 md:px-4 lg:px-6 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-bold text-xs md:text-sm lg:text-base">
                            {action.icon}
                            <span className="hidden sm:inline">{action.label}</span>
                        </button>
                    )}
                </div>
                
                {/* Search Bar - Responsive width */}
                <div className="flex-1 max-w-[120px] sm:max-w-[200px] md:max-w-md mx-1 sm:mx-2 md:mx-4">
                    <SearchBar onSearch={handleSearch} />
                </div>
            </header>

            {renderMobileMenu()}

            <AnimatePresence mode="wait">
                {activeDropdown && windowWidth >= 768 && (
                    <div className="fixed top-16 left-0 right-0 z-[999]">
                        {activeDropdown === 'features' ? (
                            <FeaturesContent
                                isOpen={true}
                                setIsOpen={() => setActiveDropdown(null)} />) : (<ResourcesContent
                                    isOpen={true}
                                    setIsOpen={() => setActiveDropdown(null)} />
                        )}
                    </div>
                )}
            </AnimatePresence>
            <div className="h-16"></div>
        </div>
    );
};

export default Header;