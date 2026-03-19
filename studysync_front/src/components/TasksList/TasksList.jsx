import * as React from 'react';
import { Box, Typography, IconButton, Stack, Select, MenuItem, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { TasksWrapper, StyledTaskCard, PriorityBadge } from './TasksList.style.js';
import {
  titleTypographySx,
  metaRowSx,
  smallIconSx,
  formControlSx,
  selectSx,
  dueStackSx,
  taskCardInnerSx,
  deleteButtonSx
} from './TasksList.style.js';

// Individual Task Item Component
function TaskItem({ task, onStatusChange, onDeleteTask, onEditTask }) {
  // Check if task is completed based on status from backend
  const isCompleted = task.status === 'Completed';

  const renderScheduled = () => {
    if (!task.scheduledStart || !task.scheduledEnd) return null;
    const start = new Date(task.scheduledStart);
    const end = new Date(task.scheduledEnd);
    return (
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ...metaRowSx }}>
        <EventIcon sx={smallIconSx} />
        <Typography variant="caption">{start.toLocaleString()} - {end.toLocaleTimeString()}</Typography>
      </Stack>
    );
  };

  const renderEstimated = () => {
    if (!task.estimatedMinutes) return null;
    return (
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ ...metaRowSx }}>
        <AccessTimeIcon sx={smallIconSx} />
        <Typography variant="caption">{task.estimatedMinutes} min</Typography>
      </Stack>
    );
  };

  return (
    <StyledTaskCard elevation={0}>
      <Stack direction="row" spacing={2} alignItems="center" sx={taskCardInnerSx}>
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="subtitle1"
                sx={titleTypographySx(isCompleted)}
              >
                {task.title}
              </Typography>
              <PriorityBadge priority={task.priority}>
                {task.priority}
              </PriorityBadge>
            </Stack>

            <Stack direction="row" spacing={2} sx={metaRowSx} alignItems="center">
              <Stack direction="row" spacing={0.5} alignItems="center" sx={dueStackSx}>
                <CalendarTodayIcon sx={smallIconSx} />
                <Typography variant="caption">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </Typography>
              </Stack>

              {/* Estimated time and scheduled info */}
              {renderEstimated()}
              {renderScheduled()}

              <Typography variant="caption">•</Typography>
              <FormControl size="small" sx={formControlSx}>
                <Select
                  value={task.status || 'Not Started'}
                  onChange={(e) => onStatusChange(task._id || task.id, e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEditTask?.(task)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDeleteTask(task._id || task.id)}
            sx={deleteButtonSx}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </StyledTaskCard>
  );
}

// Main Task List Component
export default function MobileStyleTaskList({ tasks = [], onStatusChange, onDeleteTask, onEditTask }) {

  // Safe mapping - only map if tasks exist
  const rows = tasks.map(task => ({
    ...task,
    _id: task._id || task.id,
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
          onStatusChange={onStatusChange}
          onDeleteTask={() => onDeleteTask?.(row._id)}
          onEditTask={onEditTask}
        />
      ))}
    </TasksWrapper>
  );
}