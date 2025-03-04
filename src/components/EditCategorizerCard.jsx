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

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 bg-blue-300/20 backdrop-blur-xs rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
                style={{ zIndex: 60 }} />
            <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 70 }}>
                <motion.div
                    className="bg-white rounded-xl w-full max-w-3xl flex flex-col shadow-lg"
                    initial={{ y: "-20%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}>
                    <div className="bg-blue-500 p-3 rounded-t-xl">
                        <h3 className="text-xl font-bold text-white text-center">Edit Category</h3>
                    </div>
                    <div className="flex">
                        <div className="flex-1 p-4 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setEditedTitle(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tag Color</label>
                                    <input
                                        type="text"
                                        value={customTagColor}
                                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={(e) => setCustomTagColor(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <button
                                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
                                    onClick={() => setShowDeleteConfirm(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                    Delete
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-700"
                                        onClick={onCancel}>
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => onDone(editedTitle, editedTagColor)}>
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <SketchPicker
                                color={customTagColor}
                                onChange={handleColorChange}
                                width="200px" />
                        </div>
                    </div>
                </motion.div>

                {showDeleteConfirm && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ zIndex: 80 }}>
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={() => setShowDeleteConfirm(false)} />
                        <motion.div
                            className="bg-white rounded-xl w-96 p-4 space-y-3 shadow-xl relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
                                <p className="text-sm text-gray-500">Are you sure? This cannot be undone.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="flex-1 bg-gray-200 text-gray-800 py-1 rounded-md hover:bg-gray-300"
                                    onClick={() => setShowDeleteConfirm(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 bg-red-500 text-white py-1 rounded-md hover:bg-red-700"
                                    onClick={() => { onDelete(); onCancel(); }}>
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    );
};

export default EditCard;