import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  CheckCircle, Clock, AlertCircle,
  GanttChartSquare
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';

const ProjectCalendar = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  
  // Sample data for projects and tasks
  useEffect(() => {
    const sampleProjects = [
      {
        id: 1,
        name: 'Website Redesign',
        startDate: '2025-03-01',
        endDate: '2025-04-15',
        progress: 75,
        status: 'In Progress',
        color: '#3b82f6', // blue
        tasks: [
          { 
            id: 101, 
            name: 'UX Research', 
            startDate: '2025-03-01', 
            endDate: '2025-03-05', 
            progress: 100, 
            status: 'Completed',
            dependencies: []
          },
          { 
            id: 102, 
            name: 'Wireframing', 
            startDate: '2025-03-06', 
            endDate: '2025-03-10', 
            progress: 100, 
            status: 'Completed',
            dependencies: [101]
          },
          { 
            id: 103, 
            name: 'UI Design', 
            startDate: '2025-03-11', 
            endDate: '2025-03-20', 
            progress: 85, 
            status: 'In Progress',
            dependencies: [102]
          },
          { 
            id: 104, 
            name: 'Frontend Development', 
            startDate: '2025-03-15', 
            endDate: '2025-04-05', 
            progress: 60, 
            status: 'In Progress',
            dependencies: [102]
          },
          { 
            id: 105, 
            name: 'Testing & QA', 
            startDate: '2025-04-06', 
            endDate: '2025-04-15', 
            progress: 0, 
            status: 'Not Started',
            dependencies: [103, 104]
          }
        ]
      },
      {
        id: 2,
        name: 'Mobile App Development',
        startDate: '2025-02-15',
        endDate: '2025-05-01',
        progress: 30,
        status: 'In Progress',
        color: '#8b5cf6', // purple
        tasks: [
          { 
            id: 201, 
            name: 'Requirements Gathering', 
            startDate: '2025-02-15', 
            endDate: '2025-02-25', 
            progress: 100, 
            status: 'Completed',
            dependencies: []
          },
          { 
            id: 202, 
            name: 'Wireframing', 
            startDate: '2025-02-26', 
            endDate: '2025-03-10', 
            progress: 100, 
            status: 'Completed',
            dependencies: [201]
          },
          { 
            id: 203, 
            name: 'UI Design', 
            startDate: '2025-03-11', 
            endDate: '2025-03-25', 
            progress: 80, 
            status: 'In Progress',
            dependencies: [202]
          },
          { 
            id: 204, 
            name: 'Client Presentation', 
            startDate: '2025-03-18', 
            endDate: '2025-03-18', 
            progress: 0, 
            status: 'Not Started',
            dependencies: [203]
          },
          { 
            id: 205, 
            name: 'Development', 
            startDate: '2025-03-20', 
            endDate: '2025-04-20', 
            progress: 10, 
            status: 'In Progress',
            dependencies: [203]
          },
          { 
            id: 206, 
            name: 'Testing', 
            startDate: '2025-04-21', 
            endDate: '2025-05-01', 
            progress: 0, 
            status: 'Not Started',
            dependencies: [205]
          }
        ]
      },
      {
        id: 3,
        name: 'Database Migration',
        startDate: '2025-03-01',
        endDate: '2025-03-28',
        progress: 100,
        status: 'Completed',
        color: '#10b981', // green
        tasks: [
          { 
            id: 301, 
            name: 'Planning', 
            startDate: '2025-03-01', 
            endDate: '2025-03-05', 
            progress: 100, 
            status: 'Completed',
            dependencies: []
          },
          { 
            id: 302, 
            name: 'Data Backup', 
            startDate: '2025-03-06', 
            endDate: '2025-03-10', 
            progress: 100, 
            status: 'Completed',
            dependencies: [301]
          },
          { 
            id: 303, 
            name: 'Schema Migration', 
            startDate: '2025-03-11', 
            endDate: '2025-03-20', 
            progress: 100, 
            status: 'Completed',
            dependencies: [302]
          },
          { 
            id: 304, 
            name: 'Testing', 
            startDate: '2025-03-21', 
            endDate: '2025-03-25', 
            progress: 100, 
            status: 'Completed',
            dependencies: [303]
          },
          { 
            id: 305, 
            name: 'Deployment', 
            startDate: '2025-03-26', 
            endDate: '2025-03-28', 
            progress: 100, 
            status: 'Completed',
            dependencies: [304]
          }
        ]
      },
      {
        id: 4,
        name: 'Marketing Campaign',
        startDate: '2025-03-01',
        endDate: '2025-04-10',
        progress: 50,
        status: 'In Progress',
        color: '#f59e0b', // amber
        tasks: [
          { 
            id: 401, 
            name: 'Strategy Planning', 
            startDate: '2025-03-01', 
            endDate: '2025-03-10', 
            progress: 100, 
            status: 'Completed',
            dependencies: []
          },
          { 
            id: 402, 
            name: 'Content Creation', 
            startDate: '2025-03-11', 
            endDate: '2025-03-25', 
            progress: 80, 
            status: 'In Progress',
            dependencies: [401]
          },
          { 
            id: 403, 
            name: 'Social Media Launch', 
            startDate: '2025-03-20', 
            endDate: '2025-03-20', 
            progress: 0, 
            status: 'Not Started',
            dependencies: [402]
          },
          { 
            id: 404, 
            name: 'Campaign Execution', 
            startDate: '2025-03-21', 
            endDate: '2025-04-05', 
            progress: 30, 
            status: 'In Progress',
            dependencies: [403]
          },
          { 
            id: 405, 
            name: 'Analysis & Reporting', 
            startDate: '2025-04-06', 
            endDate: '2025-04-10', 
            progress: 0, 
            status: 'Not Started',
            dependencies: [404]
          }
        ]
      }
    ];
    
    setProjects(sampleProjects);
  }, []);

  // Helper functions for dates
  const parseDate = (dateString) => new Date(dateString);
  
  // Find earliest start date and latest end date across all projects
  const getDateRange = () => {
    if (projects.length === 0) return { startDate: new Date(), endDate: new Date() };
    
    let earliest = new Date();
    let latest = new Date();
    
    projects.forEach(project => {
      const projectStart = parseDate(project.startDate);
      const projectEnd = parseDate(project.endDate);
      
      if (projectStart < earliest) earliest = projectStart;
      if (projectEnd > latest) latest = projectEnd;
      
      project.tasks.forEach(task => {
        const taskStart = parseDate(task.startDate);
        const taskEnd = parseDate(task.endDate);
        
        if (taskStart < earliest) earliest = taskStart;
        if (taskEnd > latest) latest = taskEnd;
      });
    });
    
    return { startDate: earliest, endDate: latest };
  };

  // Calculate the number of days between two dates
  const daysBetween = (start, end) => {
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Get column headers (dates) for Gantt chart
  const getColumnHeaders = () => {
    const { startDate, endDate } = getDateRange();
    const days = daysBetween(startDate, endDate);
    const headers = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      headers.push(date);
    }
    
    return headers;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Get task position and width in the Gantt chart
  const getTaskBarStyles = (task, columnHeaders) => {
    const startDate = parseDate(task.startDate);
    const endDate = parseDate(task.endDate);
    
    // Find the index of the column that contains the start date
    const startIndex = columnHeaders.findIndex(date => 
      date.getDate() === startDate.getDate() && 
      date.getMonth() === startDate.getMonth() && 
      date.getFullYear() === startDate.getFullYear()
    );
    
    // Calculate width based on number of days
    const width = daysBetween(startDate, endDate);
    
    return {
      gridColumnStart: startIndex + 1, // +1 because CSS grid is 1-based
      gridColumnEnd: `span ${width}`,
    };
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'At Risk': return 'bg-red-500';
      case 'Not Started': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'At Risk': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Not Started': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Handle new event creation
  const handleNewEvent = () => {
    // In a real app, this would open a form to create a new event/task
    alert("New task creation would open here");
  };

  // Get project color with fallback
  const getProjectColor = (project) => {
    return project.color || '#3b82f6'; // Default to blue if no color specified
  };

  return (
    <div className="flex flex-col h-screen bg-amber-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm z-10 border-b-2 border-amber-100">
        <Header
          title={<span className="text-xl font-semibold text-amber-800">Project Timeline</span>}
          action={{
            onClick: handleNewEvent,
            icon: <Plus className="mr-2 h-4 w-4" />,
            label: "New Task"
          }}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white shadow-md z-5 border-r border-amber-100">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-amber-50 flex flex-col">
          <div className="p-6 space-y-6 flex-grow">
            {/* Control header - simplified without view toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-amber-200"
            >
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold text-amber-800">
                  Project Timeline
                </h2>
                <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  {projects.length} Projects
                </div>
              </div>
            </motion.div>
            
            {/* Project filter/selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-amber-200"
            >
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Filter by Project</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedProject === null 
                      ? 'bg-amber-100 text-amber-800 font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Projects
                </button>
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      project.id === selectedProject 
                        ? 'bg-amber-100 text-amber-800 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={project.id === selectedProject ? {
                      backgroundColor: `${getProjectColor(project)}25`, // 25% opacity
                      color: getProjectColor(project)
                    } : {}}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            </motion.div>
            
            {/* Gantt Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-amber-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Gantt header - dates */}
                  <div className="flex">
                    <div className="w-48 shrink-0 p-3 border-r border-gray-200 bg-gray-50 font-semibold text-gray-700">
                      Tasks
                    </div>
                    <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${getColumnHeaders().length}, minmax(40px, 1fr))` }}>
                      {getColumnHeaders().map((date, index) => (
                        <div 
                          key={index} 
                          className={`p-2 text-center text-xs font-medium border-r border-gray-100 ${
                            isToday(date) ? 'bg-amber-50 text-amber-700' : 
                            date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : ''
                          }`}
                        >
                          <div className={`${isToday(date) ? 'font-bold' : ''}`}>{formatDate(date)}</div>
                          <div className="text-[10px] text-gray-500">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Gantt body - projects and tasks */}
                  <div>
                    {projects
                      .filter(project => selectedProject === null || project.id === selectedProject)
                      .map(project => (
                        <div key={project.id}>
                          {/* Project row */}
                          <div className="flex border-t border-gray-200 bg-gray-50">
                            <div className="w-48 shrink-0 p-3 border-r border-gray-200">
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-sm mr-2"
                                  style={{ backgroundColor: getProjectColor(project) }}
                                ></div>
                                <h3 className="font-semibold text-gray-800 truncate">{project.name}</h3>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {parseDate(project.startDate).toLocaleDateString()} - {parseDate(project.endDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {/* Project timeline bar */}
                            <div className="flex-1 relative flex items-center h-16 grid" style={{ 
                              gridTemplateColumns: `repeat(${getColumnHeaders().length}, minmax(40px, 1fr))` 
                            }}>
                              <div
                                className="absolute h-6 rounded-md flex items-center px-2 text-white text-xs font-medium"
                                style={{
                                  ...getTaskBarStyles(
                                    { startDate: project.startDate, endDate: project.endDate }, 
                                    getColumnHeaders()
                                  ),
                                  backgroundColor: getProjectColor(project),
                                  opacity: 0.8
                                }}
                              >
                                {project.name} ({project.progress}%)
                              </div>
                            </div>
                          </div>
                          
                          {/* Task rows */}
                          {project.tasks.map(task => (
                            <div key={task.id} className="flex border-t border-gray-100 hover:bg-gray-50">
                              <div className="w-48 shrink-0 pl-6 pr-3 py-2 border-r border-gray-200 flex items-center">
                                <div 
                                  className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(task.status)}`}
                                ></div>
                                <div className="truncate">
                                  <div className="text-sm">{task.name}</div>
                                  <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                    {getStatusIcon(task.status)}
                                    <span className="ml-1">{task.status} • {task.progress}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Task timeline bar */}
                              <div className="flex-1 relative flex items-center h-12 grid" style={{ 
                                gridTemplateColumns: `repeat(${getColumnHeaders().length}, minmax(40px, 1fr))` 
                              }}>
                                {/* Full task bar background - with improved visibility for Not Started tasks */}
                                <div
                                  className={`absolute h-5 rounded flex items-center ${task.status === 'Not Started' ? 'border border-gray-400' : ''}`}
                                  style={{
                                    ...getTaskBarStyles(task, getColumnHeaders()),
                                    backgroundColor: task.status === 'Completed' ? '#10b981' : 
                                                   task.status === 'Not Started' ? '#d1d5db' :
                                                   '#3b82f6',
                                    opacity: task.status === 'Not Started' ? 0.9 : 0.4
                                  }}
                                >
                                </div>
                                
                                {/* Progress indicator (solid color) - only for tasks with progress > 0 */}
                                {task.progress > 0 && (
                                  <div
                                    className="absolute h-5 rounded-l"
                                    style={{
                                      ...getTaskBarStyles(task, getColumnHeaders()),
                                      width: `${task.progress}%`,
                                      backgroundColor: task.status === 'Completed' ? '#10b981' : 
                                                     task.status === 'Not Started' ? '#9ca3af' : 
                                                     '#3b82f6',
                                      zIndex: 5
                                    }}
                                  >
                                  </div>
                                )}
                                
                                {/* Task name overlay - positioned on top regardless of progress */}
                                <div
                                  className="absolute h-5 rounded flex items-center px-2 z-10"
                                  style={{
                                    ...getTaskBarStyles(task, getColumnHeaders()),
                                  }}
                                >
                                  <div className={`truncate text-xs font-medium ${task.status === 'Not Started' ? 'text-gray-700' : 'text-white'}`}>
                                    {task.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Legend */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-amber-200"
            >
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Legend</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">At Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Not Started</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Footer */}
          <div className="bg-white border-t border-amber-100 py-3 px-6">
            <div className="flex flex-row justify-between items-center text-xs text-amber-600">
              <div>
                <span>© 2025 PlanWise</span>
                <span className="hidden sm:inline"> • All rights reserved</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <GanttChartSquare className="h-3 w-3 mr-1" />
                  Project Timeline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCalendar;