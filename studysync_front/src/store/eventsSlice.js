// src/store/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosConfig';
import { getSafeId } from '../utils/idUtils';

// Fetch all events
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (_, thunkAPI) => {
    try {
        const response = await API.get('/events');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
});

// Create new event (happens after pressing Submit in the CreateEventModal)
export const createEventAsync = createAsyncThunk('events/createEvent', async (eventData, thunkAPI) => {
    try {
        const response = await API.post('/events', eventData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Fetch Google Calendar events
// If the user has Google connected, we get their events. 
// If not, we get an empty array and just show local events.

export const fetchGoogleCalendarEvents = createAsyncThunk(
    'events/fetchGoogleCalendarEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/google-calendar/events');

            return response.data;
        } catch (error) {
            // If any error occurs, return empty array to prevent app crashes so users can still view and manage their local events
            return [];
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState: { events: [], isLoading: false, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.isLoading = true;
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loading = false;
                if (Array.isArray(action.payload)) {
                    state.events = action.payload;
                } else if (Array.isArray(action.payload?.events)) {
                    state.events = action.payload.events;
                } else {
                    state.events = [];
                }
                state.error = null;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.isLoading = false;
                state.loading = false;
                state.error = action.payload || 'Failed to fetch events';
            })
            .addCase(createEventAsync.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(updateEventAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateEventAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // finds the old event in the state by matching id and replaces it with the updated event from the server
                const index = state.events.findIndex(event =>
                    String(getSafeId(event)) === String(getSafeId(action.payload))
                );
                // If event is found, update it in the state
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(updateEventAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchGoogleCalendarEvents.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGoogleCalendarEvents.fulfilled, (state, action) => {
                state.isLoading = false;

                // Remove old Google events before adding new ones to prevent duplicates
                const nonGoogleEvents = state.events.filter(event => event.source !== 'google');
                // If action.payload is empty array, user doesn't have Google connected - that's ok!
                state.events = [...nonGoogleEvents, ...action.payload];
            })
            .addCase(fetchGoogleCalendarEvents.rejected, (state, action) => {
                state.isLoading = false;
                // No error state for Google Calendar failures so users without Google can still use the app
            })
            .addCase(deleteEventAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteEventAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // Filter out the deleted event by id
                state.events = state.events.filter(event =>
                    String(getSafeId(event)) !== String(action.payload)
                );
            })
            .addCase(deleteEventAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });


    },
});
/*  
    Update existing event
    we extract the event ID from eventData and send the update request to the server. 
    The server will return the updated event, which we then use to update our Redux state and reflect changes in the UI. 
*/
export const updateEventAsync = createAsyncThunk('events/updateEvent', async (eventData, thunkAPI) => {
    try {
        const eventId = getSafeId(eventData);
        if (!eventId) {
            return thunkAPI.rejectWithValue('Missing event ID for update');
        }
        const updateUrl = `/events/${eventId}`;
        const response = await API.put(updateUrl, eventData);
        return response.data; // the updated event
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

// Delete event
export const deleteEventAsync = createAsyncThunk('events/deleteEvent', async (eventId, thunkAPI) => {
    try {
        const normalizedEventId = getSafeId(eventId);

        if (!normalizedEventId) {
            return thunkAPI.rejectWithValue('Missing event ID for delete');
        }

        const deleteUrl = `/events/${normalizedEventId}`;
        await API.delete(deleteUrl);
        return normalizedEventId;
    } catch (error) {
        const failedDeleteId = getSafeId(eventId);
        const failedDeleteUrl = failedDeleteId ? `/events/${failedDeleteId}` : '/events/undefined';
        console.error('Delete request failed URL:', `${API.defaults.baseURL}${failedDeleteUrl}`);
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export default eventsSlice.reducer;