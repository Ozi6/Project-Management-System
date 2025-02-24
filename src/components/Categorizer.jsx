import TaskList from "./TaskList";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";

const Categorizer = (
{
    title,
    tagColor,
    taskLists,
    categoryId,
    selectedEntryId,
    onSelectEntry,
    onAddEntry,
    onEditCardOpen,
    onAddList,
}) =>
{
    return(
        <div
            className={`p-4 rounded-lg shadow-md min-w-72 border border-gray-200`}
            style={{ backgroundColor: tagColor + "10" }}>
            <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
            <div className="flex flex-col gap-4 items-center">
                {
                    taskLists.map((taskList) => (
                    <TaskList
                        key={taskList.id}
                        listId={taskList.id}
                        categoryId={categoryId}
                        title={taskList.title}
                        tagColor={taskList.tagColor}
                        entries={taskList.entries}
                        selectedEntryId={selectedEntryId}
                        onSelectEntry={onSelectEntry}
                        onAddEntry={() => onAddEntry(taskList.id)}
                        onEditCardOpen={onEditCardOpen}/>
                    ))
                }
            </div>
            <button
                onClick={onAddList}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 w-full transition-all duration-300 hover:bg-blue-600 hover:scale-105">
                <Plus size={16}/> Add List
            </button>
        </div>
    );
};

export default Categorizer;

Categorizer.propTypes =
{
    title: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
    taskLists: PropTypes.arrayOf(
        PropTypes.shape(
        {
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            tagColor: PropTypes.string.isRequired,
            entries: PropTypes.array.isRequired,
        })).isRequired,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    selectedEntryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelectEntry: PropTypes.func.isRequired,
    onAddEntry: PropTypes.func.isRequired,
    onEditCardOpen: PropTypes.func.isRequired,
    onAddList: PropTypes.func.isRequired,
};