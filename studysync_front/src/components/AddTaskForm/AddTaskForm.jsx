// src/components/AddTaskForm/AddTaskForm.jsx
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
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {
  AddTaskFormContainer,
  PriorityFormControl,
  RowStack,
  ButtonsRowStack,
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
}) => {
  // Helper to format preview
  const renderPreview = () => {
    if (!newTaskSchedulingEnabled || !newTaskScheduledStart || !newTaskEstimatedMinutes) return null;
    const start = new Date(newTaskScheduledStart);
    const end = new Date(start.getTime() + (Number(newTaskEstimatedMinutes) || 0) * 60000);
    return (
      <div style={{ color: '#555' }}>
        This task will block: {start.toLocaleString()} - {end.toLocaleString()}
      </div>
    );
  };

  return (
    <Box sx={AddTaskFormContainer}>
      <Stack spacing={2}>
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
          InputProps={{ startAdornment: <AccessTimeIcon sx={{ mr: 1 }} /> }}
        />

        {/* Show scheduling section only when estimatedMinutes > 0 */}
        {Number(newTaskEstimatedMinutes) > 0 && (
          <Box sx={{ border: '1px dashed #e0e0e0', p: 2, borderRadius: 1 }}>
            <FormControlLabel
              control={<Switch checked={newTaskSchedulingEnabled} onChange={(e) => setNewTaskSchedulingEnabled(e.target.checked)} />}
              label="Schedule this task in calendar"
            />

            {newTaskSchedulingEnabled && (
              <Stack spacing={1} sx={{ mt: 1 }}>
                <TextField
                  label="Start"
                  type="datetime-local"
                  value={newTaskScheduledStart}
                  onChange={(e) => setNewTaskScheduledStart(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />

                {/* Live preview */}
                {renderPreview()}
              </Stack>
            )}
          </Box>
        )}

        <Stack direction={ButtonsRowStack.direction} spacing={ButtonsRowStack.spacing}>
          <Button variant="contained" onClick={onSave}>
            Save Task
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddTaskForm;
