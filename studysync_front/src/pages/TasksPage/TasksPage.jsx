// src/pages/TasksPage/TasksPage.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, toggleTask, deleteTask, updateTaskStatus } from "../../store/tasksSlice";
import TasksList from "../../components/TasksList/TasksList.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import { Box, Button, TextField, Stack, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTaskForm from "../../components/AddTaskForm/AddTaskForm.jsx";

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
          <AddTaskForm
            newTaskText={newTaskText}
            setNewTaskText={setNewTaskText}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            newTaskDueDate={newTaskDueDate}
            setNewTaskDueDate={setNewTaskDueDate}
            onSave={handleAddTask}
            onCancel={() => setShowAddForm(false)}
          />
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
