import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, KanbanSquare, Users, Calendar, Settings, PieChart } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) =>
{
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () =>
    {
        setIsOpen(!isOpen);
    };

    const navItems =
    [
        // Your nav items here
    ];

    const getCurrentLabel = () =>
    {
        const currentItem = navItems.find(item => item.id === activeTab);
        return currentItem ? currentItem.label : 'PlanWise';
    };

    return(
        <div className="relative">
            {/* Sidebar Content */}
            <div className={`sidebar fixed top-0 left-0 h-screen bg-white white:bg-gray-800 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} shadow-md z-10 overflow-hidden`}>
                <div className="sidebar-content overflow-hidden whitespace-nowrap w-full">
                    <Link to="/" className="p-8 flex items-center space-x-2 no-underline hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Layout className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                        <h1 className={`text-2xl font-bold text-blue-600 dark:text-blue-400 logo ${!isOpen ? 'hidden' : ''}`}>
                            {getCurrentLabel()}
                        </h1>
                    </Link>
                    <nav className="mt-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full p-4 flex items-center text-left transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:scale-105 ${activeTab === item.id ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "text-gray-600 dark:text-gray-300"}`}>
                                    <Icon className="mr-3 h-6 w-6" />
                                    <span className={!isOpen ? 'hidden' : ''}>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
            
            {/* Toggle Button - Position fixed at a specific height instead of relative to viewport */}
            <button
                onClick={toggleSidebar}
                className={`fixed z-20 top-[50vh] ${isOpen ? 'left-[246px]' : 'left-3'} w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 hover:scale-110 transition-all duration-200`}
                style={{ transform: 'translateY(-50%)' }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    className={`h-5 w-5 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
        </div>
    );
};

export default Sidebar;