import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react'; // Add this import
import {
  AlertCircle,
  Clock,
  Filter,
  Search,
  Tag,
  Plus,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Menu
} from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

// Sample data for incidents and bugs
const sampleIncidents = [
  {
    id: 1,
    title: 'Dashboard loading issue',
    description: 'Dashboard widgets take too long to load, especially the project overview chart',
    reportedBy: 'You',
    date: '2025-03-01',
    status: 'open',
    priority: 'medium',
    category: 'bug',
    replies: 0
  },
  {
    id: 2,
    title: 'Unable to export reports as PDF',
    description: 'When clicking export as PDF, nothing happens and no error is shown',
    reportedBy: 'You',
    date: '2025-02-28',
    status: 'in-progress',
    priority: 'high',
    category: 'bug',
    replies: 1
  },
  {
    id: 3,
    title: 'Request for dark mode support',
    description: 'Working late at night - dark mode would help reduce eye strain',
    reportedBy: 'You',
    date: '2025-02-25',
    status: 'open',
    priority: 'low',
    category: 'enhancement',
    replies: 2
  }
];

const IncidentsBugs = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incidents, setIncidents] = useState(sampleIncidents);
  const [filteredIncidents, setFilteredIncidents] = useState(sampleIncidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    category: '',
    priority: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Add state for incident detail view
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const { userId } = useAuth(); // Get current user ID from Clerk
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

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

    // Fetch bug reports from backend
  useEffect(() => {
    const fetchBugReports = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setApiError(null);
      
      try {
        const response = await fetch(`http://localhost:8080/api/bugreports/user/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform backend data to frontend format
        const transformedData = data.map(item => ({
          id: item.bugId,
          title: item.issueTitle,
          description: item.description,
          reportedBy: item.reportedBy?.username || 'You',
          date: item.reportedAt,
          status: item.status.toLowerCase(),
          priority: item.priority.toLowerCase(),
          category: item.category.toLowerCase(),
          replies: item.commentCount || 0,
          comments: item.comments?.map(comment => ({
            id: comment.commentId,
            text: comment.comment,
            author: comment.author?.username || 'Unknown',
            date: comment.commentedAt
          })) || []
        }));
        
        setIncidents(transformedData);
        setFilteredIncidents(transformedData);
      } catch (error) {
        console.error("Error fetching bug reports:", error);
        setApiError("Failed to load your reports. Please try again later.");
        
        // If API fails, use sample data
        setIncidents(sampleIncidents);
        setFilteredIncidents(sampleIncidents);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchBugReports();
    }
  }, [userId]);

  // Add this function to handle viewing incident details
  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewIncident(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!newIncident.title.trim()) errors.title = 'Title is required';
    if (!newIncident.description.trim()) errors.description = 'Description is required';
    if (!newIncident.category) errors.category = 'Category is required';
    if (!newIncident.priority) errors.priority = 'Priority is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      const bugReportDTO = {
        issueTitle: newIncident.title,
        description: newIncident.description,
        category: newIncident.category.toUpperCase(),
        priority: newIncident.priority.toUpperCase()
      };
      
      const response = await fetch(`http://localhost:8080/api/bugreports/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bugReportDTO)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const createdReport = await response.json();
      
      // Transform to frontend format
      const newIncidentObject = {
        id: createdReport.bugId,
        title: createdReport.issueTitle,
        description: createdReport.description,
        reportedBy: 'You',
        date: createdReport.reportedAt,
        status: createdReport.status.toLowerCase(),
        priority: createdReport.priority.toLowerCase(),
        category: createdReport.category.toLowerCase(),
        replies: 0,
        comments: []
      };
      
      // Add to incidents array
      setIncidents(prev => [newIncidentObject, ...prev]);
      
      // Reset form and close modal
      setNewIncident({
        title: '',
        description: '',
        category: '',
        priority: ''
      });
      setShowReportModal(false);
      
    } catch (error) {
      console.error("Error creating bug report:", error);
      // Show error message to user
      setFormErrors({
        submit: "Failed to submit your report. Please try again later."
      });
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...incidents];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(incident => 
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(incident => incident.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(incident => incident.priority === priorityFilter);
    }
    
    setFilteredIncidents(result);
  }, [incidents, searchTerm, statusFilter, priorityFilter]);

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

  // Add this function to handle adding comments
  const handleAddComment = async () => {
    // Validate comment
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    try {
      const commentDTO = {
        comment: commentText,
        bugId: selectedIncident.id
      };
      
      const response = await fetch(`http://localhost:8080/api/bugreports/${selectedIncident.id}/comments/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentDTO)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const createdComment = await response.json();
      
      // Transform to frontend format
      const newComment = {
        id: createdComment.commentId,
        text: createdComment.comment,
        author: 'You',
        date: createdComment.commentedAt
      };
      
      // Update the incident with the new comment
      const updatedIncidents = incidents.map(inc => {
        if (inc.id === selectedIncident.id) {
          const comments = inc.comments ? [...inc.comments, newComment] : [newComment];
          return {
            ...inc,
            replies: inc.replies + 1,
            comments: comments
          };
        }
        return inc;
      });
      
      // Update selected incident for UI
      const updatedIncident = {
        ...selectedIncident,
        replies: selectedIncident.replies + 1,
        comments: selectedIncident.comments ? [...selectedIncident.comments, newComment] : [newComment]
      };
      
      // Update state
      setIncidents(updatedIncidents);
      setSelectedIncident(updatedIncident);
      setCommentText('');
      setShowCommentForm(false);
      setCommentError('');
      
    } catch (error) {
      console.error("Error posting comment:", error);
      setCommentError('Failed to post your comment. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-red-100">
      {/* Header */}
      <div className="w-full bg-[var(--bg-color)] shadow-sm z-10 border-b-2 border-[var(--bug-report)]/50">
        <Header
          title={<span className="text-xl font-semibold text-[var(--features-title-color)]">Bugs & Incidents</span>}
          action={{
            onClick: () => setShowReportModal(true),
            icon: <Plus className="mr-2 h-4 w-4" />,
            label: "Report Issue"
          }}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu toggle button */}
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--bug-report)] text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Report Issue button */}
        <button 
          onClick={() => setShowReportModal(true)}
          className="md:hidden fixed bottom-4 right-20 z-50 bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-colors"
          aria-label="Report issue"
        >
          <AlertTriangle size={24} />
        </button>

        {/* Sidebar - hidden on mobile, shown on md+ screens */}
        <div className="hidden md:block bg-white shadow-md z-5 border-r-2 border-[var(--bug-report)]/50">
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
        <div className="flex-1 overflow-auto bg-[var(--bug-report-bg)] flex flex-col">
          {/* Mobile card shortcut to report issue - visible at the top on mobile only */}
          <div className="md:hidden mx-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-xl shadow-lg border-2 border-[var(--bug-report)]/50 hover:shadow-xl transition-all duration-300"
              onClick={() => setShowReportModal(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-rose-100 p-2 rounded-lg mr-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Have an issue?</h3>
                    <p className="text-sm text-gray-500">Report it now</p>
                  </div>
                </div>
                <Plus className="h-5 w-5 text-rose-600" />
              </div>
            </motion.div>
          </div>

          <div className="p-6 space-y-6 flex-grow">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border-2 border-[var(--bug-report)]/50"
              >
                <h3 className="text-[var(--text-color3)] text-sm font-medium">Your Reports</h3>
                <p className="text-2xl font-bold text-gray-800">{incidents.length}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--bug-report)]/50"
              >
                <h3 className="text-[var(--text-color3)] text-sm font-medium">Open Issues</h3>
                <p className="text-2xl font-bold text-red-600">
                  {incidents.filter(incident => incident.status === 'open').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--bug-report)]/50"
              >
                <h3 className="text-[var(--text-color3)] text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {incidents.filter(incident => incident.status === 'in-progress').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[var(--bg-color)] p-4 rounded-xl shadow-sm border border-[var(--bug-report)]/50"
              >
                <h3 className="text-[var(--text-color3)] text-sm font-medium">Resolved</h3>
                <p className="text-2xl font-bold text-green-600">
                  {incidents.filter(incident => incident.status === 'resolved').length}
                </p>
              </motion.div>
            </div>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-[var(--text-color3)]" />
                </div>
                <input 
                  type="text" 
                  className="bg-[var(--bg-color)] border-2 border-[var(--bug-report)]/70 text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--bug-report)] focus:border-[var(--bug-report)]/50 block w-full pl-10 p-2.5"
                  placeholder="Search reports by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select 
                    className="bg-[var(--bg-color)] border-2 border-[var(--bug-report)]/50 text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--bug-report)] focus:border-[var(--bug-report)]/50 block w-full p-2.5 appearance-none pr-8"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--bug-report)] pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select 
                    className="bg-[var(--bg-color)] border-2 border-[var(--bug-report)]/50 text-[var(--text-color3)] text-sm rounded-lg focus:ring-[var(--bug-report)] focus:border-[var(--bug-report)]/50 block w-full p-2.5 appearance-none pr-8"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    value={priorityFilter}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--bug-report)] pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Issues list */}
            <div>
              <h2 className="text-lg font-semibold text-[var(--features-title-color)] mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "Filtered Reports" 
                  : "Your Reports"}
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--features-icon-color)]"></div>
                </div>
              ) : apiError ? (
                <div className="text-center py-10">
                  <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--features-title-color)]">Unable to load reports</h3>
                  <p className="text-[var(--features-text-color)] mb-4">{apiError}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[var(--features-icon-color)] text-white rounded-lg hover:bg-[var(--hover-color)] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredIncidents.map((incident, index) => (
                    <motion.div 
                      key={incident.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[var(--bg-color)] rounded-xl shadow-sm border border-[var(--bug-report)]/50 overflow-hidden hover:border-[var(--bug-report)]/30 transition-colors duration-300"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-[var(--features-title-color)] mb-1">{incident.title}</h3>
                          {getCategoryBadge(incident.category)}
                        </div>
                        
                        <p className="text-sm text-[var(--features-text-color)]/80 mb-4">{incident.description}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div>{getStatusBadge(incident.status)}</div>
                          <div>{getPriorityBadge(incident.priority)}</div>
                        </div>
                        
                        <div className="text-xs text-[var(--features-text-color)] mb-4">
                          Reported on {new Date(incident.date).toLocaleDateString()}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-[var(--text-color3)]">
                            <MessageSquare className="h-3.5 w-3.5 mr-1 text-[var(--features-icon-color)]" />
                            {incident.replies} {incident.replies === 1 ? 'reply' : 'replies'}
                          </div>
                          
                          <button 
                            className="text-xs text-[var(--features-icon-color)] hover:text-[var(--hover-color)] font-medium"
                            onClick={() => handleViewDetails(incident)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Footer - optional */}
          <div className="bg-[var(--bg-color)] border-t border-[var(--bug-report-bg)] py-3 px-6">
            <div className="flex flex-row justify-between items-center text-xs text-red-600">
              <div>
                <span>© 2025 PlanWise</span>
                <span className="hidden sm:inline"> • All rights reserved</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Issue Tracker
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-red-50/50 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--bg-color)] p-7 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-[var(--bug-report)] w-full max-w-md ring-2 ring-[var(--bug-report)]/5 ring-opacity-75"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block w-12 h-1.5 bg-[var(--bug-report)] rounded-full mb-2"></span>
                <h2 className="text-2xl font-bold text-[var(--features-title-color)]">Report an Issue</h2>
              </div>
              <button 
                onClick={() => {
                  setShowReportModal(false);
                  setFormErrors({});
                  setNewIncident({ title: '', description: '', category: '', priority: '' });
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">Issue Title</label>
                <input
                  type="text"
                  id="title"
                  value={newIncident.title}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[var(--gray-card3)]/20 border ${formErrors.title ? 'border-[var(--bug-report)]/90' : 'border-[var(--gray-card3)]/20'} text-[var(--text-color3)] rounded-lg focus:ring-2 focus:ring-[var(--bug-report)] focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="Brief summary of the issue"
                />
                {formErrors.title && <p className="mt-1 text-xs text-[var(--bug-report)]">{formErrors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={newIncident.description}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[var(--gray-card3)]/20 border ${formErrors.title ? 'border-[var(--bug-report)]/90' : 'border-[var(--gray-card3)]/20'} text-[var(--text-color3)] rounded-lg focus:ring-2 focus:ring-[var(--bug-report)] focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="Please provide details about what happened and how to reproduce the issue"
                ></textarea>
                {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">Category</label>
                <select
                  id="category"
                  value={newIncident.category}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[var(--gray-card3)]/20 border ${formErrors.title ? 'border-[var(--bug-report)]/90' : 'border-[var(--gray-card3)]/20'} text-[var(--text-color3)] rounded-lg focus:ring-2 focus:ring-[var(--bug-report)] focus:border-transparent transition-all duration-200`}
                  required
                >
                  <option value="">Select category</option>
                  <option value="bug">Bug</option>
                  <option value="feature">Feature Request</option>
                  <option value="enhancement">Enhancement</option>
                </select>
                {formErrors.category && <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-[var(--features-title-color)] mb-1">Priority</label>
                <select
                  id="priority"
                  value={newIncident.priority}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-[var(--gray-card3)]/20 border ${formErrors.title ? 'border-[var(--bug-report)]/90' : 'border-[var(--gray-card3)]/20'} text-[var(--text-color3)] rounded-lg focus:ring-2 focus:ring-[var(--bug-report)] focus:border-transparent transition-all duration-200`}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {formErrors.priority && <p className="mt-1 text-xs text-red-600">{formErrors.priority}</p>}
              </div>

              {formErrors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {formErrors.submit}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setFormErrors({});
                    setNewIncident({ title: '', description: '', category: '', priority: '' });
                  }}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-lg bg-rose-600 !text-white hover:bg-rose-700 transition-colors flex items-center shadow-sm hover:shadow-md font-medium"
                >
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Submit Report
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Incident Details Modal */}
      {showDetailModal && selectedIncident && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--bg-color)] p-7 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-[var(--gray-card3)] w-full max-w-md ring-2 ring-[var(--gray-card3)]/50 ring-opacity-75"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block w-12 h-1.5 bg-[var(--features-icon-color)] rounded-full mb-2"></span>
                <h2 className="text-2xl font-bold text-[var(--features-title-color)] truncate pr-4">{selectedIncident.title}</h2>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-full hover:bg-[var(--gray-card3)]/50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--gray-card3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Badge row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {getCategoryBadge(selectedIncident.category)}
              {getStatusBadge(selectedIncident.status)}
              {getPriorityBadge(selectedIncident.priority)}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[var(--features-text-color)] mb-2">Description</h3>
              <div className="bg-[var(--gray-card3)]/50 p-4 rounded-lg text-[var(--text-color3)]/70">
                {selectedIncident.description}
              </div>
            </div>

            {/* Meta information */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--features-text-color)]">Reported by:</span>
                <span className="font-medium text-[var(--features-title-color)]/70">{selectedIncident.reportedBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--features-text-color)]">Date reported:</span>
                <span className="font-medium text-[var(--features-title-color)]/70">{new Date(selectedIncident.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--features-text-color)]">Incident ID:</span>
                <span className="font-medium text-[var(--features-title-color)]/70">#{selectedIncident.id}</span>
              </div>
            </div>

            {/* Comments section */}
            <div className="border-t border-[var(--gray-card3)] pt-5 mb-5">
              <h3 className="text-sm font-medium text-[var(--features-title-color)] mb-3">Comments ({selectedIncident.replies})</h3>
              
              {selectedIncident.replies === 0 && !showCommentForm ? (
                <div className="text-center py-4 bg-[var(--gray-card2)]/70 rounded-lg">
                  <p className="text-[var(--features-text-color)] text-sm">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {selectedIncident.comments && selectedIncident.comments.map(comment => (
                    <div key={comment.id} className="bg-[var(--gray-card3)]/60 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-[var(--text-color3)]">{comment.author}</span>
                        <span className="text-xs text-[var(--text-color3)]">{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-[var(--features-text-color)]/70">{comment.text}</p>
                    </div>
                  ))}
                  
                  {showCommentForm && (
                    <div className="bg-[var(--gray-card3)]/50 p-4 rounded-lg">
                      <textarea
                        value={commentText}
                        onChange={(e) => {
                          setCommentText(e.target.value);
                          if (commentError) setCommentError('');
                        }}
                        placeholder="Write your comment here..."
                        rows="3"
                        className={`w-full p-3 bg-[var(--bg-color)] border ${commentError ? 'border-red-500' : 'border-gray-200'} text-[var(--text-color3)]/70 rounded-lg focus:ring-2 focus:ring-[var(--features-icon-color)]/20 focus:border-transparent transition-all duration-200 mb-2`}
                      ></textarea>
                      {commentError && <p className="text-xs text-red-600 mb-2">{commentError}</p>}
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCommentForm(false);
                            setCommentText('');
                            setCommentError('');
                          }}
                          className="px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddComment}
                          className="px-3 py-1.5 text-sm rounded-lg bg-[var(--features-icon-color)]/40 text-white hover:bg-[var(--features-icon-color)]/80 transition-colors shadow-sm"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowCommentForm(true)}
                className={`px-5 py-2.5 rounded-lg ${showCommentForm ? 'bg-[var(--gray-card3)] text-gray-600' : 'bg-[var(--features-icon-color)]/20 text-white hover:bg-[var(--hover-color)]/20'} transition-colors flex items-center shadow-sm hover:shadow-md font-medium ${showCommentForm ? 'cursor-not-allowed' : ''}`}
                disabled={showCommentForm}
              >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Add Comment
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Success notification - optional */}
      
    </div>
  );
};

export default IncidentsBugs;