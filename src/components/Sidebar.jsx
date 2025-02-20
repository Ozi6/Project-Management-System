import React, { useState, useEffect } from 'react';
import { Layout, KanbanSquare, Users, Calendar, Settings, PieChart, ChevronLeft, ChevronRight } from "lucide-react";
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [buttonTop, setButtonTop] = useState(0);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const updateButtonPosition = () => {
      const sidebarHeight = document.querySelector('.sidebar')?.offsetHeight || 0;
      setButtonTop(sidebarHeight / 2);
    };
    updateButtonPosition();
    window.addEventListener('resize', updateButtonPosition);
    return () => window.removeEventListener('resize', updateButtonPosition);
  }, []);

  const navItems = [
    { id: 'dashboard', icon: Layout, label: 'Dashboard' },
    { id: 'projects', icon: KanbanSquare, label: 'Projects' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'reports', icon: PieChart, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'landingpage', icon: Layout, label: 'Landing Page' }
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      <div className="sidebar-content">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Project Hub</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full p-4 flex items-center text-left ${
                  activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-600"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;