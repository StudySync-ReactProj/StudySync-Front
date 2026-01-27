// src/store/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosConfig';

// Fetch all events
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
    try {
        const response = await API.get('/events'); // Needs to match your backend route
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Create new event (The Submit from your Modal)
export const createEventAsync = createAsyncThunk('events/createEvent', async (eventData, thunkAPI) => {
    try {
        const response = await API.post('/events', eventData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const eventsSlice = createSlice({
    name: 'events',
    initialState: { events: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => { state.loading = true; })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(createEventAsync.fulfilled, (state, action) => {
                state.events.push(action.payload);
            });
    },
});

export default eventsSlice.reducer;