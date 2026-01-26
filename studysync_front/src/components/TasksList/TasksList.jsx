import * as React from 'react';
import { Box, Typography, IconButton, Stack, Select, MenuItem, FormControl } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { TasksWrapper, StyledTaskCard, PriorityBadge } from './TasksList.style.js';

// Individual Task Item Component
function TaskItem({ task, onToggleComplete, onStatusChange, onDeleteTask }) {
  // Check if task is completed based on status from backend
  const isCompleted = task.status === 'Completed';

  return (
    <StyledTaskCard elevation={0}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" width="100%">
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onToggleComplete(task._id)} // Using MongoDB _id
          >
            {isCompleted ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>

          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                  opacity: isCompleted ? 0.6 : 1
                }}
              >
                {/* Use 'title' from your backend model */}
                {task.title}
              </Typography>
              <PriorityBadge priority={task.priority}>
                {task.priority}
              </PriorityBadge>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 0.5, color: 'text.secondary' }} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </Typography>
              </Stack>
              <Typography variant="caption">•</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={task.status || 'Not Started'}
                  onChange={(e) => onStatusChange(task._id, e.target.value)} // Using MongoDB _id
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
          onClick={() => onDeleteTask(task._id)} // Using MongoDB _id
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    </StyledTaskCard>
  );
}

// Main Task List Component
export default function MobileStyleTaskList({ tasks = [], onToggleTask, onStatusChange, onDeleteTask }) {
  
  // Safe mapping - only map if tasks exist
  const rows = tasks.map(task => ({
    _id: task._id, 
    title: task.title, 
    priority: task.priority || 'Low',
    dueDate: task.dueDate,
    status: task.status || 'Not Started',
  }));

  return (
    <TasksWrapper>
      {rows.map((row) => (
        <TaskItem 
          key={row._id} // Using the MongoDB unique ID
          task={row} 
          onToggleComplete={() => onToggleTask?.(row._id)} 
          onStatusChange={(newStatus) => onStatusChange?.(row._id, newStatus)}
          onDeleteTask={() => onDeleteTask?.(row._id)} 
        />
      ))}
    </TasksWrapper>
  );
}