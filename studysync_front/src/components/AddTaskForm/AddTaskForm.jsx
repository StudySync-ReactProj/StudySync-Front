// src/components/AddTaskForm/AddTaskForm.jsx
import React, { useState } from 'react';
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
  Alert,
  useTheme
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AvailabilityModal from '../AvailabilityModal/AvailabilityModal';

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
  SchedulingInnerSx,
  SaveButtonSx,
  CancelButtonSx,
  SchedulingSwitchSx,
  DueDateFieldSx,
  MatchingOutlinedBorderSx
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
  actionLoading,
  isEditMode = false
}) => {
  const theme = useTheme();
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);

  // Ensure priority is always lowercase to match MenuItem values
  const normalizedPriority = newTaskPriority.toLowerCase();

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

  const handleStartFieldClick = () => {
    if (Number(newTaskEstimatedMinutes) > 0) {
      setAvailabilityModalOpen(true);
    }
  };

  const handleSlotSelect = (datetimeLocalValue) => {
    setNewTaskScheduledStart(datetimeLocalValue);
    setAvailabilityModalOpen(false);
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
              value={normalizedPriority}
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
            sx={DueDateFieldSx(theme)}
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
              control={<Switch checked={newTaskSchedulingEnabled} onChange={(e) => setNewTaskSchedulingEnabled(e.target.checked)} sx={SchedulingSwitchSx(theme)} />}
              label="Schedule this task in calendar"
            />

            {newTaskSchedulingEnabled && (
              <Stack spacing={1} sx={SchedulingInnerSx}>
                <TextField
                  label="Start"
                  type="datetime-local"
                  value={newTaskScheduledStart}
                  onClick={handleStartFieldClick}
                  onChange={(e) => setNewTaskScheduledStart(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={StartFieldSx}
                  placeholder="Click to select available slot"
                />

                {/* Live preview */}
                {renderPreview()}
              </Stack>
            )}
          </Box>
        )}

        <Stack direction={ButtonsRowStack.direction} spacing={ButtonsRowStack.spacing} sx={ButtonsSx}>
          <Button variant="contained" onClick={onSave} disabled={actionLoading} sx={SaveButtonSx(theme)}>
            {actionLoading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Task' : 'Save Task')}
          </Button>
          <Button variant="outlined" onClick={onCancel} disabled={actionLoading} sx={CancelButtonSx(theme)}>
            Cancel
          </Button>
        </Stack>
      </Stack>

      {/* Availability Modal */}
      <AvailabilityModal
        open={availabilityModalOpen}
        onClose={() => setAvailabilityModalOpen(false)}
        selectedDate={newTaskDueDate}
        estimatedMinutes={Number(newTaskEstimatedMinutes) || 0}
        onSlotSelect={handleSlotSelect}
      />
    </Box>
  );
};

export default AddTaskForm;
