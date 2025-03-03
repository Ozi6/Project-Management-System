import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, KanbanSquare, Users, Calendar, Settings, PieChart } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) =>
{
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () =>
    {
        setIsOpen(!isOpen);
    };

    const navItems =
    [
        {
            id: 'team',
            icon: Users,
            label: 'Teams',
            path: '/team',
            color: 'bg-green-100 text-green-600',
            iconColor: 'text-green-600'
        },
        {
            id: 'calendar',
            icon: Calendar,
            label: 'Calendar',
            path: '/calendar',
            color: 'bg-amber-100 text-amber-600',
            iconColor: 'text-amber-600'
        },
    ];

    const getCurrentLabel = () =>
    {
        const currentItem = navItems.find(item => item.id === activeTab);
        return currentItem ? currentItem.label : 'PlanWise';
    };

    return(
        <div className="relative">
            {/* Sidebar Content */}
            <div className={`sidebar fixed top-0 left-0 h-screen bg-white white:bg-gray-800 transition-all duration-300 ${isOpen ? 'w-64 shadow-xl' : 'w-0 shadow-sm'} z-10 overflow-hidden`}>
                <div className="sidebar-content overflow-hidden whitespace-nowrap w-full">

                </div>
            </div>
            
            {/* Toggle Button - Position fixed at a specific height instead of relative to viewport */}
            <button
                onClick={toggleSidebar}
                className={`fixed z-20 top-[50vh] ${isOpen ? 'left-[246px]' : 'left-3'} w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-blue-700 hover:scale-110 transition-all duration-200`}
                style={{ transform: 'translateY(-50%)' }}>
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