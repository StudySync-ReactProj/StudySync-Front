import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tasksReducer from './tasksSlice';
import eventsReducer from './eventsSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('studySyncState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('studySyncState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// Load persisted state
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    events: eventsReducer,
  },
  preloadedState: persistedState,
});

// Save to localStorage whenever state changes
store.subscribe(() => {
  saveState(store.getState());
});
