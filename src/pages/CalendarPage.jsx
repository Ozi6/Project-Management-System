import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Filter, SortAsc, User, Heart, Menu } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { KanbanSquare, Layout, Settings, Users as UsersIcon, Activity } from "lucide-react";
import ThemeSwitcher from '../ThemeSwitcher';

const CalendarPage = ({ projectData }) => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [tasksByDate, setTasksByDate] = useState({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Custom navigation items for the sidebar (similar to ProjectDetails.jsx)
  const customNavItems = [
    { 
      id: 'dashboard', 
      icon: Layout, 
      label: 'Dashboard', 
      path: '/dashboard',
      color: 'bg-[var(--sidebar-dashboard-bg-color)] text-[var(--sidebar-dashboard-color)]',  
      iconColor: 'text-[var(--sidebar-dashboard-color)]',     
      defaultColor: true
    },
    { 
      id: 'projects', 
      icon: KanbanSquare, 
      label: 'This Project', 
      path: '/project/1',
      color: 'bg-purple-100 text-purple-600',
      iconColor: 'text-purple-600'
    },
    { 
      id: 'activity', 
      icon: Activity, 
      label: 'Activity', 
      path: '/activity',
      color: 'bg-[var(--sidebar-gantt-bg-color)] text-[var(--sidebar-gantt-color)]',
      iconColor: 'text-[var(--sidebar-gantt-color)]'
    },
    { 
      id: 'teams', 
      icon: UsersIcon, 
      label: 'Teams',
      path: '/teams',
      color: 'bg-green-100 text-green-600',
      iconColor: 'text-green-600'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings',
      path: '/project/settings',
      color: 'bg-gray-100 text-gray-600',
      iconColor: 'text-gray-600'
    }
  ];

  // Handle mobile sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when changing routes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Sample project data with tasks
  const sampleProjectData = [
    [
      {
        id: "category-a",
        title: "Category A",
        tagColor: "#8b5cf6", // Purple
        taskLists: [
          {
            id: "task-list-1",
            title: "Task List 1",
            tagColor: "#8b5cf6",
            entries: [
              {
                text: "Complete project proposal",
                entryId: "task-1",
                dueDate: new Date("2025-03-15"),
              },
              {
                text: "Review design mockups",
                entryId: "task-2",
                dueDate: new Date("2025-03-02"),
              },
            ],
          },
          {
            id: "task-list-2",
            title: "Task List 2",
            tagColor: "#8b5cf6",
            entries: [
              {
                text: "Prepare presentation slides",
                entryId: "task-3",
                dueDate: new Date("2025-03-10"),
              },
              {
                text: "Send meeting invites",
                entryId: "task-4",
                dueDate: new Date("2025-03-12"),
              },
            ],
          },
        ],
      },
      {
        id: "category-b",
        title: "Category B",
        tagColor: "#f43f5e", // Red
        taskLists: [
          {
            id: "task-list-3",
            title: "Task List 3",
            tagColor: "#f43f5e",
            entries: [
              {
                text: "Update website content",
                entryId: "task-5",
                dueDate: new Date("2025-03-25"),
              },
              {
                text: "Test new features",
                entryId: "task-6",
                dueDate: new Date("2025-03-18"),
              },
            ],
          },
          {
            id: "task-list-4",
            title: "Task List 4",
            tagColor: "#f43f5e",
            entries: [
              {
                text: "Fix bugs in production",
                entryId: "task-7",
                dueDate: new Date("2025-03-20"),
              },
              {
                text: "Write documentation",
                entryId: "task-8",
                dueDate: new Date("2025-03-30"),
              },
            ],
          },
        ],
      },
    ],
  ];

  // Extract all tasks with due dates from the project data
  useEffect(() => {
    if (!sampleProjectData || !sampleProjectData.length) return;
    
    const taskMap = {};
    
    sampleProjectData.forEach(column => {
      column.forEach(category => {
        category.taskLists.forEach(taskList => {
          taskList.entries.forEach(entry => {
            if (entry.dueDate) {
              const dateKey = new Date(entry.dueDate).toDateString();
              if (!taskMap[dateKey]) {
                taskMap[dateKey] = [];
              }
              taskMap[dateKey].push({
                id: entry.entryId,
                text: entry.text,
                date: new Date(entry.dueDate),
                category: category.title,
                taskList: taskList.title,
                color: category.tagColor
              });
            }
          });
        });
      });
    });
    
    setTasksByDate(taskMap);
  }, []);

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Create array for calendar grid (including padding days)
    const days = [];
    
    // Add previous month's days for padding
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        currentMonth: false
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true
      });
    }
    
    // Add next month's days to complete grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        currentMonth: false
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth]);

  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    const dateKey = day.toDateString();
    return tasksByDate[dateKey] || [];
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Format date as Month Year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if a date is selected
  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-white shadow-sm z-10 border-b border-[var(--sidebar-gantt-color2)]">
        <Header
          title={<span className="text-xl font-semibold text-[var(--sidebar-gantt-color)]">Calendar</span>}
        />
        
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu toggle button */}
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--features-icon-color)] text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar - hidden on mobile, shown on md+ screens */}
        <div className="hidden md:block bg-[var(--bg-color)] shadow-md z-5 border-r border-gray-100">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            customNavItems={customNavItems}
          />
        </div>
        
        {/* Mobile sidebar - full screen overlay when open */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              customNavItems={customNavItems}
              isMobile={true}
              closeMobileMenu={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main content - remains the same */}
        <div className="flex-1 overflow-y-auto bg-[var(--sidebar-gantt-bg-color)] flex flex-col items-center h-full mt-0">

          <div className="p-6 w-full max-w-4xl">
            <div className="bg-[var(--bg-color)] rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[var(--features-text-color)]" />
                  <h2 className="text-xl font-semibold text-[var(--features-icon-color)]">Project Calendar</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={goToToday}
                    className="px-3 py-1 text-sm bg-[var(--loginpage-bg)] text-[var(--features-icon-color)] rounded hover:bg-[var(--loginpage-bg2)] transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={prevMonth}
                    className="p-1 rounded-full hover:bg-[var(--gray-card3)]"
                    
                  >
                    <ChevronLeft className="h-5 w-5 text-[var(--features-title-color)]" />
                  </button>
                  <span className="text-lg text-[var(--features-title-color)] font-medium w-40 text-center">
                    {formatMonthYear(currentMonth)}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-full hover:bg-[var(--gray-card3)]"
                  >
                    <ChevronRight className="h-5 w-5 text-[var(--features-title-color)]" />
                  </button>
                </div>
              </div>

              {/* Calendar grid - made more responsive */}
              <div className="grid grid-cols-7 border-1 border-[var(--sidebar-gantt-color2)] gap-px bg-[var(--sidebar-gantt-color2)]">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-[var(--gray-card3)] text-center py-2 font-medium text-[var(--features-title-color)] text-xs sm:text-sm">
                    {window.innerWidth < 640 ? day.charAt(0) : day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const tasks = getTasksForDay(day.date);
                  const hasTask = tasks.length > 0;
                  
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(day.date)}
                      className={`min-h-16 sm:min-h-24 p-1 ${
                        !day.currentMonth ? 'bg-[var(--gray-card2)] text-[var(--text-color3)]' : 'bg-[var(--gray-card1)] text-[var(--text-color3)]'
                      } ${
                        isToday(day.date) ? 'bg-[var(--bg-color)]' : 'bg-[var(--bg-color)]'
                      } ${
                        isSelected(day.date) ? 'ring-2 ring-[var(--features-icon-color)]' : ''
                      } hover:bg-[var(--gray-card3)] cursor-pointer`}
                    >
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${isToday(day.date) ? 'font-bold text-[var(--features-icon-color)]' : ''}`}>
                          {day.date.getDate()}
                        </span>
                        {hasTask && (
                          <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      
                      <div className="mt-1 max-h-10 sm:max-h-20 overflow-y-auto">
                        {tasks.slice(0, window.innerWidth < 640 ? 1 : 3).map((task, i) => (
                          <div
                            key={i}
                            className="text-xs mb-1 p-1 rounded truncate"
                            style={{ backgroundColor: `${task.color}20`, borderLeft: `3px solid ${task.color}` }}
                          >
                            {task.text}
                          </div>
                        ))}
                        {tasks.length > (window.innerWidth < 640 ? 1 : 3) && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{tasks.length - (window.innerWidth < 640 ? 1 : 3)} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Task details for selected date */}
              <div className="mt-4">
                <h3 className="font-medium text-[var(--features-text-color)]">
                  Tasks for {selectedDate.toLocaleDateString()}
                </h3>
                <div className="mt-2 space-y-2 max-h-64 text-[var(--features-title-color)] overflow-y-auto">
                  {getTasksForDay(selectedDate).length > 0 ? (
                    getTasksForDay(selectedDate).map((task, index) => (
                      <div 
                        key={index}
                        className="p-2 rounded-md shadow-sm border-l-4 flex justify-between items-center"
                        style={{ borderLeftColor: task.color }}
                      >
                        <div>
                          <div className="font-medium">{task.text}</div>
                          <div className="text-xs text-[var(--features-text-color)]">
                            {task.category} • {task.taskList}
                          </div>
                        </div>
                        <div className="text-sm text-[var(--features-icon-color)]">
                          {/*task.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })*/}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[var(--text-color3)] text-center py-4">
                      No tasks scheduled for this date
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="w-full bg-[var(--bg-color)] border-t border-gray-100 py-3 px-6 mt-auto">
            <div className="flex flex-row justify-between items-center text-xs text-[var(--featureas-icon-color)]">
              <div>
                <span className="text-[var(--features-title-color)]">© 2025 PlanWise</span>
                <span className="hidden sm:inline text-[var(--features-title-color)]"> • All rights reserved</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/terms" className="text-[var(--features-title-color)] hover:text-[var(--hover-color)] transition-colors">Terms</Link>
                <Link to="/privacy" className="text-[var(--features-title-color)] hover:text-[var(--hover-color)] transition-colors">Privacy</Link>
                <span className="flex items-center text-[var(--features-title-color)]">
                  Made with <Heart className="h-3 w-3 text-red-500 mx-1 " /> by PlanWise
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;