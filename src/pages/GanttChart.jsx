import { useState } from "react";
import {
  format,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isWithinInterval,
  addDays,
} from "date-fns";
import ViewportSidebar from "../components/ViewportSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GanttChart = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1));
  const taskColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design UI",
      start: new Date(2025, 2, 1),
      end: new Date(2025, 2, 5),
    },
    {
      id: 2,
      title: "Develop Backend",
      start: new Date(2025, 2, 3),
      end: new Date(2025, 2, 10),
    },
    {
      id: 3,
      title: "Testing",
      start: new Date(2025, 2, 7),
      end: new Date(2025, 2, 14),
    },
    {
      id: 4,
      title: "API Integration",
      start: new Date(2025, 2, 5),
      end: new Date(2025, 2, 12),
    },
    {
      id: 5,
      title: "Documentation",
      start: new Date(2025, 2, 10),
      end: new Date(2025, 2, 16),
    },
    {
      id: 6,
      title: "Deployment",
      start: new Date(2025, 2, 15),
      end: new Date(2025, 2, 20),
    },
    {
      id: 7,
      title: "Review",
      start: new Date(2025, 2, 18),
      end: new Date(2025, 2, 25),
    },
    {
      id: 8,
      title: "Design UI",
      start: new Date(2025, 2, 1),
      end: new Date(2025, 2, 5),
    },
    {
      id: 9,
      title: "Develop Backend",
      start: new Date(2025, 2, 3),
      end: new Date(2025, 2, 10),
    },
    {
      id: 10,
      title: "Testing",
      start: new Date(2025, 2, 7),
      end: new Date(2025, 2, 14),
    },
    {
      id: 11,
      title: "API Integration",
      start: new Date(2025, 2, 5),
      end: new Date(2025, 2, 12),
    },
    {
      id: 12,
      title: "Documentation",
      start: new Date(2025, 2, 10),
      end: new Date(2025, 2, 16),
    },
    {
      id: 13,
      title: "Deployment",
      start: new Date(2025, 2, 15),
      end: new Date(2025, 2, 20),
    },
    {
      id: 14,
      title: "Review",
      start: new Date(2025, 2, 18),
      end: new Date(2025, 2, 25),
    },
    {
        id: 15,
        title: "Review",
        start: new Date(2025, 2, 18),
        end: new Date(2025, 2, 25),
      },
      {
        id: 16,
        title: "Review",
        start: new Date(2025, 2, 18),
        end: new Date(2025, 2, 25),
      },
  ]);

  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth,
    end: endOfMonth,
  });

  const filteredTasks = tasks.filter(
    (task) =>
      isWithinInterval(task.start, { start: startOfMonth, end: endOfMonth }) ||
      isWithinInterval(task.end, { start: startOfMonth, end: endOfMonth }) ||
      (task.start < startOfMonth && task.end > endOfMonth)
  );

  const handleTaskUpdate = (taskId, newStartDate, newEndDate) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, start: newStartDate, end: newEndDate }
          : task
      )
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => addMonths(prevDate, 1));
  };

  const handleResizeStart = (taskId, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const task = tasks.find((t) => t.id === taskId);
    const originalStart = new Date(task.start);
    const originalDuration = task.end.getDate() - task.start.getDate();

    const onMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      const daysDiff = Math.round(diff / 32); // 32px per day
      const newStartDate = addDays(originalStart, daysDiff);
      const newEndDate = addDays(newStartDate, originalDuration);

      if (newStartDate >= startOfMonth && newEndDate <= endOfMonth) {
        handleTaskUpdate(taskId, newStartDate, newEndDate);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleResizeEnd = (taskId, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const task = tasks.find((t) => t.id === taskId);
    const originalEnd = new Date(task.end);

    const onMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      const daysDiff = Math.round(diff / 32); // 32px per day
      const newEndDate = addDays(originalEnd, daysDiff);

      if (newEndDate <= endOfMonth && newEndDate >= task.start) {
        handleTaskUpdate(taskId, task.start, newEndDate);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex bg-white m-0 p-0 overflow-hidden">
      {/* Sidebar */}
      <div className="h-full bg-white shadow-md z-10 border-r border-gray-100 m-0 p-0">
        <ViewportSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-center p-2 border-b border-gray-100 bg-white z-10">
          <button
            onClick={handlePreviousMonth}
            className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-lg font-semibold mx-2">
            {format(startOfMonth, "MMMM yyyy")}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Task List and Calendar Container */}
        <div className="flex flex-1 overflow-hidden justify-center ">
          {/* Task List */}
          <div className="w-1/4 border-r border-gray-100 flex flex-col">
            <h2 className="text-lg font-semibold p-1">Tasks</h2>
            <div className="flex-1 overflow-y-auto">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-1 border-b text-sm h-8 flex items-center px-1 hover:bg-gray-100 transition-colors"
                  >
                    {task.title}
                  </div>
                ))
              ) : (
                <div className="py-1 text-sm h-8 flex items-center px-1 text-gray-500 hover:bg-gray-100 transition-colors">
                  No tasks this month
                </div>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 flex flex-col overflow-auto">
            {/* Days Header */}
            <div className="flex min-w-max border-b border-gray-100 bg-gray-50">
              {daysInMonth.map((day, index) => (
                <div
                  key={index}
                  className="w-8 flex-shrink-0 text-center text-xs font-medium border-r border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
            {/* Timeline with Grid */}
            <div className="relative flex-1 min-w-max h-[100vh]">
              {/* Background Grid */}
              <div className="absolute top-0 left-0 w-full h-[100vh] min-w-max">
                {Array.from({ length: Math.max(filteredTasks.length, 25) }).map(
                  (_, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="flex absolute w-full border-b border-gray-300 h-[100vh]"
                      style={{ top: `${taskIndex * 32}px`, height: "32px" }}
                    >
                      {daysInMonth.map((_, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="w-8 flex-shrink-0 border-r border-gray-300 hover:bg-gray-100 transition-colors"
                        />
                      ))}
                    </div>
                  )
                )}
              </div>
              {/* Tasks */}
              <div className="relative min-w-max space-y-2 mt-5">
                {filteredTasks.map((task, index) => {
                  const startDay = Math.max(
                    0,
                    task.start.getDate() - startOfMonth.getDate()
                  );
                  const endDay = Math.min(
                    daysInMonth.length - 1,
                    task.end.getDate() - startOfMonth.getDate()
                  );
                  const leftOffset = startDay * 32;
                  const taskWidth = (endDay - startDay + 1) * 32;

                  // Assign color based on task index
                  const taskColor = taskColors[index % taskColors.length];

                  return (
                    <div
                      key={task.id}
                      className={`${taskColor} text-white text-xs rounded-md z-10 opacity-80 flex items-center justify-between hover:opacity-100 hover:shadow-md transition-all duration-200`}
                      style={{
                        left: `${leftOffset}px`,
                        width: `${taskWidth}px`,
                        height: "24px",
                        top: `${index * 32 + 4}px`,
                      }}
                    >
                      <div
                        className="w-2 cursor-w-resize hover:bg-white/20"
                        onMouseDown={(e) => handleResizeStart(task.id, e)}
                      />
                      <div className="flex-1 text-center truncate px-1">
                        {task.title}
                      </div>
                      <div
                        className="w-2 cursor-e-resize hover:bg-white/20"
                        onMouseDown={(e) => handleResizeEnd(task.id, e)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
