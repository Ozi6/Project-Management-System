import { motion } from 'framer-motion';
import { useState } from 'react';
import { SketchPicker } from 'react-color';

const EditCard = ({ title, tagColor, onDone, onCancel, initialYPosition }) =>
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
        <>
            <motion.div
                className="fixed inset-0 bg-blue-300 bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                onClick={onCancel}
                style={{ zIndex: 40 }}/>
            <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
                <motion.div
                    className="bg-white p-4 rounded-md w-72 flex flex-col gap-4"
                    initial={{ y: initialYPosition || '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 150 }}>
                    <h3 className="text-xl font-semibold">Edit Task</h3>
                    <div className="flex flex-col">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={editedTitle}
                            className="border p-2 rounded-md"
                            onChange={(e) => setEditedTitle(e.target.value)}/>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="tagColor">Tag Color</label>
                        <input
                            id="tagColor"
                            type="text"
                            value={customTagColor}
                            className="border p-2 rounded-md mb-2"
                            onChange={(e) => setCustomTagColor(e.target.value)}/>
                        <SketchPicker color={customTagColor} onChange={handleColorChange}/>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition"
                            onClick={() => onDone(editedTitle, editedTagColor)}>
                            Done
                        </button>
                        <button
                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition"
                            onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default EditCard;