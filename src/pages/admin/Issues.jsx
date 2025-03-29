import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
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

// Sample data as fallback
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
  const [activeTab, setActiveTab] = useState('admin');
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyModal, setReplyModal] = useState({ isOpen: false, issueId: null });
  const [replyText, setReplyText] = useState('');
  
  const { user } = useUser();
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (user && user.publicMetadata.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch bug reports from backend
  useEffect(() => {
    const fetchBugReports = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8080/api/bugreports');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend data to frontend format
        const transformedData = data.map(item => ({
          id: item.bugId,
          title: item.issueTitle,
          description: item.description,
          reportedBy: item.reportedBy?.username || 'Unknown User',
          email: item.reportedBy?.email || 'no-email@example.com',
          date: item.reportedAt,
          status: item.status.toLowerCase(),
          priority: item.priority.toLowerCase(),
          category: item.category.toLowerCase(),
          replies: item.commentCount || 0,
          comments: item.comments || []
        }));
        
        setIssues(transformedData);
        setFilteredIssues(transformedData);
      } catch (error) {
        console.error("Error fetching bug reports:", error);
        setError("Failed to load issue reports. Using sample data instead.");
        
        // Fall back to sample data
        setIssues(sampleIssues);
        setFilteredIssues(sampleIssues);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBugReports();
  }, [userId]);

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
      case 'in progress':
        return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-medium">In Progress</span>;
      case 'resolved':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">Resolved</span>;
      case 'closed':
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">Closed</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{status}</span>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return <span className="flex items-center text-red-600 text-xs"><span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>{priority === 'critical' ? 'Critical' : 'High'}</span>;
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
    switch (category.toLowerCase()) {
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
  const updateIssueStatus = async (id, newStatus) => {
    try {
      // Update status on the server
      const response = await fetch(`http://localhost:8080/api/bugreports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Update local state
      const updatedIssues = issues.map(issue => 
        issue.id === id ? { ...issue, status: newStatus } : issue
      );
      setIssues(updatedIssues);
    } catch (error) {
      console.error("Error updating issue status:", error);
      // Show an error toast or notification here
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    try {
      const commentDTO = {
        comment: replyText,
        bugId: replyModal.issueId
      };
      
      const response = await fetch(`http://localhost:8080/api/bugreports/${replyModal.issueId}/comments/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentDTO)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh the data
      const issueResponse = await fetch(`http://localhost:8080/api/bugreports/${replyModal.issueId}`);
      if (!issueResponse.ok) throw new Error('Failed to fetch updated issue');
      
      const updatedIssue = await issueResponse.json();
      
      // Update the issue in the issues array
      const updatedIssues = issues.map(issue => {
        if (issue.id === replyModal.issueId) {
          return {
            ...issue,
            replies: (issue.replies || 0) + 1,
            comments: [...(issue.comments || []), {
              id: Date.now(), // Will be replaced with actual data after refresh
              text: replyText,
              author: 'You (Admin)',
              date: new Date().toISOString()
            }]
          };
        }
        return issue;
      });
      
      setIssues(updatedIssues);
      setReplyText('');
      setReplyModal({ isOpen: false, issueId: null });
      
      // Get all issues again to refresh the data
      const allIssuesResponse = await fetch('http://localhost:8080/api/bugreports');
      if (allIssuesResponse.ok) {
        const data = await allIssuesResponse.json();
        
        const transformedData = data.map(item => ({
          id: item.bugId,
          title: item.issueTitle,
          description: item.description,
          reportedBy: item.reportedBy?.username || 'Unknown User',
          email: item.reportedBy?.email || 'no-email@example.com',
          date: item.reportedAt,
          status: item.status.toLowerCase(),
          priority: item.priority.toLowerCase(),
          category: item.category.toLowerCase(),
          replies: item.commentCount || 0,
          comments: item.comments || []
        }));
        
        setIssues(transformedData);
      }
      
    } catch (error) {
      console.error("Error submitting reply:", error);
      // Show error notification
    }
  };

  // Loading view
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-gray-100">
          <Header title={<span className="text-xl font-semibold text-[var(--features-icon-color)]">Admin - User Issues</span>} />
        </div>
        <div className="flex items-center justify-center flex-grow">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--features-icon-color)]"></div>
        </div>
      </div>
    );
  }

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
            {error && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-[var(--features-text-color)] text-sm font-medium">Total Issues</h3>
                <p className="text-2xl font-bold text-[var(--features-icon-color)]">{issues.length}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-gray-100"
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
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="text-[var(--features-text-color)] text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {issues.filter(issue => issue.status === 'in-progress' || issue.status === 'in progress').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-gray-100"
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
                  className="bg-[var(--bg-color)] border border-[var(--features-icon-color)] text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)] block w-full pl-10 p-2.5"
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
                    <option value="closed">Closed</option>
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
                    <option value="critical">Critical</option>
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
                              {(issue.status === 'in-progress' || issue.status === 'in progress') && (
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
                                onClick={() => setReplyModal({ isOpen: true, issueId: issue.id })}
                                title="Reply to User"
                              >
                                <MessageSquare className="h-4 w-4 text-[var(--features-icon-color)]" />
                              </button>
                              <div className="relative">
                                <button className="p-1 rounded-full hover:bg-[var(--hover-color)]/50">
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

      {/* Reply Modal */}
      {replyModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Reply to Issue</h3>
            </div>
            
            <form onSubmit={handleReplySubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  id="reply"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--features-icon-color)] focus:border-[var(--features-icon-color)]"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setReplyModal({ isOpen: false, issueId: null })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--features-icon-color)] hover:bg-[var(--hover-color)] focus:outline-none"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;