import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, createTask, updateTask, deleteTask } from "../utils/api";

interface Task {
  id: string;
  title: string;
  description?: string;
  isComplete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    fetchTasks()
      .then(setTasks)
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [navigate]);

  const addTask = async () => {
    if (newTaskTitle.trim() === "") return;

    try {
      const newTask = await createTask({
        title: newTaskTitle,
        description: newTaskDescription || "",
      });
      setTasks([
        ...tasks,
        { ...newTask, description: newTaskDescription || "" },
      ]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const updatedTask = await updateTask({
        id,
        title: task.title,
        isComplete: !task.isComplete,
      });
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleEditTask = async () => {
    if (!editingTask) return;

    try {
      const updatedTask = await updateTask(editingTask);
      setTasks(tasks.map((t) => (t.id === editingTask.id ? updatedTask : t)));
      setEditingTask(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.isComplete;
    if (filter === "incomplete") return !task.isComplete;
    return true; // "all"
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      {/* Task input */}
      <div className="mb-4 flex flex-col w-96">
        <input
          type="text"
          placeholder="Task Title"
          className="border p-2 rounded-md mb-2"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description (Optional)"
          className="border p-2 rounded-md mb-2"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add Task
        </button>
      </div>

      {/* Filter buttons */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-md ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-md ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={`px-4 py-2 rounded-md ${
            filter === "incomplete" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Incomplete
        </button>
      </div>

      {/* Task list */}
      <ul className="w-96">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 shadow-md rounded-md mb-2 flex justify-between items-center"
          >
            {editingTask?.id === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="border p-2 text-black rounded-md"
                />
                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 text-black rounded-md mt-2"
                  placeholder="Task Description"
                />
                <button
                  onClick={handleEditTask}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <div>
                  <span
                    className={`text-black ${
                      task.isComplete ? "line-through" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md mr-2"
                  >
                    {task.isComplete ? "Undo" : "Complete"}
                  </button>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
