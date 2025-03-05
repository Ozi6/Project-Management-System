import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FaCalendarAlt, FaTimes, FaPaperclip, FaTrash } from "react-icons/fa";

const ListEntryEditPopup = ({ entry, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        text: "",
        dueDate: "",
        warningThreshold: 1,
        checked: false,
        file: null,
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                text: entry.text || "",
                dueDate: entry.dueDate ? new Date(entry.dueDate).toISOString().split("T")[0] : "",
                warningThreshold: entry.warningThreshold || 1,
                checked: entry.checked || false,
                file: entry.file || null,
            });
        }
    }, [entry]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                file: files[0] || null, // Set to new file or null if no file selected
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleRemoveFile = () => {
        setFormData((prev) => ({
            ...prev,
            file: null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedEntry = {
            ...entry,
            text: formData.text,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            warningThreshold: parseInt(formData.warningThreshold, 10),
            checked: formData.checked,
            file: formData.file,
        };
        onSave(updatedEntry);
        onClose();
    };

    const clearDueDate = () => {
        setFormData((prev) => ({
            ...prev,
            dueDate: "",
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-blue-500 text-white rounded-t-lg p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Edit Task</h2>
                        <button
                            onClick={onClose}
                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                        >
                            <FaTimes className="text-white" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="text">
                            Task Name
                        </label>
                        <input
                            type="text"
                            id="text"
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            placeholder="Enter task name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="flex justify-between">
                            <span className="block text-gray-700 text-sm font-medium mb-1">Due Date (Optional)</span>
                            {formData.dueDate && (
                                <button
                                    type="button"
                                    onClick={clearDueDate}
                                    className="text-xs text-blue-500 hover:text-blue-700"
                                >
                                    Clear
                                </button>
                            )}
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                            />
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {formData.dueDate && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="warningThreshold">
                                Warning Threshold (days)
                            </label>
                            <input
                                type="number"
                                id="warningThreshold"
                                name="warningThreshold"
                                value={formData.warningThreshold}
                                onChange={handleChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Show warning when task is due within this many days
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="checked"
                                checked={formData.checked}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-gray-700 text-sm">Mark as completed</span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="file">
                            Attach File
                        </label>
                        {formData.file && (
                            <div className="flex items-center gap-2 mb-2">
                                <FaPaperclip className="text-gray-500" />
                                <span className="text-sm text-gray-700">
                                    {formData.file.name.length > 15
                                        ? formData.file.name.substring(0, 15) + "..." + formData.file.name.substring(formData.file.name.lastIndexOf("."))
                                        : formData.file.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="text-red-500 hover:text-red-700"
                                    title="Remove file"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.file && (
                            <p className="text-xs text-gray-500 mt-1">
                                Upload a new file to replace the current one.
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

ListEntryEditPopup.propTypes = {
    entry: PropTypes.shape({
        text: PropTypes.string,
        dueDate: PropTypes.instanceOf(Date),
        warningThreshold: PropTypes.number,
        checked: PropTypes.bool,
        entryId: PropTypes.string,
        file: PropTypes.instanceOf(File),
    }),
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ListEntryEditPopup;