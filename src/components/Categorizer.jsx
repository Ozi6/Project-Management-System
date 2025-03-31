import { useState, useRef, useEffect } from "react";
import TaskList from "./TaskList";
import { Plus, Settings } from "lucide-react";
import EditCategorizerCard from "./EditCategorizerCard";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Categorizer = ({
    title,
    tagColor,
    taskLists,
    categoryId,
    columnIndex,
    taskIndex,
    selectedEntryId,
    onSelectEntry,
    onAddEntry,
    onEntryDelete,
    onEditCardOpen,
    onAddList,
    onMoveEntry,
    onMoveTaskList,
    onDeleteList,
    onDeleteCategory,
    onUpdateEntryCheckedStatus,
    onUpdateCategory,
    onUpdateTaskList,
    onEntryUpdate
}) => {
    const {t} = useTranslation();
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);
    const [dragPosition, setDragPosition] = useState(null);
    const [isDraggingCategory, setIsDraggingCategory] = useState(false);
    const [isEditCategorizerCardOpen, setIsEditCategorizerCardOpen] = useState(false);
    const categorizerRef = useRef(null);
    const dragImageRef = useRef(null);
    const mouseOffsetX = useRef(0);
    const mouseOffsetY = useRef(0);

    const handleEditCategorizerCardOpen = () => {
        setIsEditCategorizerCardOpen(true);
    };

    const handleEditCategorizerCardDone = (newTitle, newTagColor) => {
        console.log("Done clicked", newTitle, newTagColor);
        try {
            onUpdateCategory(categoryId, newTitle, newTagColor);
        } catch (error) {
            console.error("Error updating category:", error);
        }
        setIsEditCategorizerCardOpen(false);
    };

    const handleEditCategorizerCardCancel = () =>
    {
        setIsEditCategorizerCardOpen(false);
    };

    return (
        <div
            className="bg-[var(--bg-color)] p-4 rounded-lg flex flex-col items-center w-[290px]"
            style={{ boxShadow: '0 30px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)', border: `2px solid ${tagColor}` }}
            ref={categorizerRef}
        >
            <div className="mb-4 font-bold text-lg flex items-center gap-2" style={{ color: tagColor, fontSize: "20px" }}>
                {title}
                <button
                    onClick={handleEditCategorizerCardOpen}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <Settings size={20}/>
                </button>
            </div>
            <div className="flex flex-col gap-4 w-full items-center">
                {taskLists.map((taskList, index) => {
                    const isCurrentlyDragged =
                        window.dragState &&
                        window.dragState.isDraggingList &&
                        window.dragState.draggedListId === taskList.id &&
                        window.dragState.sourceCategoryId === categoryId;

                    const showDropIndicator =
                        draggedOverIndex === index &&
                        window.dragState &&
                        window.dragState.isDraggingList &&
                        (window.dragState.sourceCategoryId !== categoryId ||
                            window.dragState.draggedListId !== taskList.id);

                    return (
                        <div key={taskList.id} className="task-list-container w-full items-center justify-center">
                            {showDropIndicator && dragPosition === 'above' && (
                                <div className="border-2 border-dashed border-blue-500 rounded-md h-4 mb-4 items-center justify-center"></div>
                            )}
                            <div className={isCurrentlyDragged ? "opacity-50" : ""}>
                                <TaskList
                                    title={taskList.title}
                                    tagColor={taskList.tagColor}
                                    entries={taskList.entries}
                                    listId={taskList.id}
                                    categoryId={categoryId}
                                    selectedEntryId={selectedEntryId}
                                    onSelectEntry={onSelectEntry}
                                    onAddEntry={() => onAddEntry(taskList.id)}
                                    onEntryDelete={(listId, entryIndex) =>
                                        onEntryDelete(columnIndex, taskIndex, listId, entryIndex)}
                                    onDeleteList={(listId) => onDeleteList(columnIndex, taskIndex, listId)}
                                    onEditCardOpen={onEditCardOpen}
                                    onMoveEntry={onMoveEntry}
                                    onUpdateTaskList={onUpdateTaskList}
                                    onDragStart={(event) => handleTaskListDragStart(taskList.id, taskList.title, event)}
                                    onUpdateEntryCheckedStatus={(listId, entryIndex, isChecked) =>
                                        onUpdateEntryCheckedStatus(listId, entryIndex, isChecked)}
                                    onEntryUpdate={(listId, entryIndex, updateData) =>
                                        onEntryUpdate(listId, entryIndex, updateData)
                                    }
                                    />
                            </div>
                            {showDropIndicator && dragPosition === 'below' && (
                                <div className="border-2 border-dashed border-[var(--features-icon-color)] rounded-md h-4 mt-4 items-center justify-center"></div>
                            )}
                        </div>
                    );
                })}
                {draggedOverIndex === taskLists.length && window.dragState && window.dragState.isDraggingList && (
                    <div className="border-2 border-dashed border-[var(--features-icon-color)] rounded-md h-16 my-2 flex items-center justify-center bg-[var(--loginpage-bg)]">
                        <span className="text-[var(--features-icon-color)] text-sm">Drop list here</span>
                    </div>
                )}
            </div>

            <button
                onClick={onAddList}
                className="mt-4 bg-[var(--hover-color)] !text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 transition-all duration-300 hover:bg-[var(--alt-card-color)] hover:scale-105">
                <Plus size={16} /> {t("prode.add")}
            </button>

            {isDraggingCategory && window.dragState && (
                <div
                    ref={dragImageRef}
                    className="fixed z-50 shadow-lg rounded-md border border-[var(--features-icon-color)] pointer-events-none"
                    style={{
                        width: window.dragState.originalWidth ? `${window.dragState.originalWidth}px` : 'auto',
                        opacity: 0.8
                    }}>
                    <div
                        className="p-3 rounded-md flex justify-between items-center"
                        style={{ backgroundColor: taskLists.find(list => list.id === window.dragState.draggedListId)?.tagColor }}>
                        <span className="w-full text-left">
                            {window.dragState.draggedListTitle}
                        </span>
                    </div>
                </div>
            )}

            {isEditCategorizerCardOpen && (
                <EditCategorizerCard
                    title={title}
                    tagColor={tagColor}
                    onDone={handleEditCategorizerCardDone}
                    onCancel={handleEditCategorizerCardCancel}
                    onDelete={() => onDeleteCategory(categoryId)}
                />
            )}
        </div>
    );
};

Categorizer.propTypes = {
    title: PropTypes.string.isRequired,
    tagColor: PropTypes.string.isRequired,
    taskLists: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            tagColor: PropTypes.string.isRequired,
            entries: PropTypes.array.isRequired,
        })
    ).isRequired,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    columnIndex: PropTypes.number.isRequired,
    taskIndex: PropTypes.number.isRequired,
    selectedEntryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelectEntry: PropTypes.func.isRequired,
    onAddEntry: PropTypes.func.isRequired,
    onEditCardOpen: PropTypes.func.isRequired,
    onAddList: PropTypes.func.isRequired,
    onMoveEntry: PropTypes.func.isRequired,
    onMoveTaskList: PropTypes.func.isRequired,
    onUpdateEntryCheckedStatus: PropTypes.func.isRequired,
    onUpdateCategory: PropTypes.func.isRequired,
    onDeleteCategory: PropTypes.func.isRequired,
};

export default Categorizer;