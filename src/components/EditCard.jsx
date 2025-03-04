import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SketchPicker } from "react-color";

const EditCard = ({ title, tagColor, onDone, onCancel, onDelete }) => {
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedTagColor, setEditedTagColor] = useState(tagColor);
    const [customTagColor, setCustomTagColor] = useState(tagColor);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleColorChange = (color) => {
        setEditedTagColor(color.hex);
        setCustomTagColor(color.hex);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        onDelete();
        onCancel();
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 bg-blue-300/20 backdrop-blur-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onCancel}
                style={{ zIndex: 60 }} />
            <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 70 }}>
                <motion.div
                    className="bg-white rounded-md w-full max-w-3xl flex flex-col shadow-lg overflow-hidden"
                    initial={{ y: "-20%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 15,
                    }}>
                    <div className="bg-blue-500 p-3 shadow-md">
                        <h3 className="text-xl font-bold text-white text-center">Edit Task List</h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={editedTitle}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setEditedTitle(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="tagColor" className="text-sm font-medium text-gray-700">
                                    Tag Color
                                </label>
                                <input
                                    id="tagColor"
                                    type="text"
                                    value={customTagColor}
                                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setCustomTagColor(e.target.value)} />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="flex justify-center">
                                <SketchPicker
                                    color={customTagColor}
                                    onChange={handleColorChange}
                                    width="100%" />
                            </div>
                            <div className="flex flex-col justify-between">
                                <div className="flex justify-between mb-4">
                                    <button
                                        className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-all duration-200 hover:scale-105"
                                        onClick={onCancel}>
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                                        onClick={() => onDone(editedTitle, editedTagColor)}>
                                        Done
                                    </button>
                                </div>
                                <button
                                    className="w-full bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                                    onClick={handleDeleteClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                    Delete Task List
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={handleCancelDelete}></div>
                    <motion.div
                        className="bg-white rounded-md w-96 p-4 flex flex-col gap-3 shadow-xl relative z-100"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Delete Task List</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete the task list "{title}"? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-between mt-2">
                            <button
                                className="bg-gray-200 text-gray-800 py-1 px-4 rounded-md hover:bg-gray-300 transition-colors duration-200 w-36"
                                onClick={handleCancelDelete}>
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 w-36"
                                onClick={handleConfirmDelete}>
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditCard;