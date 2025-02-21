import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import PropTypes from "prop-types";
import ListEntry from "./ListEntry";

const TaskList = ({ title, tagColor }) =>
{
    const [entries, setEntries] = useState(["Example Entry"]);
    const addEntry = () =>
    {
        setEntries([...entries, `New Entry ${entries.length + 1}`]);
    };
    return(
        <div className="bg-gray-100 rounded-lg shadow-md p-2 flex flex-col w-64">
            <div className="p-3 rounded-md flex justify-between items-center text-white" style={{ backgroundColor: tagColor }}>
                <span className="w-full text-left">{title}</span>
                <Settings size={18} cursor="pointer"/>
            </div>
            <div className="flex flex-col gap-2 p-2">
                {entries.length > 0 ? (entries.map((entry, index) => <ListEntry key={index} text={entry} />)) : (<p className="text-center text-gray-500">No entries</p>)}
            </div>
            <button
                onClick={addEntry}
                className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md flex items-center justify-center gap-1 hover:bg-blue-600 transition">
                <Plus size={16} /> Add Entry
            </button>
        </div>
    );
};


TaskList.propTypes =
{
    title: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
};

export default TaskList;