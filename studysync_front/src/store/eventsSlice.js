// src/store/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosConfig';

// Fetch all events
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
    try {
        const response = await API.get('/events');
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

// Fetch Google Calendar events
export const fetchGoogleCalendarEvents = createAsyncThunk(
    'events/fetchGoogleCalendarEvents',
    async (_, { rejectWithValue }) => {
        try {
            // שימוש ב-API המוגדר שלך כדי להנות מהגדרות ה-Axios הקיימות
            const response = await API.get('/google-calendar/events');
            // Backend now returns empty array if Google not connected instead of 401
            // This allows the app to work seamlessly with local events only
            return response.data;
        } catch (error) {
            // If any error occurs, return empty array to prevent app crashes
            // Users can still view and manage their local events
            console.log('ℹ️  Google Calendar fetch skipped or failed - continuing with local events only');
            return [];
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState: { events: [], isLoading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => { 
                state.isLoading = true; 
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createEventAsync.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(fetchGoogleCalendarEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGoogleCalendarEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log('Google Data in Slice:', action.payload);
                
                // Remove old Google events before adding new ones to prevent duplicates
                const nonGoogleEvents = state.events.filter(event => event.source !== 'google');
                // If action.payload is empty array, user doesn't have Google connected - that's ok!
                state.events = [...nonGoogleEvents, ...action.payload];
            })
            .addCase(fetchGoogleCalendarEvents.rejected, (state, action) => {
                state.isLoading = false;
                // Don't set error state for Google Calendar failures
                // App should continue working with local events
                console.log('ℹ️  Google Calendar sync skipped - local events remain available');
            })
            .addCase(deleteEventAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteEventAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // Filter out the deleted event using _id or id (database field)
                state.events = state.events.filter(event => 
                    (event._id || event.id) !== action.payload
                );
            })
            .addCase(deleteEventAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

// Delete event
export const deleteEventAsync = createAsyncThunk('events/deleteEvent', async (eventId, thunkAPI) => {
    try {
        await API.delete(`/events/${eventId}`);
        return eventId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export default eventsSlice.reducer;