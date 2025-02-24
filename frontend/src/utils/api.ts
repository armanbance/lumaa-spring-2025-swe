import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const registerUser = async (username: string, password: string) => {
  const response = await api.post("/auth/register", { username, password });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const createTask = async (task: {
  title: string;
  description?: string;
}) => {
  console.log("CREATING TASK", task);
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const response = await api.post("/tasks", task, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const updateTask = async (task: {
  id: string;
  title: string;
  isComplete?: boolean;
}) => {
  const response = await api.put(`/tasks/${task.id}`, task);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const completeTask = async (id: string) => {
  const response = await api.patch(`/tasks/${id}/complete`);
  return response.data;
};
