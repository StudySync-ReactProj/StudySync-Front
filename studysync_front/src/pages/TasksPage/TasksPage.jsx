// src/pages/TasksPage/TasksPage.jsx

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import API from "../../api/axiosConfig";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import TasksList from "../../components/TasksList/TasksList.jsx";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm.jsx";
import { Button, Box, CircularProgress, Alert } from "@mui/material";
import { styles } from './TasksPage.style';

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

  // New fields for scheduling
  const [newTaskEstimatedMinutes, setNewTaskEstimatedMinutes] = useState(0);
  const [newTaskSchedulingEnabled, setNewTaskSchedulingEnabled] = useState(false);
  const [newTaskScheduledStart, setNewTaskScheduledStart] = useState("");

  // ========== HANDLERS ==========

  const handleAddTask = async () => {
    if (!newTaskText.trim()) return;

    // If scheduling enabled, ensure a start is provided
    if (newTaskSchedulingEnabled && !newTaskScheduledStart) {
      setActionError('Please choose a start date and time for scheduling.');
      return;
    }

    const taskData = {
      title: newTaskText,
      priority: newTaskPriority.charAt(0).toUpperCase() + newTaskPriority.slice(1).toLowerCase(),
      dueDate: newTaskDueDate || new Date().toISOString(),
      status: 'Not Started',
      estimatedMinutes: Number(newTaskEstimatedMinutes) || 0,
    };

    if (newTaskSchedulingEnabled) {
      // Convert local datetime-local to ISO string and compute scheduledEnd using estimatedMinutes
      const startIso = new Date(newTaskScheduledStart).toISOString();
      taskData.scheduledStart = startIso;

      const est = Number(newTaskEstimatedMinutes) || 0;
      if (est > 0) {
        const end = new Date(new Date(startIso).getTime() + est * 60000);
        taskData.scheduledEnd = end.toISOString();
      }
    }

    setActionLoading(true);
    setActionError(null);

    try {
      await API.post('/tasks', taskData);
      // Reset form
      setNewTaskText("");
      setNewTaskPriority("Medium");
      setNewTaskDueDate("");
      setShowAddForm(false);
      setNewTaskEstimatedMinutes(0);
      setNewTaskSchedulingEnabled(false);
      setNewTaskScheduledStart("");

      // Refetch tasks to get updated list
      await refetch();

      // Notify CalendarSync to refresh its data (so scheduled tasks appear immediately)
      window.dispatchEvent(new CustomEvent('studySync:tasksUpdated'));
    } catch (err) {
      if (err?.response?.status === 409) {
        setActionError('This time slot is already occupied. Please choose another time.');
      } else {
        setActionError(err.response?.data?.message || "Failed to add task");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setActionLoading(true);
    setActionError(null);

    try {
      await API.delete(`/tasks/${taskId}`);
      await refetch();
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
      // If marking as completed manually, tell backend no timer used
      if (newStatus === 'Completed') {
        await API.put(`/tasks/${taskId}`, { status: newStatus, completedWithTimer: false });
      } else {
        await API.put(`/tasks/${taskId}`, { status: newStatus });
      }

      await refetch();

      // Also notify calendar to refresh (in case task scheduling changed)
      window.dispatchEvent(new CustomEvent('studySync:tasksUpdated'));
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
      <Box sx={styles.headerContainer}>
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
      {error && <Alert severity="error" sx={styles.alertMargin}>{error}</Alert>}
      {actionError && <Alert severity="error" sx={styles.alertMargin}>{actionError}</Alert>}

      {/* Render Add Task Form */}
      {showAddForm && (
        <Box sx={styles.addFormWrapper}>
          <AddTaskForm
            newTaskText={newTaskText}
            setNewTaskText={setNewTaskText}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            newTaskDueDate={newTaskDueDate}
            setNewTaskDueDate={setNewTaskDueDate}
            onSave={handleAddTask}
            onCancel={() => setShowAddForm(false)}
            newTaskEstimatedMinutes={newTaskEstimatedMinutes}
            setNewTaskEstimatedMinutes={setNewTaskEstimatedMinutes}
            newTaskSchedulingEnabled={newTaskSchedulingEnabled}
            setNewTaskSchedulingEnabled={setNewTaskSchedulingEnabled}
            newTaskScheduledStart={newTaskScheduledStart}
            setNewTaskScheduledStart={setNewTaskScheduledStart}
            actionError={actionError}
            actionLoading={actionLoading}
          />
        </Box>
      )}

      {/* Show Loading Spinner or Task List */}
      <div id="tasks--list">
        {loading ? (
          <Box sx={styles.spinnerBox}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={styles.tasksListContainer}>
            <TasksList
              tasks={tasks || []}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
            />
          </Box>
        )}
      </div>
    </Wrapper>
  );
};

export default TasksPage;