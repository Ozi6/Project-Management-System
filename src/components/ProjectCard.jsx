import { useNavigate } from "react-router-dom";
import { Calendar, Users, Clock, Trash2, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProjectCard = ({ id, name, owner, progress, status, isOwner, onDelete }) => {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // Sample data that would come from props in a real implementation
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 14 days from now
    const teamMembers = 4;
    const lastUpdated = "2 days ago";
    const description = "This project aims to improve our customer experience by streamlining the checkout process.";
    
    // Handle delete button click
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };
    
    // Handle confirming deletion
    const confirmDelete = (e) => {
        e.stopPropagation();
        onDelete && onDelete(id);
        setShowDeleteConfirm(false);
    };
    
    // Handle canceling deletion
    const cancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div
                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg hover:scale-102 transition-all duration-200 relative overflow-hidden"
                onClick={() => navigate(`/project/${id}`)}
            >
                <div className="bg-blue-500 rounded-lg p-3 mb-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                            <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
                            {isOwner && (
                                <span className="text-yellow-300 text-lg">👑</span>
                            )}
                        </div>
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${
                                status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-200 text-red-900"
                            }`}
                        >
                            {status === "Completed" ? "Completed" : "In Progress"}
                        </span>
                    </div>
                </div>
                
                {/* Project description */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
                </div>
                
                {/* Project metadata */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Team: {teamMembers}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Due: {dueDate}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Updated: {lastUpdated}</span>
                    </div>
                </div>
                
                <div className="mb-4">
                    <p className="text-sm text-gray-600 font-medium mb-1">
                        Project Owner: {owner}
                    </p>
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`rounded-full h-2 ${
                                status === "Completed" ? "bg-green-500" : 
                                progress > 75 ? "bg-blue-600" :
                                progress > 30 ? "bg-yellow-500" : "bg-orange-500"
                            }`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                
                {/* Delete button */}
                <div className="mt-5 flex justify-end">
                    <button 
                        onClick={handleDeleteClick}
                        className="px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors flex items-center"
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete Project
                    </button>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cancelDelete}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold ml-3 text-gray-800">Delete Project</h3>
                                <button 
                                    onClick={cancelDelete}
                                    className="ml-auto p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Are you sure you want to delete <span className="font-semibold">{name}</span>? This action cannot be undone.
                                </p>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
                                >
                                    <Trash2 className="h-4 w-4 mr-1.5" />
                                    Delete Project
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectCard;