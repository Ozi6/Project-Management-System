import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SketchPicker } from "react-color";

const EditCategorizerCard = ({ title, tagColor, onDone, onCancel }) =>
{
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedTagColor, setEditedTagColor] = useState(tagColor);
    const [customTagColor, setCustomTagColor] = useState(tagColor);

    const handleColorChange = (color) =>
    {
        setEditedTagColor(color.hex);
        setCustomTagColor(color.hex);
    };

    return(
        <AnimatePresence mode="wait">
            <motion.div
                className="fixed inset-0 bg-blue-300/20 backdrop-blur-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onCancel}
                style={{ zIndex: 40 }}/>
            <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
                <motion.div
                    className="bg-white rounded-md w-80 flex flex-col shadow-lg overflow-hidden"
                    initial={{ y: "-20%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 15,
                    }}>
                    <div className="bg-blue-500 p-4 shadow-md">
                        <h3 className="text-2xl font-bold text-white text-center">Edit Category</h3>
                    </div>
                    <div className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={editedTitle}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setEditedTitle(e.target.value)}/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tagColor" className="text-sm font-medium text-gray-700">
                                Tag Color
                            </label>
                            <input
                                id="tagColor"
                                type="text"
                                value={customTagColor}
                                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                                onChange={(e) => setCustomTagColor(e.target.value)}
                            />
                            <div className="flex justify-center">
                                <SketchPicker
                                    color={customTagColor}
                                    onChange={handleColorChange}
                                    width="100%"/>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-700 transition-all duration-200 hover:scale-110 w-32"
                                onClick={onCancel}>
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-all duration-200 hover:scale-110 w-32"
                                onClick={() => onDone(editedTitle, editedTagColor)}>
                                Done
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditCategorizerCard;