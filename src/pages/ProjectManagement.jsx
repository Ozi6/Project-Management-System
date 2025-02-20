import React from 'react';
import { useState } from 'react';
import { 
  Layout, 
  KanbanSquare, 
  Users, 
  Calendar, 
  Settings,
  PieChart,
  Plus
} from 'lucide-react';
import './ProjectManagement.css'; 

const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sampleProjects = [
    { id: 1, name: "Website Redesign", progress: 75, status: "In Progress", dueDate: "2025-03-15" },
    { id: 2, name: "Mobile App Development", progress: 30, status: "In Progress", dueDate: "2025-04-01" },
    { id: 3, name: "Database Migration", progress: 100, status: "Completed", dueDate: "2025-02-28" }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Project Hub</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <Layout className="nav-icon" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`nav-button ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <KanbanSquare className="nav-icon" />
            Projects
          </button>
          <button 
            onClick={() => setActiveTab('team')}
            className={`nav-button ${activeTab === 'team' ? 'active' : ''}`}
          >
            <Users className="nav-icon" />
            Team
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`nav-button ${activeTab === 'calendar' ? 'active' : ''}`}
          >
            <Calendar className="nav-icon" />
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`nav-button ${activeTab === 'reports' ? 'active' : ''}`}
          >
            <PieChart className="nav-icon" />
            Reports
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings className="nav-icon" />
            Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="page-header">
          <div className="header-container">
            <h2 className="page-title">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <button className="new-project-button">
              <Plus className="button-icon" />
              New Project
            </button>
          </div>
        </header>

        <main className="main-area">
          {/* Project Cards */}
          <div className="project-grid">
            {sampleProjects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.name}</h3>
                  <span className={`status-badge ${
                    project.status === 'Completed' ? 'status-completed' : 'status-in-progress'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="progress-container">
                  <div className="progress-info">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{project.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="project-footer">
                  <span className="due-date-label">Due Date:</span>
                  <span className="due-date-value">{project.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectManagement;