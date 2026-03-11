// src/components/AddTaskForm/AddTaskForm.jsx
import React from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Alert
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {
  AddTaskFormContainer,
  PriorityFormControl,
  RowStack,
  ButtonsRowStack,
  SchedulingBox,
  PreviewText,
  AccessTimeIconSx,
  ButtonsSx,
  StartFieldSx,
  SchedulingInnerSx
} from "./AddTaskForm.style.js";

const AddTaskForm = ({
  newTaskText,
  setNewTaskText,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  onSave,
  onCancel,
  // New props for scheduling
  newTaskEstimatedMinutes,
  setNewTaskEstimatedMinutes,
  newTaskSchedulingEnabled,
  setNewTaskSchedulingEnabled,
  newTaskScheduledStart,
  setNewTaskScheduledStart,
  actionError,
  actionLoading
}) => {
  // Helper to format preview
  const renderPreview = () => {
    if (!newTaskSchedulingEnabled || !newTaskScheduledStart || !newTaskEstimatedMinutes) return null;
    const start = new Date(newTaskScheduledStart);
    const end = new Date(start.getTime() + (Number(newTaskEstimatedMinutes) || 0) * 60000);
    return (
      <Box sx={PreviewText}>
        This task will block: {start.toLocaleString()} - {end.toLocaleString()}
      </Box>
    );
  };

  return (
    <Box sx={AddTaskFormContainer}>
      <Stack spacing={2}>
        {actionError && <Alert severity="error">{actionError}</Alert>}

        <TextField
          label="Task Name"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          fullWidth
          size="small"
        />

        <Stack direction={RowStack.direction} spacing={RowStack.spacing}>
          <FormControl size="small" sx={PriorityFormControl}>
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

        {/* Estimated time input */}
        <TextField
          label="Estimated time (minutes)"
          type="number"
          value={newTaskEstimatedMinutes}
          onChange={(e) => setNewTaskEstimatedMinutes(e.target.value)}
          size="small"
          InputProps={{ startAdornment: <AccessTimeIcon sx={AccessTimeIconSx} /> }}
        />

        {/* Show scheduling section only when estimatedMinutes > 0 */}
        {Number(newTaskEstimatedMinutes) > 0 && (
          <Box sx={SchedulingBox}>
            <FormControlLabel
              control={<Switch checked={newTaskSchedulingEnabled} onChange={(e) => setNewTaskSchedulingEnabled(e.target.checked)} />}
              label="Schedule this task in calendar"
            />

            {newTaskSchedulingEnabled && (
              <Stack spacing={1} sx={SchedulingInnerSx}>
                <TextField
                  label="Start"
                  type="datetime-local"
                  value={newTaskScheduledStart}
                  onChange={(e) => setNewTaskScheduledStart(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={StartFieldSx}
                />

                {/* Live preview */}
                {renderPreview()}
              </Stack>
            )}
          </Box>
        )}

        <Stack direction={ButtonsRowStack.direction} spacing={ButtonsRowStack.spacing} sx={ButtonsSx}>
          <Button variant="contained" onClick={onSave} disabled={actionLoading}>
            {actionLoading ? 'Saving...' : 'Save Task'}
          </Button>
          <Button variant="outlined" onClick={onCancel} disabled={actionLoading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddTaskForm;
