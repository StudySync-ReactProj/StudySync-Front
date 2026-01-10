import * as React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { TasksWrapper, StyledTaskCard, PriorityBadge } from './TasksList.style.js';
import tasksData from '../../data/tasksData.json';

function TaskItem({ task, onToggleComplete }) {
  return (
    <StyledTaskCard elevation={0}>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconButton 
          size="small" 
          color="primary"
          onClick={() => onToggleComplete(task.id)}
        >
          {task.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
        </IconButton>

        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1E293B" }}>
              {task.taskName}
            </Typography>
            <PriorityBadge priority={task.priority}>
              {task.priority}
            </PriorityBadge>
          </Stack>
          
          <Stack direction="row" spacing={2} sx={{ mt: 0.5, color: "#64748B" }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{task.dueDate}</Typography>
            </Stack>
            <Typography variant="caption">• {task.status}</Typography>
          </Stack>
        </Box>
      </Stack>
    </StyledTaskCard>
  );
}

export default function MobileStyleTaskList() {
  const [completedTasks, setCompletedTasks] = React.useState({});

  const rows = tasksData.tasks.map(task => ({
    id: task.id,
    taskName: task.task,
    priority: task.priority,
    dueDate: task.dueDate,
    status: task.status,
    completed: completedTasks[task.id] || false,
  }));

  const handleToggleComplete = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <Box>
      <TasksWrapper>
        {rows.map((row) => (
          <TaskItem key={row.id} task={row} onToggleComplete={handleToggleComplete} />
        ))}
      </TasksWrapper>
    </Box>
  );
}