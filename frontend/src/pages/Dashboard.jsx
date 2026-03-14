import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import {
  LogOut,
  Plus,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Circle,
  Moon,
  Sun,
  Briefcase,
} from "lucide-react";
import { io } from "socket.io-client";
import TaskModal from "../components/TaskModal";

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "")
  : "http://localhost:5000";

const socket = io(SOCKET_URL, { withCredentials: true });

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("Personal");

  useEffect(() => {
    socket.emit("join_workspace", "demo_workspace");
    socket.on("update_board", (data) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === data.taskId ? { ...task, status: data.newStatus } : task,
        ),
      );
    });
    return () => socket.off("update_board");
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data.data.tasks);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await api.post("/tasks", {
        title: newTaskTitle,
        status: "todo",
        priority: "medium",
        workspace: activeWorkspace,
      });
      setTasks([...tasks, response.data.data.task]);
      setNewTaskTitle("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragStart = (e, taskId) =>
    e.dataTransfer.setData("taskId", taskId);

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const originalTasks = [...tasks];
    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
    socket.emit("task_moved", {
      workspaceId: "demo_workspace",
      taskId,
      newStatus,
    });

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (error) {
      setTasks(originalTasks);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const getTasksByStatus = (status) =>
    tasks.filter(
      (task) =>
        task.status === status &&
        (task.workspace || "Personal") === activeWorkspace,
    );

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 flex flex-col font-sans">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-lg">
              <LayoutDashboard className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
              TaskFlow Pro
            </h1>

            <div className="ml-4 flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-700">
              <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2" />
              <select
                value={activeWorkspace}
                onChange={(e) => setActiveWorkspace(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option
                  value="Personal"
                  className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  Personal Board
                </option>
                <option
                  value="Work"
                  className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                >
                  Work Board
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:block border-l border-slate-200 dark:border-slate-700 pl-4">
              {user?.name || "User"}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-auto snap-x snap-mandatory">
          <div className="mb-8 max-w-md">
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={`Add task to ${activeWorkspace}...`}
                className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </form>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40 text-slate-400 dark:text-slate-500">
              Loading your board...
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6 items-start w-full">
              <div
                onDrop={(e) => handleDrop(e, "todo")}
                onDragOver={handleDragOver}
                className="w-full md:w-80 flex-shrink-0 snap-center bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[200px] transition-colors"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                    To Do
                  </h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs py-0.5 px-2 rounded-full ml-auto">
                    {getTasksByStatus("todo").length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus("todo").map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-grab active:cursor-grabbing group relative"
                    >
                      {task.priority === "high" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                      {task.priority === "medium" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                      {task.priority === "low" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 pr-4">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                onDrop={(e) => handleDrop(e, "in-progress")}
                onDragOver={handleDragOver}
                className="w-full md:w-80 flex-shrink-0 snap-center bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[200px] transition-colors"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                    In Progress
                  </h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs py-0.5 px-2 rounded-full ml-auto">
                    {getTasksByStatus("in-progress").length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus("in-progress").map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900/30 border-l-4 border-l-blue-500 transition-colors cursor-grab active:cursor-grabbing group relative"
                    >
                      {task.priority === "high" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                      {task.priority === "medium" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                      {task.priority === "low" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 pr-4">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                onDrop={(e) => handleDrop(e, "done")}
                onDragOver={handleDragOver}
                className="w-full md:w-80 flex-shrink-0 snap-center bg-slate-100/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 min-h-[200px] transition-colors"
              >
                <div className="flex items-center gap-2 mb-4 px-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                    Done
                  </h3>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs py-0.5 px-2 rounded-full ml-auto">
                    {getTasksByStatus("done").length}
                  </span>
                </div>
                <div className="space-y-3">
                  {getTasksByStatus("done").map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-900/30 border-l-4 border-l-emerald-500 opacity-70 transition-colors cursor-grab active:cursor-grabbing group relative"
                    >
                      {task.priority === "high" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                      {task.priority === "medium" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                      {task.priority === "low" && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 line-through pr-4">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 line-through">
                          {task.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskUpdated={(updatedTask) =>
              setTasks(
                tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
              )
            }
            onTaskDeleted={(deletedTaskId) =>
              setTasks(tasks.filter((t) => t._id !== deletedTaskId))
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
