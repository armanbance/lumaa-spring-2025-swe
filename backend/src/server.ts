import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Pool } from "pg";
import { Client } from "pg";
import { query } from "./utils/db";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL successfully!"))
  .catch((err: any) => console.error("Connection error", err));

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

app.post("/auth/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password: hashedPassword,
  };
  try {
    await query(
      "INSERT INTO users (id, username, password) VALUES ($1, $2, $3)",
      [newUser.id, newUser.username, newUser.password]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error saving user to database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/auth/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const result = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];
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
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/tasks", async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  try {
    let result;
    if (userId) {
      result = await query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
    } else {
      result = await query("SELECT * FROM tasks");
    }
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/tasks", async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  //   jwt.verify(token, process.env.JWT_SECRET!, (err, decodedUser) => {
  //     if (err) {
  //       res.status(403).json({ message: "Token is not valid" });
  //     }
  //   });
  try {
    const result = await query(
      "INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving task to database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const result = await query(
      "UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description) WHERE id = $3 RETURNING *",
      [title, description, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query("DELETE FROM tasks WHERE id = $1 RETURNING *", [
      id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
