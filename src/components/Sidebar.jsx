import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, KanbanSquare, Users, Calendar, Settings, PieChart } from "lucide-react";
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) =>
{
    const [isOpen, setIsOpen] = useState(true);
    const [buttonTop, setButtonTop] = useState(0);

    const toggleSidebar = () =>
    {
        setIsOpen(!isOpen);
    };

    useEffect(() =>
    {
        const updateButtonPosition = () =>
        {
            const sidebarHeight = document.querySelector('.sidebar')?.offsetHeight || 0;
            setButtonTop(sidebarHeight / 2);
        };
        updateButtonPosition();
        window.addEventListener('resize', updateButtonPosition);
        return () => window.removeEventListener('resize', updateButtonPosition);
    }, []);

    const navItems =
    [
        { id: 'dashboard', icon: Layout, label: 'Dashboard' },
        { id: 'projects', icon: KanbanSquare, label: 'Projects' },
        { id: 'team', icon: Users, label: 'Team' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'reports', icon: PieChart, label: 'Reports' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'landingpage', icon: Layout, label: 'Landing Page' }
    ];

    return(
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-content">
                <Link to="/" className="p-4 flex items-center space-x-2 no-underline hover:bg-gray-50 transition-colors duration-200">
                    <Layout className="h-8 w-8 text-gray-600" />
                    <h1 className="text-4xl font-bold text-blue-600 logo">PlanWise</h1>
                </Link>
                <nav className="mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full p-4 flex items-center text-left ${activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}>
                                <Icon className="mr-3 h-5 w-5" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
            <button
                className="toggle-button"
                onClick={toggleSidebar}
                style={{ top: `${buttonTop}px` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
        </div>
    );
};

export default Sidebar;
