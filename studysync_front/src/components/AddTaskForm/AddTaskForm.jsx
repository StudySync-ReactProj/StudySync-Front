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
} from "@mui/material";

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
}) => {
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
