const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

const tasksFile = path.join(__dirname, "tasks.json");
app.use(express.json());

// Middleware for input validation
const validateTask = (req, res, next) => {
    const { title, status } = req.body;
    if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required and must be a string" });
    }
    if (status && !["pending", "in-progress", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }
    next();
};

// Read tasks from file
const readTasks = () => {
    if (!fs.existsSync(tasksFile)) return [];
    return JSON.parse(fs.readFileSync(tasksFile, "utf-8"));
};

// Write tasks to file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

app.get("/", (req, res) => {
    res.send("Welcome to the Task Manager API all tasks on /tasks you can CRUD with Postman API.");
});

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(readTasks());
});

// Get task by ID
app.get("/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    task ? res.json(task) : res.status(404).json({ error: "Task not found" });
});

// Create a new task
app.post("/tasks", validateTask, (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title: req.body.title,
        status: req.body.status || "pending"
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
});

// Update a task
app.put("/tasks/:id", validateTask, (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    let tasks = readTasks();
    const filteredTasks = tasks.filter(t => t.id !== parseInt(req.params.id));
    if (tasks.length === filteredTasks.length) {
        return res.status(404).json({ error: "Task not found" });
    }
    writeTasks(filteredTasks);
    res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}\ntasks on : http://localhost:${PORT}/tasks`));