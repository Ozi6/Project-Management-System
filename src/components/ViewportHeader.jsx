import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { Menu, X, PlusCircle, Moon, Sun, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import logoLight from '../assets/logo5.png';
import logoDark from '../assets/logodark.png';
import logoPink from '../assets/logopink.png';
import FeaturesDropdown from './FeaturesDropdown';
import ResourcesDropdown from './ResourcesDropdown';
import ResourcesContent from './ResourcesContent';
import ToggleButton from './ToggleButton';
import SearchBar from './SearchBar';
import { useSearch } from '../scripts/SearchContext';
import ThemeSwitcher from '../ThemeSwitcher';
import { useTranslation } from 'react-i18next';
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { generateActivityMessage } from '../utils/activityUtils';

const Header = ({ title, action, isHorizontalLayout, toggleLayout, onAddCategorizer, zoomLevel = 1, onZoomChange, projectId }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { performSearch, filterColumns } = useSearch();
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationsRef = useRef(null);
    const [showActivities, setShowActivities] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(false);
    const activitiesRef = useRef(null);
    const { getToken } = useAuth();
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const themeDropdownRef = useRef(null);

    // Get the appropriate logo based on the current theme
    const getLogoByTheme = () => {
        switch (currentTheme) {
            case "dark":
                return logoDark;
            case "pink":
                return logoPink;
            default:
                return logoLight;
        }
    };

    // Listen for theme changes
    useEffect(() => {
        const handleThemeChange = () => {
            // Get theme from localStorage
            const theme = localStorage.getItem("theme") || "light";
            setCurrentTheme(theme);
        };

        // Initial theme check
        handleThemeChange();

        // Listen for theme changes from localStorage
        window.addEventListener('storage', handleThemeChange);

        // Create a custom event listener for theme changes
        const themeChangeListener = (e) => {
            if (e.detail && e.detail.theme) {
                setCurrentTheme(e.detail.theme);
            }
        };

        // Add the custom event listener
        window.addEventListener('themeChanged', themeChangeListener);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
            window.removeEventListener('themeChanged', themeChangeListener);
        };
    }, []);

    // Close theme dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
                setIsThemeDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const changeTheme = (theme) => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
        setCurrentTheme(theme);

        // Dispatch a custom event for theme change
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));

        // Close the dropdown after selection
        setIsThemeDropdownOpen(false);
    };

    const renderThemeToggle = () => {
        // For desktop view, use the existing ThemeSwitcher component
        if (windowWidth >= 640) {
            return <ThemeSwitcher />;
        }

        // For mobile view, create a dropdown
        return (
            <div className="relative" ref={themeDropdownRef}>
                <button
                    onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                    className="p-2 rounded-full hover:bg-[var(--hover-color)]/20 transition-colors duration-200 flex items-center"
                    aria-label="Theme options"
                >
                    {currentTheme === 'light' ? (
                        <Sun size={18} />
                    ) : currentTheme === 'dark' ? (
                        <Moon size={18} />
                    ) : (
                        <div className="w-[18px] h-[18px] rounded-full bg-pink-500"></div>
                    )}
                    <ChevronDown size={14} className="ml-1" />
                </button>

                {isThemeDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-36 rounded-lg shadow-lg overflow-hidden z-50 border"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            borderColor: "var(--features-border)"
                        }}
                    >
                        <div className="py-1">
                            <button
                                onClick={() => changeTheme('light')}
                                className="flex items-center px-4 py-2 w-full text-left hover:bg-[var(--hover-color)]/10 transition-colors"
                                style={{
                                    backgroundColor: currentTheme === 'light' ? 'var(--hover-color)/10' : 'transparent'
                                }}
                            >
                                <Sun size={16} className="mr-2" />
                                <span>Light</span>
                            </button>
                            <button
                                onClick={() => changeTheme('dark')}
                                className="flex items-center px-4 py-2 w-full text-left hover:bg-[var(--hover-color)]/10 transition-colors"
                                style={{
                                    backgroundColor: currentTheme === 'dark' ? 'var(--hover-color)/10' : 'transparent'
                                }}
                            >
                                <Moon size={16} className="mr-2" />
                                <span>Dark</span>
                            </button>
                            <button
                                onClick={() => changeTheme('pink')}
                                className="flex items-center px-4 py-2 w-full text-left hover:bg-[var(--hover-color)]/10 transition-colors"
                                style={{
                                    backgroundColor: currentTheme === 'pink' ? 'var(--hover-color)/10' : 'transparent'
                                }}
                            >
                                <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                                <span>Pink</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

    const fetchRecentActivities = async () => {
        setIsLoadingActivities(true);
        try {
            const token = await getToken();

            const projectResponse = await axios.get(
                `http://localhost:8080/api/projects/${projectId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );
            const projectName = projectResponse.data.projectName;

            const response = await axios.get(
                `http://localhost:8080/api/projects/${projectId}/activities`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            const activitiesWithProject = response.data.map(activity => ({
                ...activity,
                project: {
                    projectId: projectId,
                    projectName: projectName
                }
            }));
            const sortedActivities = activitiesWithProject
                .sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime))
                .slice(0, 5);
            setRecentActivities(sortedActivities);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        } finally {
            setIsLoadingActivities(false);
        }
    };

    useEffect(() => {
        if (projectId)
            fetchRecentActivities();
    }, [projectId]);

    const handleActivityClick = async (activityId) => {
        await markActivityAsSeen(activityId);
    };

    const handleSeeAllClick = async () => {
        await markAllActivitiesAsSeen();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activitiesRef.current && !activitiesRef.current.contains(event.target))
                setShowActivities(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatActivityTime = (timeString) => {
        const time = new Date(timeString);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getActivityIcon = (actionType) => {
        const icons =
        {
            CREATE: '+',
            UPDATE: '↻',
            DELETE: '×',
            COMMENT: '💬',
            MOVE: '⇄',
            COMPLETE: '✓'
        };
        return icons[actionType] || '•';
    };

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target))
                setShowNotifications(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDropdownToggle = (dropdownName) => {
        if (activeDropdown === dropdownName)
            setActiveDropdown(null);
        else
            setActiveDropdown(dropdownName);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActiveDropdown(null);
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const renderActivitiesButton = () => {
        const unseenCount = recentActivities.filter(activity => !activity.seen).length;

        return (
            <div className="relative" ref={activitiesRef}>
                <button
                    onClick={() => {
                        setShowActivities(!showActivities);
                    }}
                    className="p-2 rounded-full hover:bg-[var(--hover-color)]/20 transition-colors duration-200 relative"
                    aria-label="Recent Activities"
                >
                    <Bell size={windowWidth < 640 ? 18 : 22} />
                    {unseenCount > 0 && (
                        <span className="absolute top-0 right-0 bg-[var(--features-icon-color)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unseenCount}
                        </span>
                    )}
                </button>

                {showActivities && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 mt-2 w-72 sm:w-80 rounded-lg shadow-lg overflow-hidden z-50 border"
                        style={{
                            backgroundColor: "var(--bg-color)",
                            borderColor: "var(--features-border)"
                        }}
                    >
                        <div className="flex justify-between items-center px-4 py-2 border-b"
                            style={{
                                backgroundColor: "var(--bg-color)",
                                borderColor: "var(--features-border)"
                            }}
                        >
                            <h3 className="font-medium" style={{ color: "var(--features-title-color)" }}>
                                {t('activity.notifications.title')}
                            </h3>
                            <button
                                onClick={handleSeeAllClick}
                                className="text-sm hover:opacity-80 transition-opacity"
                                style={{ color: "var(--features-icon-color)" }}
                            >
                                {t('activity.notifications.mark_all_read')}
                            </button>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {isLoadingActivities ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                                        style={{ borderColor: "var(--features-icon-color)" }}
                                    ></div>
                                    <span className="ml-2" style={{ color: "var(--features-text-color)" }}>
                                        {t('activity.notifications.loading')}
                                    </span>
                                </div>
                            ) : recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                    <div
                                        key={activity.activityId}
                                        onClick={() => handleActivityClick(activity.activityId)}
                                        className={`px-4 py-3 border-b cursor-pointer transition-colors ${!activity.seen ? 'bg-opacity-10' : ''
                                            }`}
                                        style={{
                                            borderColor: "var(--features-border)",
                                            backgroundColor: !activity.seen ? "var(--gray-card3)" : "transparent",
                                            color: "var(--features-text-color)"
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <span className="text-lg" style={{ color: "var(--features-icon-color)" }}>
                                                    {getActivityIcon(activity.actionType)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium" style={{ color: "var(--features-title-color)" }}>
                                                    {generateActivityMessage(activity, t)}
                                                </p>
                                                <p className="text-xs mt-1" style={{ color: "var(--features-text-color)" }}>
                                                    {formatActivityTime(activity.activityTime)}
                                                </p>
                                                {activity.entityName && (
                                                    <p className="text-xs mt-1 truncate" style={{ color: "var(--features-text-color)" }}>
                                                        {activity.entityName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center" style={{ color: "var(--features-text-color)" }}>
                                    {t('activity.notifications.no_activities')}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        );
    };

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

    const markActivityAsSeen = async (activityId) => {
        try {
            const token = await getToken();
            await axios.patch(
                `http://localhost:8080/api/projects/${projectId}/activities/${activityId}/seen`,
                {},
                {
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            setRecentActivities(prev => prev.map(activity =>
                activity.activityId === activityId ? { ...activity, seen: true } : activity
            ));
        } catch (error) {
            console.error('Error marking activity as seen:', error);
        }
    };

    const markAllActivitiesAsSeen = async () => {
        try {
            const token = await getToken();
            await axios.patch(
                `http://localhost:8080/api/projects/${projectId}/activities/mark-all-seen`,
                {},
                {
                    headers:
                    {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            setRecentActivities(prev => prev.map(activity =>
                ({ ...activity, seen: true })
            ));
        } catch (error) {
            console.error('Error marking all activities as seen:', error);
        }
    };

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
        if (!isMobileMenuOpen)
            return null;
        return (
            <div className="md:hidden fixed inset-0 bg-white z-50 pt-16 overflow-y-auto">
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
                                        {t("prode.create")}
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

    return (
        <div className="relative">
            <header className="fixed top-0 left-0 right-0 px-2 sm:px-4 md:px-6 py-2 flex items-center w-full box-border h-16 bg-[var(--bg-color)]/95 shadow-md backdrop-blur-sm z-[1000]">
                <div className="flex items-center  rounded-lg px-3 h-full ">

                    <Link to="/" className="flex items-center mr-2 sm:mr-4 md:mr-8 flex-shrink-0">
                        <img
                            src={getLogoByTheme()}
                            alt="PlanWise Logo"
                            className="h-[28px] sm:h-[32px] md:h-[40px] w-auto object-contain" />
                    </Link>
                </div>
                <div className="hidden sm:block h-6 w-px bg-gray-300 mx-2 sm:mx-4" />
                {windowWidth >= 768 && (
                    <div onClick={() => toggleLayout(!isHorizontalLayout)} className="mr-2 flex-shrink-0">
                        <ToggleButton isChecked={isHorizontalLayout} />
                    </div>
                )}
                {isLandingPage ? renderDesktopNavigation() : (
                    <div className="hidden md:flex flex-1 justify-between items-center overflow-hidden">
                        <h2 className="text-xl lg:text-3xl font-semibold text-gray-900 truncate">
                            {title}
                        </h2>
                    </div>
                )}
                {renderMobileMenuButton()}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-4 ml-auto mr-2 sm:mr-4 flex-shrink-0">
                    {renderActivitiesButton()}
                    {renderThemeToggle()}
                    {onAddCategorizer && (
                        <button
                            onClick={onAddCategorizer}
                            className="bg-[var(--features-icon-color)] hover:[var(--hover-color)] !text-white px-2 py-2 sm:px-3 md:px-4 lg:px-5 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-bold text-xs md:text-sm lg:text-base">
                            <PlusCircle size={windowWidth < 640 ? 16 : 20} className="sm:mr-2" />
                            <span className="hidden sm:inline">{t("prode.create")}</span>
                        </button>
                    )}
                    {action && (
                        <button
                            onClick={action.onClick}
                            className="bg-[var(--features-icon-color)] hover:bg-[var(--hover-color)] text-white px-2 py-2 sm:px-3 md:px-4 lg:px-6 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-bold text-xs md:text-sm lg:text-base">
                            {action.icon}
                            <span className="hidden sm:inline">{action.label}</span>
                        </button>
                    )}
                </div>
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