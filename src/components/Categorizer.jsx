import React from "react";
import TaskList from "./TaskList";
import { Plus } from "lucide-react";

const Categorizer = ({ title, tagColor, taskLists, isSelected, onAddEntry, onClick, onEditCardOpen, onAddList }) => {
    return (
        <div
            className={`p-4 rounded-lg shadow-md min-w-72 ${isSelected ? "border-2 border-blue-500" : "border border-gray-200"
                }`}
            style={{ backgroundColor: tagColor + "10" }}
            onClick={onClick}
        >
            <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
            <div className="flex flex-col gap-4 items-center">
                {taskLists.map((taskList) => (
                    <TaskList
                        key={taskList.id} // Use task list ID as key
                        title={taskList.title}
                        tagColor={taskList.tagColor}
                        entries={taskList.entries}
                        isSelected={isSelected}
                        onAddEntry={onAddEntry}
                        onClick={onClick}
                        onEditCardOpen={onEditCardOpen}
                    />
                ))}
            </div>
            <button
                onClick={onAddList}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 w-full transition-all duration-300 hover:bg-blue-600 hover:scale-105">
                <Plus size={16} /> Add List
            </button>
        </div>
    );
};

export default Categorizer;