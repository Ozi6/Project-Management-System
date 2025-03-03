import { useState } from "react";
import { format, eachDayOfInterval } from "date-fns";

const GanttChart = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: "Design UI", start: new Date(2025, 2, 1), end: new Date(2025, 2, 5) },
        { id: 2, title: "Develop Backend", start: new Date(2025, 2, 3), end: new Date(2025, 2, 10) },
        { id: 3, title: "Testing", start: new Date(2025, 2, 7), end: new Date(2025, 2, 14) },
        { id: 4, title: "API Integration", start: new Date(2025, 2, 5), end: new Date(2025, 2, 12) },
        { id: 5, title: "Documentation", start: new Date(2025, 2, 10), end: new Date(2025, 2, 16) },
        { id: 6, title: "Deployment", start: new Date(2025, 2, 15), end: new Date(2025, 2, 20) },
        { id: 7, title: "Review", start: new Date(2025, 2, 18), end: new Date(2025, 2, 25) },
        { id: 8, title: "Design UI", start: new Date(2025, 2, 1), end: new Date(2025, 2, 5) },
        { id: 9, title: "Develop Backend", start: new Date(2025, 2, 3), end: new Date(2025, 2, 10) },
        { id: 10, title: "Testing", start: new Date(2025, 2, 7), end: new Date(2025, 2, 14) },
        { id: 11, title: "API Integration", start: new Date(2025, 2, 5), end: new Date(2025, 2, 12) },
        { id: 12, title: "Documentation", start: new Date(2025, 2, 10), end: new Date(2025, 2, 16) },
        { id: 13, title: "Deployment", start: new Date(2025, 2, 15), end: new Date(2025, 2, 20) },
        { id: 14, title: "Review", start: new Date(2025, 2, 18), end: new Date(2025, 2, 25) }
    ]);

    const startOfMonth = new Date(2025, 2, 1);
    const endOfMonth = new Date(2025, 2, 31);
    const daysInMonth = eachDayOfInterval({ start: startOfMonth, end: endOfMonth });

    const handleResize = (taskId, newEndDate) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, end: newEndDate } : task
            )
        );
    };

    return (
        <div className="flex w-full border rounded-lg shadow bg-white p-4">
            {/* Task List */}
            <div className="w-1/4 border-r p-4">
                <h2 className="text-lg font-semibold mb-4">Tasks</h2>
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className="py-2 border-b text-sm h-8 flex items-center"
                    >
                        {task.title}
                    </div>
                ))}
            </div>

            {/* Calendar View */}
            <div className="flex-1 p-4 overflow-x-auto">
                <div className="w-full">
                    {/* Month and Year Header */}
                    <div className="text-center text-lg font-semibold mb-2">
                        {format(startOfMonth, "MMMM yyyy")}
                    </div>

                    {/* Days Header */}
                    <div className="flex mb-2">
                        <div className="w-20 flex-shrink-0"></div>
                        {daysInMonth.map((day, index) => (
                            <div
                                key={index}
                                className="w-8 flex-shrink-0 text-center text-xs font-medium border border-gray-100 bg-gray-50"
                            >
                                {format(day, "d")}
                            </div>
                        ))}
                    </div>

                    {/* Timeline with Grid */}
                    <div className="relative w-full" style={{ height: `${tasks.length * 32}px` }}>
                        {/* Background Grid */}
                        <div className="absolute top-0 left-0 w-full h-full">
                            {tasks.map((_, taskIndex) => (
                                <div 
                                    key={taskIndex}
                                    className="flex absolute w-full"
                                    style={{ top: `${taskIndex * 32}px`, height: "32px" }}
                                >
                                    <div className="w-20 flex-shrink-0" />
                                    {daysInMonth.map((_, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            className="w-8 flex-shrink-0 border border-gray-100"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Tasks */}
                        <div className="relative">
                            {tasks.map((task, index) => {
                                const startDay = task.start.getDate() - 1;
                                const duration = task.end.getDate() - task.start.getDate() + 1;
                                const leftOffset = startDay * 32 + 80;
                                const taskWidth = duration * 32;

                                return (
                                    <div
                                        key={task.id}
                                        className="absolute bg-blue-500 text-white text-xs rounded-md cursor-ew-resize flex items-center justify-center z-10 opacity-80"
                                        style={{
                                            left: `${leftOffset}px`,
                                            width: `${taskWidth}px`,
                                            height: "24px",
                                            top: `${index * 32 + 4}px`
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            const startX = e.clientX;
                                            const originalWidth = taskWidth;
                                            const originalEnd = new Date(task.end);

                                            const onMouseMove = (moveEvent) => {
                                                const diff = moveEvent.clientX - startX;
                                                const newDuration = Math.max(1, Math.round((originalWidth + diff) / 32));
                                                const newEndDate = new Date(task.start);
                                                newEndDate.setDate(task.start.getDate() + newDuration - 1);
                                                handleResize(task.id, newEndDate);
                                            };

                                            const onMouseUp = () => {
                                                document.removeEventListener("mousemove", onMouseMove);
                                                document.removeEventListener("mouseup", onMouseUp);
                                            };

                                            document.addEventListener("mousemove", onMouseMove);
                                            document.addEventListener("mouseup", onMouseUp);
                                        }}
                                    >
                                        {task.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttChart;