import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const fetchTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTask = async (task: { title: string }) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

export const registerUser = async (username: string, password: string) => {
  const response = await api.post("/auth/register", { username, password });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};
