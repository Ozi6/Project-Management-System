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
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-gray-800/50 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ zIndex: 40 }}
      />
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ zIndex: 50 }}
      >
        <motion.div
          className="bg-white rounded-md w-[480px] flex flex-col shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          initial={{ y: "-20%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
        >
          <div className="bg-indigo-500 p-4 shadow-md rounded-t-md hover:bg-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105">
            <h3 className="text-xl font-bold text-white text-center ">
              Task Details
            </h3>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <div className="space-y-4 ">
              <div className="bg-gray-50 p-3 rounded-md hover:bg-indigo-100 hover:shadow-md transition-all duration-200 hover:scale-105">
                <label className="font-medium text-gray-700 block mb-1">
                  Title:
                </label>
                <p className="text-gray-900">{task.title}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md hover:bg-indigo-100 hover:shadow-md transition-all duration-200 hover:scale-105">
                <label className="font-medium text-gray-700 block mb-1">
                  Team:
                </label>
                <p className="text-gray-900">{task.assignedTeam}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md hover:bg-indigo-100 hover:shadow-md transition-all duration-200 hover:scale-105">
                <label className="font-medium text-gray-700 block mb-1">
                  Assigned member:
                </label>
                <p className="text-gray-900">{task.assignedTo}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md hover:bg-indigo-100 hover:shadow-md transition-all duration-200 hover:scale-105">
                <label className="font-medium text-gray-700 block mb-1">
                  Start Date:
                </label>
                <p className="text-gray-900">
                  {task.startDate
                    ? format(new Date(task.startDate), "dd MMM yyyy")
                    : "Не указана"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md hover:bg-indigo-100 hover:shadow-md transition-all duration-200 hover:scale-105">
                <label className="font-medium text-gray-700 block mb-1">
                  End Date:
                </label>
                <p className="text-gray-900">
                  {task.endDate
                    ? format(new Date(task.endDate), "dd MMM yyyy")
                    : "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-4 ">
              <button
                className="bg-indigo-500 w-full text-white py-2 px-6 rounded-md hover:bg-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
  
};

const GanttChart = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState(
    [
      {
        title: "Complete project proposal",
        startDate: "2025-03-15T00:00:00.000Z",
        endDate: "2025-03-16T00:00:00.000Z",
        assignedTeam: "Category A",
        assignedTo: "Bob",
      },
      {
        title: "Review design mockups",
        startDate: "2025-03-02T00:00:00.000Z",
        endDate: "2025-03-03T00:00:00.000Z",
        assignedTeam: "Category A",
        assignedTo: "Alice",
      },
      {
        title: "Prepare presentation slides",
        startDate: "2025-03-10T00:00:00.000Z",
        endDate: "2025-03-20T00:00:00.000Z",
        assignedTeam: "Category A",
        assignedTo: "Bob",
      },
      {
        title: "Send meeting invites",
        startDate: null,
        endDate: null,
        assignedTeam: "Category A",
        assignedTo: "Alice",
      },
      {
        title: "Update website content",
        startDate: "2025-03-02T00:00:00.000Z",
        endDate: "2025-03-26T00:00:00.000Z",
        assignedTeam: "Category B",
        assignedTo: "David",
      },

    ]
  );

  const teamColors = {
    "Category A": "#8b5cf6",
    "Category B": "#f43f5e",
    "Category C": "#f97316",
  };

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

  const filteredTasks = tasks.filter((task) => {
    if (!task.startDate || !task.endDate) return false;
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    return (
      isWithinInterval(start, { start: startOfMonth, end: endOfMonth }) ||
      isWithinInterval(end, { start: startOfMonth, end: endOfMonth }) ||
      (start < startOfMonth && end > endOfMonth)
    );
  });

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (taskId, newStartDate, newEndDate) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.title === taskId
          ? {
              ...task,
              startDate: newStartDate.toISOString(),
              endDate: newEndDate.toISOString(),
            }
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
    e.stopPropagation();
    const startX = e.clientX;
    const task = tasks.find((t) => t.title === taskId);
    const originalStart = new Date(task.startDate);
    const originalEnd = new Date(task.endDate);

    const onMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      const daysDiff = Math.round(diff / 32);
      const newStartDate = addDays(originalStart, daysDiff);

      if (newStartDate < originalEnd) {
        handleTaskUpdate(taskId, newStartDate, originalEnd);
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
    e.stopPropagation();
    const startX = e.clientX;
    const task = tasks.find((t) => t.title === taskId);
    const originalStart = new Date(task.startDate);
    const originalEnd = new Date(task.endDate);

    const onMouseMove = (moveEvent) => {
      const diff = moveEvent.clientX - startX;
      const daysDiff = Math.round(diff / 32);
      const newEndDate = addDays(originalEnd, daysDiff);

      if (newEndDate > originalStart) {
        handleTaskUpdate(taskId, originalStart, newEndDate);
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
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

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
        <div className="flex flex-1 overflow-hidden justify-center">
          {/* Task List */}
          <div className="w-1/4 flex flex-col">
            <h2 className="text-lg font-semibold p-1">Tasks</h2>
            <div className="flex-1 overflow-y-auto">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.title}
                    className="py-1 shadow-sm text-sm h-8 flex items-center px-1 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                    style={{
                      borderLeft: `4px solid ${teamColors[task.assignedTeam]}`,
                    }}
                  >
                    {task.title}
                  </div>
                ))
              ) : (
                <div className="py-1 text-sm h-8 flex items-center px-1 text-gray-500">
                  No tasks this month
                </div>
              )}
            </div>
          </div>

          {/* Calendar */}
          <div className="flex-1 flex flex-col border-l border-gray-500 overflow-auto">
            {/* Days Header */}
            <div className="flex min-w-max border-b border-gray-100 bg-gray-50 mb-5">
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
              <div className="relative min-w-max">
                {filteredTasks.map((task, index) => {
                  if (!task.startDate || !task.endDate) return null;

                  const start = new Date(task.startDate);
                  const end = new Date(task.endDate);

                  const startDay = Math.round(
                    (start - startOfMonth) / (1000 * 60 * 60 * 24)
                  );
                  const endDay = Math.round(
                    (end - startOfMonth) / (1000 * 60 * 60 * 24)
                  );

                  const leftOffset = Math.max(0, startDay * 32);
                  const taskWidth = (endDay - startDay + 1) * 32;

                  return (
                    <div
                      key={task.title}
                      className="text-white text-xs rounded-md z-10 opacity-80 flex items-center justify-between hover:opacity-100 hover:shadow-md transition-all duration-200 group cursor-pointer"
                      style={{
                        position: "absolute",
                        left: `${leftOffset}px`,
                        width: `${taskWidth}px`,
                        height: "24px",
                        top: `${index * 32 + 2}px`,
                        backgroundColor: teamColors[task.assignedTeam],
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div
                        className="w-2 h-full cursor-w-resize hover:bg-white/20 group-hover:bg-white/10 transition-colors"
                        onMouseDown={(e) => handleResizeStart(task.title, e)}
                      />
                      <div className="flex-1 text-center truncate px-1">
                        {task.title}
                      </div>
                      <div
                        className="w-2 h-full cursor-e-resize hover:bg-white/20 group-hover:bg-white/10 transition-colors"
                        onMouseDown={(e) => handleResizeEnd(task.title, e)}
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
