import React, { useState, useEffect } from "react";
import "./TodoApp.css"; // Create this CSS file for styling

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from local storage
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [error, setError] = useState("");

  // Save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!taskInput.trim()) {
      setError("Task description cannot be empty.");
      return;
    }

    if (isEditing) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId ? { ...task, description: taskInput } : task
        )
      );
      setIsEditing(false);
      setEditTaskId(null);
    } else {
      const newTask = {
        id: Date.now(),
        description: taskInput,
        completed: false,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    setTaskInput("");
    setError("");
  };

  const handleEditTask = (id, description) => {
    setTaskInput(description);
    setIsEditing(true);
    setEditTaskId(id);
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="todo-app">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={handleAddTask}>
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span
              onClick={() => handleToggleComplete(task.id)}
              className="task-desc"
            >
              {task.description}
            </span>
            <button onClick={() => handleEditTask(task.id, task.description)}>
              Edit
            </button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TodoApp;
