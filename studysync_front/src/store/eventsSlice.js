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
            return response.data;
        } catch (error) {
            // אם המשתמש לא מחובר לגוגל, השרת יחזיר שגיאה - נתעלם ממנה בשקט
            if (error.response?.status === 401) {
                return [];
            }
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

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
            })
            .addCase(fetchGoogleCalendarEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGoogleCalendarEvents.fulfilled, (state, action) => {
                state.loading = false;
                console.log('Google Data in Slice:', action.payload);
                
                // Remove old Google events before adding new ones to prevent duplicates
                const nonGoogleEvents = state.events.filter(event => event.source !== 'google');
                state.events = [...nonGoogleEvents, ...action.payload];
            })
            .addCase(fetchGoogleCalendarEvents.rejected, (state, action) => {
                state.loading = false;
                if (!action.payload?.includes('not connected')) {
                    state.error = action.payload;
                    console.error('Failed to fetch Google events:', action.payload);
                }
            });
    },
});
export default eventsSlice.reducer;