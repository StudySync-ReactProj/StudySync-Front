// src/store/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosConfig';

// Fetch all tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const response = await API.get('/tasks');
    return response.data; // MongoDB returns an array of objects with _id
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Add Task - CRITICAL: Ensure we send 'title'
export const addTaskAsync = createAsyncThunk('tasks/addTask', async (taskData, thunkAPI) => {
  try {
    const response = await API.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Delete Task - CRITICAL: Use id for the URL
export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async (id, thunkAPI) => {
  try {
    await API.delete(`/tasks/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Update Task Status
export const updateTaskStatus = createAsyncThunk('tasks/updateTaskStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await API.put(`/tasks/${id}`, { status });
    return response.data; // Returns updated task
  } catch (error) {
    console.error('Error updating task status:', error.response || error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export default tasksSlice.reducer;