// src/pages/TasksPage/TasksPage.jsx

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// Import async thunks from your slice
import { fetchTasks, addTaskAsync, deleteTaskAsync, updateTaskStatus } from "../../store/tasksSlice";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import TasksList from "../../components/TasksList/TasksList.jsx";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm.jsx";
import { Button, Box, CircularProgress, Alert } from "@mui/material";

const TasksPage = () => {
  const dispatch = useDispatch();

  // Get tasks and status from Redux store
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  // Local state for UI toggles and form inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // ========== FETCH TASKS ON MOUNT ==========
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // ========== HANDLERS ==========

 const handleAddTask = () => {
  if (newTaskText.trim()) {
    const taskData = {
      title: newTaskText,
      // Ensure values match the backend Enum exactly
      priority: newTaskPriority.charAt(0).toUpperCase() + newTaskPriority.slice(1).toLowerCase(), 
      dueDate: newTaskDueDate || new Date().toISOString(),
      status: 'Not Started' // Matches backend Enum exactly
    };

    dispatch(addTaskAsync(taskData));
    setNewTaskText("");
    setShowAddForm(false);
  }
};

  const handleDeleteTask = (taskId) => {
    // taskId here is the MongoDB _id
    dispatch(deleteTaskAsync(taskId));
  };

  const handleStatusChange = (taskId, newStatus) => {
    // Dispatch the updateTaskStatus async thunk with MongoDB _id and new status
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  // ========== RENDER LOGIC ==========

  return (
    <Wrapper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <MainTitle title="My Tasks" />
        <Button
          variant="contained"
          color={showAddForm ? "secondary" : "primary"}
          onClick={handleToggleAddForm}
        >
          {showAddForm ? "Cancel" : "Add New Task"}
        </Button>
      </Box>

      {/* Show Error Alert if fetch fails */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Render Add Task Form */}
      {showAddForm && (
        <Box sx={{ mb: 4 }}>
          <AddTaskForm
            newTaskText={newTaskText}
            setNewTaskText={setNewTaskText}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            newTaskDueDate={newTaskDueDate}
            setNewTaskDueDate={setNewTaskDueDate}
            onSave={handleAddTask}
          />
        </Box>
      )}

      {/* Show Loading Spinner or Task List */}
      <div id="tasks--list">
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TasksList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default TasksPage;