// src/pages/TasksPage/TasksPage.jsx

import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../context/NotificationContext.jsx";
import API from "../../api/axiosConfig";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import TasksList from "../../components/TasksList/TasksList.jsx";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm.jsx";
import { Button, Box, CircularProgress, Alert, useTheme } from "@mui/material";
import { styles, topActionButtonSx } from './TasksPage.style';

const TasksPage = () => {
  const theme = useTheme();

  // ========== DATA FETCHING WITH useApi HOOK ==========
  const { data: tasks, loading, error, refetch } = useApi('/tasks');
  const { showNotification } = useNotification();

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
  const [editingTaskId, setEditingTaskId] = useState(null);

  // ========== HANDLERS ==========

  const formatForDateInput = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().split('T')[0];
  };

  const formatForDateTimeLocalInput = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    const localDate = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const resetTaskForm = () => {
    setNewTaskText("");
    setNewTaskPriority("Medium");
    setNewTaskDueDate("");
    setNewTaskEstimatedMinutes(0);
    setNewTaskSchedulingEnabled(false);
    setNewTaskScheduledStart("");
    setEditingTaskId(null);
    setShowAddForm(false);
  };

  const handleEditTask = (task) => {
    if (!task) return;

    const taskId = task._id || task.id;
    setNewTaskText(task.title || "");
    setNewTaskPriority((task.priority || "Medium").toLowerCase());
    setNewTaskDueDate(formatForDateInput(task.dueDate));
    setNewTaskEstimatedMinutes(Number(task.estimatedMinutes) || 0);
    setNewTaskScheduledStart(formatForDateTimeLocalInput(task.scheduledStart));
    setNewTaskSchedulingEnabled(Boolean(task.scheduledStart && task.scheduledEnd));
    setEditingTaskId(taskId || null);
    setActionError(null);
    setShowAddForm(true);
  };

  const handleSaveTask = async () => {
    if (!newTaskText.trim()) return;

    // If scheduling enabled, ensure a start is provided
    if (newTaskSchedulingEnabled && !newTaskScheduledStart) {
      setActionError('Please choose a start date and time for scheduling.');
      showNotification({
        severity: 'warning',
        title: 'Missing data',
        message: 'Please choose a start date and time for scheduling.',
      });
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
      if (editingTaskId) {
        await API.put(`/tasks/${editingTaskId}`, taskData);
        showNotification({
          severity: 'success',
          title: 'Task updated',
          message: 'The task was updated successfully.',
        });
      } else {
        await API.post('/tasks', taskData);
        showNotification({
          severity: 'success',
          title: 'Task created',
          message: 'The task was created successfully.',
        });
      }

      resetTaskForm();

      // Refetch tasks to get updated list
      await refetch();

      // Notify CalendarSync to refresh its data (so scheduled tasks appear immediately)
      window.dispatchEvent(new CustomEvent('studySync:tasksUpdated'));
    } catch (err) {
      let errorMessage = "Failed to save task";
      if (err?.response?.status === 409) {
        errorMessage = 'This time slot is already occupied. Please choose another time.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setActionError(errorMessage);
      showNotification({
        severity: 'error',
        title: 'Save failed',
        message: errorMessage,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setActionLoading(true);
    setActionError(null);

    try {
      await API.delete(`/tasks/${taskId}`);
      showNotification({
        severity: 'success',
        title: 'Task deleted',
        message: 'The task was deleted successfully.',
      });
      await refetch();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete task";
      setActionError(errorMessage);
      showNotification({
        severity: 'error',
        title: 'Delete failed',
        message: errorMessage,
      });
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

      showNotification({
        severity: 'success',
        title: 'Task updated',
        message: `Task status updated to ${newStatus}.`,
      });

      await refetch();

      // Also notify calendar to refresh (in case task scheduling changed)
      window.dispatchEvent(new CustomEvent('studySync:tasksUpdated'));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update task";
      setActionError(errorMessage);
      showNotification({
        severity: 'error',
        title: 'Update failed',
        message: errorMessage,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAddForm = () => {
    if (showAddForm) {
      resetTaskForm();
      return;
    }
    setActionError(null);
    setShowAddForm(true);
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
          sx={topActionButtonSx(theme)}
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
            onSave={handleSaveTask}
            onCancel={resetTaskForm}
            newTaskEstimatedMinutes={newTaskEstimatedMinutes}
            setNewTaskEstimatedMinutes={setNewTaskEstimatedMinutes}
            newTaskSchedulingEnabled={newTaskSchedulingEnabled}
            setNewTaskSchedulingEnabled={setNewTaskSchedulingEnabled}
            newTaskScheduledStart={newTaskScheduledStart}
            setNewTaskScheduledStart={setNewTaskScheduledStart}
            actionError={actionError}
            actionLoading={actionLoading}
            isEditMode={!!editingTaskId}
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
              onEditTask={handleEditTask}
            />
          </Box>
        )}
      </div>
    </Wrapper>
  );
};

export default TasksPage;