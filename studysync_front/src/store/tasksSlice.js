import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  filter: 'all', // 'all', 'active', 'completed'
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      console.log('➕ ADD TASK ACTION:', action.payload);
      const newTask = {
        id: Date.now(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority || 'medium',
        dueDate: action.payload.dueDate || null,
        createdAt: new Date().toISOString(),
        ...action.payload
      };
      state.tasks.push(newTask);
      console.log('✅ Task added. Total tasks:', state.tasks.length);
    },
    
    deleteTask: (state, action) => {
      console.log('🗑️ DELETE TASK ACTION:', action.payload);
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      console.log('✅ Task deleted. Remaining tasks:', state.tasks.length);
    },
    
    updateTaskStatus: (state, action) => {
      console.log('🔄 UPDATE TASK STATUS ACTION:', action.payload);
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        // Auto-set completed based on status
        task.completed = action.payload.status === 'Completed';
        console.log('✅ Task status updated:', task);
      }
    },
    
    toggleTask: (state, action) => {
      console.log('🔀 TOGGLE TASK ACTION:', action.payload);
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        console.log('✅ Task toggled. New status:', task.completed);
      }
    },
    
    updateTask: (state, action) => {
      console.log('✏️ UPDATE TASK ACTION:', action.payload);
      const task = state.tasks.find(task => task.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.updates);
        console.log('✅ Task updated:', task);
      }
    },
    
    setFilter: (state, action) => {
      console.log('🔍 SET FILTER ACTION:', action.payload);
      state.filter = action.payload;
      console.log('✅ Filter set to:', state.filter);
    },
    
    clearCompleted: (state) => {
      console.log('🧹 CLEAR COMPLETED TASKS ACTION');
      const beforeCount = state.tasks.length;
      state.tasks = state.tasks.filter(task => !task.completed);
      console.log(`✅ Cleared ${beforeCount - state.tasks.length} completed tasks`);
    },
  },
});

export const { 
  addTask, 
  deleteTask, 
  updateTaskStatus, 
  toggleTask, 
  updateTask, 
  setFilter, 
  clearCompleted 
} = tasksSlice.actions;

export default tasksSlice.reducer;
