import { useState, useRef, useEffect } from "react";
import TaskList from "./TaskList";
import { Plus } from "lucide-react";
import PropTypes from "prop-types";

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
    onEditCardOpen,
    onAddList,
    onMoveEntry,
    onMoveTaskList
}) =>
{
    const [draggedOverIndex, setDraggedOverIndex] = useState(null);
    const [dragPosition, setDragPosition] = useState(null);
    const [isDraggingCategory, setIsDraggingCategory] = useState(false);
    const categorizerRef = useRef(null);
    const dragImageRef = useRef(null);
    const mouseOffsetX = useRef(0);
    const mouseOffsetY = useRef(0);

    const handleTaskListDragStart = (listId, listTitle, { offsetX, offsetY }) => {
        setIsDraggingList(true);
        window.dragState = {
            isDraggingList: true,
            draggedListId: listId,
            draggedListTitle: listTitle,
            sourceCategoryId: categoryId,
            offsetX,
            offsetY
        };
    };

    const handleTaskListDragEnd = () =>
    {
        if (window.dragState && window.dragState.isDraggingList)
        {
            if (draggedOverIndex !== null)
            {
                
            }
        }

        setIsDraggingCategory(false);
        setDraggedOverIndex(null);
        setDragPosition(null);

        document.removeEventListener('mousemove', handleMouseMove);
        document.body.classList.remove('dragging');

        window.dragState = null;
    };

    const handleMouseMove = (e) =>
    {
        if (dragImageRef.current)
        {
            dragImageRef.current.style.left = `${e.clientX - mouseOffsetX.current}px`;
            dragImageRef.current.style.top = `${e.clientY - mouseOffsetY.current}px`;
        }

        if(!window.dragState || !window.dragState.isDraggingList || !categorizerRef.current)
            return;
        const rect = categorizerRef.current.getBoundingClientRect();
        if (e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom)
        {
            const taskListElements = categorizerRef.current.querySelectorAll('.task-list-container');
            if (taskListElements.length === 0)
            {
                setDraggedOverIndex(0);
                setDragPosition('below');

                window.dragState.currentHoverCategoryId = categoryId;
                window.dragState.currentHoverIndex = 0;
                return;
            }

            let closestIndex = 0;
            let closestDistance = Infinity;
            let position = 'below';

            taskListElements.forEach((el, index) =>
            {
                const taskListRect = el.getBoundingClientRect();
                const taskListMiddle = taskListRect.top + taskListRect.height / 2;
                const distance = Math.abs(e.clientY - taskListMiddle);

                if(distance < closestDistance)
                {
                    closestDistance = distance;
                    closestIndex = index;
                    position = e.clientY < taskListMiddle ? 'above' : 'below';
                }
            });
            const isSameCategory = window.dragState.sourceCategoryId === categoryId;

            if(isSameCategory)
            {
                const draggedIndex = taskLists.findIndex(list => list.id === window.dragState.draggedListId);
                const targetIndex = position === 'below' ? closestIndex + 1 : closestIndex;

                if(targetIndex === draggedIndex || targetIndex === draggedIndex + 1)
                {
                    setDraggedOverIndex(null);
                    setDragPosition(null);

                    window.dragState.currentHoverCategoryId = categoryId;
                    window.dragState.currentHoverIndex = null;
                    return;
                }
            }
            const targetIndex = position === 'below' ? closestIndex + 1 : closestIndex;
            setDraggedOverIndex(targetIndex);
            setDragPosition(position);

            window.dragState.currentHoverCategoryId = categoryId;
            window.dragState.currentHoverIndex = targetIndex;
        }
        else
        {
            setDraggedOverIndex(null);
            setDragPosition(null);

            if(window.dragState.currentHoverCategoryId === categoryId)
            {
                window.dragState.currentHoverCategoryId = null;
                window.dragState.currentHoverIndex = null;
            }
        }
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (window.dragState && window.dragState.isDraggingList) {
                handleTaskListDragEnd();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleGlobalMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.body.classList.remove('dragging');
        };
    }, [categoryId, taskLists]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md" ref={categorizerRef}>
            <div className="mb-4 font-bold text-lg" style={{ color: tagColor }}>
                {title}
            </div>
            <div className="flex flex-col gap-4">
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
                        <div key={taskList.id} className="task-list-container">
                            {showDropIndicator && dragPosition === 'above' && (
                                <div className="border-2 border-dashed border-blue-500 rounded-md h-4 mb-4"></div>
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
                                    onEditCardOpen={onEditCardOpen}
                                    onMoveEntry={onMoveEntry}
                                    onDragStart={(event) => handleTaskListDragStart(taskList.id, taskList.title, event)}
                                />
                            </div>
                            {showDropIndicator && dragPosition === 'below' && (
                                <div className="border-2 border-dashed border-blue-500 rounded-md h-4 mt-4"></div>
                            )}
                        </div>
                    );
                })}
                {draggedOverIndex === taskLists.length && window.dragState && window.dragState.isDraggingList && (
                    <div className="border-2 border-dashed border-blue-500 rounded-md h-16 my-2 flex items-center justify-center bg-blue-50">
                        <span className="text-blue-500 text-sm">Drop list here</span>
                    </div>
                )}
            </div>
            <button
                onClick={onAddList}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center gap-1 transition-all duration-300 hover:bg-blue-600 hover:scale-105">
                <Plus size={16} /> Add List
            </button>

            {isDraggingCategory && window.dragState && (
                <div
                    ref={dragImageRef}
                    className="fixed z-50 shadow-lg rounded-md border border-blue-500 pointer-events-none"
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
        </div>
    );
};

Categorizer.propTypes =
{
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
    onMoveEntry: PropTypes.func.isRequired
};

export default Categorizer;