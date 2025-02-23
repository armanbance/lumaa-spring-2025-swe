import express, { Request, Response } from "express";

const app = express();

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
  console.log(`Server is running on http://localhost:${port}`);
});
