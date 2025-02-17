import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const Sidebar = () =>
{
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button
        className="toggle-button"
        onClick={toggleSidebar}
        style={{ top: `${buttonTop}px` }}
      >
        {isOpen ? '<' : '>'}
      </button>
      <div className="sidebar-content">
        <p>sidebaring</p>
      </div>
    </div>
  );
};

export default Sidebar;