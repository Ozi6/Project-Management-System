import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import PropTypes from "prop-types";
import ListEntry from "./ListEntry";
import EditCard from "./EditCard";
import { AnimatePresence } from "framer-motion";

const TaskList = ({ title, tagColor, entries, onAddEntry }) =>
{
    const [isEditing, setIsEditing] = useState(false);
    const [editableTitle, setEditableTitle] = useState(title);
    const [editableTagColor, setEditableTagColor] = useState(tagColor);
    const [newEntryId, setNewEntryId] = useState(null);

    const handleDone = (newTitle, newTagColor) =>
    {
        setEditableTitle(newTitle);
        setEditableTagColor(newTagColor);
        setIsEditing(false);
    };

    const handleCancel = () =>
    {
        setIsEditing(false);
    };

    const getLuminance = (color) =>
    {
        const rgb = color.match(/\w\w/g).map((x) => parseInt(x, 16));
        const [r, g, b] = rgb;
        const a = [r, g, b]
            .map((x) => x / 255)
            .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const luminance = getLuminance(editableTagColor.replace("#", ""));
    const textColor = luminance < 0.5 ? "white" : "black";

    return(
        <div className="relative">
            <div
                className={`bg-gray-100 rounded-lg shadow-md p-2 flex flex-col w-64 transition-all duration-300 ease-in-out
                ${newEntryId ? "animate-[expand_0.3s_ease-out_forwards]" : ""}`}>
                <div
                    className="p-3 rounded-md flex justify-between items-center"
                    style={{ backgroundColor: editableTagColor, color: textColor }}>
                    <span className="w-full text-left">{editableTitle}</span>
                    <Settings
                        size={18}
                        cursor="pointer"
                        onClick={() => setIsEditing(true)}
                        className="transition-transform transform hover:scale-150 hover:text-gray-150"/>
                </div>
                <div className="flex flex-col gap-2 p-2">
                    {entries.length > 0 ? (entries.map((entry, index) => (
                            <ListEntry
                                key={`${index}-${entry}`}
                                text={entry}
                                isNew={index === entries.length - 1 && newEntryId !== null}/>))) : (<p className="text-center text-gray-500">No entries</p>)
                    }
                </div>
                <button
                    onClick={onAddEntry}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 transition-all duration-300 hover:bg-blue-600 hover:scale-105">
                    <Plus size={16} /> Add Entry
                </button>
            </div>
            <AnimatePresence mode="wait">
                {
                    isEditing && (<EditCard
                        title={editableTitle}
                        tagColor={editableTagColor}
                        onDone={handleDone}
                            onCancel={handleCancel}/>)
                }
            </AnimatePresence>
            <style jsx>
            {
                `
                @keyframes expand {
                    from {
                        max-height: calc(100% - 3rem);
                    }
                    to {
                        max-height: calc(100% + 3rem);
                    }
                }
                `
            }
            </style>
        </div>
    );
};

TaskList.propTypes =
{
    title: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    onAddEntry: PropTypes.func.isRequired,
};

export default TaskList;