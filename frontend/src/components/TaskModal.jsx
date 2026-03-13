import { useState } from "react";
import { X, Trash2, Save, Loader2, AlignLeft, Flag } from "lucide-react";
import api from "../lib/axios";

const TaskModal = ({ task, onClose, onTaskUpdated, onTaskDeleted }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority || "medium",
    status: task.status,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.patch(`/tasks/${task._id}`, formData);
      onTaskUpdated(response.data.data.task);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      onTaskDeleted(task._id);
      onClose();
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  const priorityColors = {
    low: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400",
    medium:
      "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400",
    high: "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <Flag className="w-4 h-4 text-slate-400 dark:text-slate-500" />{" "}
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium ${priorityColors[formData.priority]}`}
              >
                <option
                  value="low"
                  className="text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200"
                >
                  Low Priority
                </option>
                <option
                  value="medium"
                  className="text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200"
                >
                  Medium Priority
                </option>
                <option
                  value="high"
                  className="text-slate-700 bg-white dark:bg-slate-800 dark:text-slate-200"
                >
                  High Priority
                </option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-700 dark:text-slate-200"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              <AlignLeft className="w-4 h-4 text-slate-400 dark:text-slate-500" />{" "}
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows="4"
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-700 dark:text-slate-200 resize-none"
            ></textarea>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}{" "}
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
