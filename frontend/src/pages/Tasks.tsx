import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/tasks"); // Redirect if not logged in
      return;
    }

    // TODO: Fetch tasks from backend API
    console.log("Fetching tasks...");
    setTasks([
      {
        id: 1,
        title: "Example Task",
        description: "This is a test",
        isComplete: false,
      },
    ]);
  }, [navigate]);

  const addTask = () => {
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      { id: tasks.length + 1, title: newTask, isComplete: false },
    ]);
    setNewTask("");
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Task"
          className="border p-2 rounded-md"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add
        </button>
      </div>
      <ul className="w-96">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 shadow-md rounded-md mb-2 flex justify-between items-center"
          >
            <span className={task.isComplete ? "line-through" : ""}>
              {task.title}
            </span>
            <button
              onClick={() => toggleComplete(task.id)}
              className={`px-4 py-2 rounded-md ${
                task.isComplete ? "bg-gray-500" : "bg-blue-500 text-white"
              }`}
            >
              {task.isComplete ? "Undo" : "Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
