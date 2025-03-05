import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Clock,
  Filter,
  Search,
  Tag,
  Plus,
  AlertTriangle,
  CheckCircle,
  MessageSquare
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
  // Add state for the new incident form
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    category: '',
    priority: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Add a new state variable for the detail view
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Add these new state variables
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

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

  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Create new incident object with current date and default values
    const newIncidentObject = {
      id: Date.now(), // Use timestamp as unique ID
      title: newIncident.title,
      description: newIncident.description,
      reportedBy: 'You',
      date: new Date().toISOString().split('T')[0],
      status: 'open',
      priority: newIncident.priority,
      category: newIncident.category,
      replies: 0
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
    
    // Show success notification (can be implemented later)
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
  const handleAddComment = () => {
    // Validate comment
    if (!commentText.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    // Create a new comment
    const newComment = {
      id: Date.now(),
      text: commentText,
      author: 'You',
      date: new Date().toISOString().split('T')[0]
    };
    
    // Update the incident with the new comment
    const updatedIncidents = incidents.map(inc => {
      if (inc.id === selectedIncident.id) {
        // Initialize comments array if it doesn't exist
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
  };

  return (
    <div className="flex flex-col h-screen bg-red-100">
      {/* Header */}
      <div className="w-full bg-white shadow-sm z-10 border-b-2 border-red-200">
        <Header
          title={<span className="text-xl font-semibold text-gray-800">Bugs & Incidents</span>}
          action={{
            onClick: () => setShowReportModal(true),
            icon: <Plus className="mr-2 h-4 w-4" />,
            label: "Report Issue"
          }}
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white shadow-md z-5 border-r-2 border-red-200">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto bg-red-100 flex flex-col">
          <div className="p-6 space-y-6 flex-grow">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm border-2 border-red-300"
              >
                <h3 className="text-gray-500 text-sm font-medium">Your Reports</h3>
                <p className="text-2xl font-bold text-gray-800">{incidents.length}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-red-200"
              >
                <h3 className="text-gray-500 text-sm font-medium">Open Issues</h3>
                <p className="text-2xl font-bold text-red-600">
                  {incidents.filter(incident => incident.status === 'open').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-red-200"
              >
                <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {incidents.filter(incident => incident.status === 'in-progress').length}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-red-200"
              >
                <h3 className="text-gray-500 text-sm font-medium">Resolved</h3>
                <p className="text-2xl font-bold text-green-600">
                  {incidents.filter(incident => incident.status === 'resolved').length}
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
                  className="bg-white border-2 border-red-300 text-gray-700 text-sm rounded-lg focus:ring-red-600 focus:border-red-500 block w-full pl-10 p-2.5"
                  placeholder="Search reports by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select 
                    className="bg-white border-2 border-red-300 text-gray-700 text-sm rounded-lg focus:ring-red-600 focus:border-red-500 block w-full p-2.5 appearance-none pr-8"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
                
                <div className="relative">
                  <select 
                    className="bg-white border-2 border-red-300 text-gray-700 text-sm rounded-lg focus:ring-red-600 focus:border-red-500 block w-full p-2.5 appearance-none pr-8"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    value={priorityFilter}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Issues list */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                  ? "Filtered Reports" 
                  : "Your Reports"}
              </h2>
              
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">No reports found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter settings</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredIncidents.map((incident, index) => (
                    <motion.div 
                      key={incident.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden hover:border-red-300 transition-colors duration-300"
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-800 mb-1">{incident.title}</h3>
                          {getCategoryBadge(incident.category)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{incident.description}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div>{getStatusBadge(incident.status)}</div>
                          <div>{getPriorityBadge(incident.priority)}</div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-4">
                          Reported on {new Date(incident.date).toLocaleDateString()}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <MessageSquare className="h-3.5 w-3.5 mr-1 text-gray-400" />
                            {incident.replies} {incident.replies === 1 ? 'reply' : 'replies'}
                          </div>
                          
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
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
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-red-50/50 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-7 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-gray-800/10 w-full max-w-md ring-2 ring-gray-900/5 ring-opacity-75"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block w-12 h-1.5 bg-rose-500 rounded-full mb-2"></span>
                <h2 className="text-2xl font-bold text-gray-800">Report an Issue</h2>
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  id="title"
                  value={newIncident.title}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-50 border ${formErrors.title ? 'border-red-500' : 'border-gray-200'} text-gray-900 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="Brief summary of the issue"
                />
                {formErrors.title && <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={newIncident.description}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-50 border ${formErrors.description ? 'border-red-500' : 'border-gray-200'} text-gray-900 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200`}
                  required
                  placeholder="Please provide details about what happened and how to reproduce the issue"
                ></textarea>
                {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  id="category"
                  value={newIncident.category}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-50 border ${formErrors.category ? 'border-red-500' : 'border-gray-200'} text-gray-900 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200`}
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
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  id="priority"
                  value={newIncident.priority}
                  onChange={handleInputChange}
                  className={`w-full p-3 bg-gray-50 border ${formErrors.priority ? 'border-red-500' : 'border-gray-200'} text-gray-900 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-200`}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {formErrors.priority && <p className="mt-1 text-xs text-red-600">{formErrors.priority}</p>}
              </div>

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
                  className="px-7 py-2.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center shadow-sm hover:shadow-md font-medium"
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
            className="bg-white p-7 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-gray-800/10 w-full max-w-md ring-2 ring-gray-900/5 ring-opacity-75"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block w-12 h-1.5 bg-blue-500 rounded-full mb-2"></span>
                <h2 className="text-2xl font-bold text-gray-800 truncate pr-4">{selectedIncident.title}</h2>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-800">
                {selectedIncident.description}
              </div>
            </div>

            {/* Meta information */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reported by:</span>
                <span className="font-medium">{selectedIncident.reportedBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date reported:</span>
                <span className="font-medium">{new Date(selectedIncident.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Incident ID:</span>
                <span className="font-medium text-gray-800">#{selectedIncident.id}</span>
              </div>
            </div>

            {/* Comments section */}
            <div className="border-t border-gray-100 pt-5 mb-5">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Comments ({selectedIncident.replies})</h3>
              
              {selectedIncident.replies === 0 && !showCommentForm ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {selectedIncident.comments && selectedIncident.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-800">{comment.author}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                  
                  {showCommentForm && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <textarea
                        value={commentText}
                        onChange={(e) => {
                          setCommentText(e.target.value);
                          if (commentError) setCommentError('');
                        }}
                        placeholder="Write your comment here..."
                        rows="3"
                        className={`w-full p-3 bg-white border ${commentError ? 'border-red-500' : 'border-gray-200'} text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 mb-2`}
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
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddComment}
                          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
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
                className={`px-5 py-2.5 rounded-lg ${showCommentForm ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors flex items-center shadow-sm hover:shadow-md font-medium ${showCommentForm ? 'cursor-not-allowed' : ''}`}
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