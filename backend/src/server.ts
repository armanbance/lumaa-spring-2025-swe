import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Client } from "pg";

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL successfully!"))
  .catch((err: any) => console.error("Connection error", err))
  .finally(() => client.end());

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const PORT = process.env.PORT || 3000;

interface User {
  id: string;
  username: string;
  password: string;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  userId?: string;
}

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

let tasks: Task[] = [];
let users: User[] = [];

app.post("/auth/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully" });

  console.log(users);
});

app.post("/auth/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/tasks", (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (userId) {
    const userTasks = tasks.filter((task) => task.userId === userId);
    res.json(userTasks);
  } else {
    res.json(tasks);
  }
});

app.post("/tasks", (req: Request, res: Response) => {
  const { text, userId } = req.body;
  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    userId,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const task = tasks.find((task) => task.id === id);
  if (task) {
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    res.json(task);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
