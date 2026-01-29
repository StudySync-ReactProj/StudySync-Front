// src/pages/TasksPage/TasksPage.jsx

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import API from "../../api/axiosConfig";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import TasksList from "../../components/TasksList/TasksList.jsx";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm.jsx";
import { Button, Box, CircularProgress, Alert } from "@mui/material";

const TasksPage = () => {
  // ========== DATA FETCHING WITH useApi HOOK ==========
  const { data: tasks, loading, error, refetch } = useApi('/tasks');

  // Local state for UI toggles and form inputs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // ========== HANDLERS ==========

  const handleAddTask = async () => {
    if (newTaskText.trim()) {
      const taskData = {
        title: newTaskText,
        priority: newTaskPriority.charAt(0).toUpperCase() + newTaskPriority.slice(1).toLowerCase(), 
        dueDate: newTaskDueDate || new Date().toISOString(),
        status: 'Not Started'
      };

      setActionLoading(true);
      setActionError(null);

      try {
        await API.post('/tasks', taskData);
        setNewTaskText("");
        setShowAddForm(false);
        // Refetch tasks to get updated list
        refetch();
      } catch (err) {
        setActionError(err.response?.data?.message || "Failed to add task");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    setActionLoading(true);
    setActionError(null);

    try {
      await API.delete(`/tasks/${taskId}`);
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete task");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setActionLoading(true);
    setActionError(null);

    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      refetch();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update task");
    } finally {
      setActionLoading(false);
    }
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
          disabled={actionLoading}
        >
          {showAddForm ? "Cancel" : "Add New Task"}
        </Button>
      </Box>

      {/* Show Error Alert if fetch fails */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

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
            tasks={tasks || []}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </Wrapper>
  );
};

export default TasksPage;