import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Search,
  Tag,
  User,
  Menu
} from 'lucide-react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

// Sample data for issues/tickets
const sampleIssues = [
  {
    id: 1,
    title: 'Dashboard not loading properly',
    description: 'My dashboard keeps showing a blank screen after login',
    reportedBy: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    date: '2025-02-27',
    status: 'open',
    priority: 'high',
    category: 'bug'
  },
  {
    id: 2,
    title: 'Can\'t assign team members to projects',
    description: 'When I try to add team members to my project, the dropdown menu is empty',
    reportedBy: 'Michael Lee',
    email: 'michael.l@example.com',
    date: '2025-02-26',
    status: 'in-progress',
    priority: 'medium',
    category: 'feature'
  },
  {
    id: 3,
    title: 'Feature request: Dark mode',
    description: 'It would be nice to have a dark mode option for the interface',
    reportedBy: 'Alex Chen',
    email: 'alex.c@example.com',
    date: '2025-02-25',
    status: 'resolved',
    priority: 'low',
    category: 'enhancement'
  },
  {
    id: 4,
    title: 'Calendar sync with Google Calendar',
    description: 'I want to sync my project deadlines with my Google Calendar',
    reportedBy: 'Jessica Wong',
    email: 'jessica.w@example.com',
    date: '2025-02-24',
    status: 'open',
    priority: 'medium',
    category: 'feature'
  },
  {
    id: 5,
    title: 'Error when generating reports',
    description: 'I get a 500 error when trying to generate project reports',
    reportedBy: 'David Smith',
    email: 'david.s@example.com',
    date: '2025-02-23',
    status: 'in-progress',
    priority: 'high',
    category: 'bug'
  }
];

const Issues = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [issues, setIssues] = useState(sampleIssues);
  const [filteredIssues, setFilteredIssues] = useState(sampleIssues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (user && user.publicMetadata.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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

  // Apply filters
  useEffect(() => {
    let result = [...issues];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(issue => issue.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(issue => issue.priority === priorityFilter);
    }
    
    setFilteredIssues(result);
  }, [issues, searchTerm, statusFilter, priorityFilter]);

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">Open</span>;
      case 'in-progress':
        return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-medium">In Progress</span>;
      case 'resolved':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">Resolved</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{status}</span>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="flex items-center text-red-600 text-xs"><span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>High</span>;
      case 'medium':
        return <span className="flex items-center text-amber-600 text-xs"><span className="w-2 h-2 bg-amber-600 rounded-full mr-1"></span>Medium</span>;
      case 'low':
        return <span className="flex items-center text-green-600 text-xs"><span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>Low</span>;
      default:
        return <span className="flex items-center text-gray-600 text-xs"><span className="w-2 h-2 bg-gray-600 rounded-full mr-1"></span>{priority}</span>;
    }
  };
  
  // Get category badge
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'bug':
        return <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs rounded-full">Bug</span>;
      case 'feature':
        return <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">Feature</span>;
      case 'enhancement':
        return <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">Enhancement</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-50 text-gray-700 text-xs rounded-full">{category}</span>;
    }
  };
  
  // Update issue status
  const updateIssueStatus = (id, newStatus) => {
    const updatedIssues = issues.map(issue => 
      issue.id === id ? { ...issue, status: newStatus } : issue
    );
    setIssues(updatedIssues);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-gray-100">
        <Header
          title={<span className="text-xl font-semibold text-[var(--features-icon-color)]">Admin - User Issues</span>}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu toggle button */}
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar - hidden on mobile, shown on md+ screens */}
        <div className="hidden md:block bg-white shadow-md z-5 border-r border-gray-100">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Mobile sidebar - full screen overlay when open */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white">
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isMobile={true}
              closeMobileMenu={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-[var(--sidebar-dashboard-bg-color)] flex flex-col">
          <div className="p-6 space-y-6 flex-grow">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-[var(--features-text-color)] text-sm font-medium">Total Issues</h3>
                <p className="text-2xl font-bold text-[var(--features-icon-color)]">{issues.length}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-[var(--features-text-color)] text-sm font-medium">Open Issues</h3>
                <p className="text-2xl font-bold text-red-600">
                  {issues.filter(issue => issue.status === 'open').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-[var(--features-text-color)] text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {issues.filter(issue => issue.status === 'in-progress').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-[var(--features-text-color)] text-sm font-medium">Resolved</h3>
                <p className="text-2xl font-bold text-green-600">
                  {issues.filter(issue => issue.status === 'resolved').length}
                </p>
              </motion.div>
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="bg-white border border-[var(--features-icon-color)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)] block w-full pl-10 p-2.5"
                  placeholder="Search issues by title, description, or reporter"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select 
                    className="bg-[var(--bg-color)] border border-[var(--sidebar-projects-bg-color)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none pr-8"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--features-icon-color)] pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select 
                    className="bg-[var(--bg-color)] border border-[var(--sidebar-projects-bg-color)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none pr-8"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    value={priorityFilter}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--features-icon-color)] pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Issues list */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--features-icon-color)] mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "Filtered Issues" 
                  : "All Issues"}
              </h2>
              
              {filteredIssues.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--features-icon-color)]">No issues found</h3>
                  <p className="text-[var(--features-text-color)]">Try adjusting your search or filter settings</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-[var(--gray-card1)] shadow-sm rounded-lg overflow-hidden">
                    <thead className="bg-[var(--loginpage-bg)] text-[var(--features-text-color)] uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 text-left">Issue</th>
                        <th className="py-3 px-4 text-left">Reported By</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Priority</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredIssues.map((issue, index) => (
                        <motion.tr 
                          key={issue.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-[var(--gray-card2)]"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-[var(--features-title-color)]">{issue.title}</p>
                              <p className="text-sm text-[var(--text-color3)] truncate max-w-[250px]">{issue.description}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-[var(--loginpage-bg)] flex items-center justify-center text-[var(--features-icon-color)] mr-2">
                                {issue.reportedBy.split(' ').map(name => name[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[var(--features-title-color)]">{issue.reportedBy}</p>
                                <p className="text-xs text-[var(--text-color3)]">{issue.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[var(--features-text-color)] text-sm">
                            {new Date(issue.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(issue.status)}
                          </td>
                          <td className="py-3 px-4">
                            {getPriorityBadge(issue.priority)}
                          </td>
                          <td className="py-3 px-4">
                            {getCategoryBadge(issue.category)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              {issue.status === 'open' && (
                                <button 
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  onClick={() => updateIssueStatus(issue.id, 'in-progress')}
                                  title="Mark as In Progress"
                                >
                                  <Clock className="h-4 w-4 text-amber-600" />
                                </button>
                              )}
                              {issue.status === 'in-progress' && (
                                <button 
                                  className="p-1 rounded-full hover:bg-gray-100"
                                  onClick={() => updateIssueStatus(issue.id, 'resolved')}
                                  title="Mark as Resolved"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </button>
                              )}
                              <button 
                                className="p-1 rounded-full hover:bg-gray-100"
                                title="Reply to User"
                              >
                                <MessageSquare className="h-4 w-4 text-[var(--features-icon-color)]" />
                              </button>
                              <div className="relative">
                                <button className="p-1 rounded-full hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4 text-[var(--features-title-color)]" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-[var(--bg-color)] border-t border-gray-100 py-3 px-6">
            <div className="flex flex-row justify-between items-center text-xs text-gray-600">
              <div>
                <span className="text-[var(--features-icon-color)] sm:inline">© 2025 PlanWise</span>
                <span className="hidden sm:inline text-[var(--features-icon-color)]"> • All rights reserved</span>
              </div>
              <div className="flex items-center space-x-4 text-[var(--features-icon-color)]">
                <span className="flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1 text-[var(--features-icon-color)]" />
                  Admin Panel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issues;