import * as React from 'react';
import { Box, Typography, IconButton, Stack, Select, MenuItem, FormControl } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { TasksWrapper, StyledTaskCard, PriorityBadge } from './TasksList.style.js';

function TaskItem({ task, onToggleComplete, onStatusChange, onDeleteTask }) {
  return (
    <StyledTaskCard elevation={0}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" width="100%">
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>

          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.6 : 1
                }}
              >
                {task.text || task.taskName}
              </Typography>
              <PriorityBadge priority={task.priority}>
                {task.priority}
              </PriorityBadge>
            </Stack>
            
            <Stack direction="row" spacing={2} sx={{ mt: 0.5, color: 'text.secondary' }} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{task.dueDate}</Typography>
              </Stack>
              <Typography variant="caption">•</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={task.status || 'Not Started'}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  sx={{ 
                    fontSize: '0.75rem',
                    height: '24px',
                    '& .MuiSelect-select': { py: 0 }
                  }}
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Stack>
        
        <IconButton 
          size="small" 
          color="error"
          onClick={() => onDeleteTask(task.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </StyledTaskCard>
  );
}

export default function MobileStyleTaskList({ tasks = [], onToggleTask, onStatusChange, onDeleteTask }) {
  const rows = tasks.map(task => ({
    id: task.id,
    text: task.text,
    taskName: task.taskName || task.text,
    priority: task.priority,
    dueDate: task.dueDate,
    status: task.status,
    completed: task.completed || false,
  }));

  const handleToggleComplete = (taskId) => {
    if (onToggleTask) {
      onToggleTask(taskId);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(taskId, newStatus);
    }
  };

  const handleDelete = (taskId) => {
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  if (rows.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#64748B' }}>
        <Typography variant="h6">No tasks yet</Typography>
        <Typography variant="body2">Click "Add Task" to create your first task!</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TasksWrapper>
        {rows.map((row) => (
          <TaskItem 
            key={row.id} 
            task={row} 
            onToggleComplete={handleToggleComplete}
            onStatusChange={handleStatusChange}
            onDeleteTask={handleDelete}
          />
        ))}
      </TasksWrapper>
    </Box>
  );
}