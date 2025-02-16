import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="topbar">
      <h1 className="page-title">PlanWise</h1>
      <div className="topbar-buttons">
        <button>Temp1</button>
        <button>Temp2</button>
        <button>Temp3</button>
      </div>
    </div>
  );
};

export default TopBar;