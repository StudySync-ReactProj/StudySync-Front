// src/pages/TasksPage/TasksPage.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, toggleTask, deleteTask, updateTaskStatus } from "../../store/tasksSlice";
import TasksList from "../../components/TasksList/TasksList.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import { Box, Button, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const TasksPage = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      dispatch(addTask({
        text: newTaskText,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
        status: 'Not Started'
      }));
      setNewTaskText("");
      setNewTaskPriority("medium");
      setNewTaskDueDate("");
      setShowAddForm(false);
    }
  };

  const handleToggleTask = (taskId) => {
    dispatch(toggleTask(taskId));
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <>
      <Wrapper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <MainTitle title="My Tasks" />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddForm(!showAddForm)}
            sx={{ height: 'fit-content' }}
          >
            Add Task
          </Button>
        </Box>

        {showAddForm && (
          <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Task Name"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTaskPriority}
                    label="Priority"
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="critical">Critical</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Due Date"
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleAddTask}>
                  Save Task
                </Button>
                <Button variant="outlined" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <div id="tasks--list">
          <TasksList
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </Wrapper>
    </>
  );
};

export default TasksPage;
