import React from "react";
import { Paper, Typography, Box, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { enUS } from "date-fns/locale";
import { isSameDay, format } from "date-fns";

const CalendarSidebar = ({ currentDate, onDateChange, events = [], onConnectGoogle }) => {
    // Filter events for the selected day and sort by start time (earliest to latest)
    const todayEvents = events
        .filter((event) => isSameDay(event.start, currentDate))
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    
    return (
        <Paper
            elevation={3}
            sx={{
                width: 320,
                flexShrink: 0,
                // height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.paper",
                borderRight: 1,
                borderColor: "divider"
            }}
        >
            {/* Header */}
            {/* <Box sx={{ p: 2 }}> */}
            {/* Google Calendar Connection */}
            <Box sx={{ p: 2, textAlign: 'center' }}>
                {/* <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Sync your events with Google
                </Typography> */}
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={onConnectGoogle}
                    sx={(theme) => ({
                        textTransform: 'none',
                        borderRadius: '8px',
                        borderColor: theme.palette.mode === 'dark' ? '#CFCBFF' : '#6D63FF',
                        color: theme.palette.mode === 'dark' ? '#CFCBFF' : '#6D63FF',
                        '&:hover': {
                            borderColor: theme.palette.mode === 'dark' ? '#CFCBFF' : '#6D63FF',
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129, 199, 132, 0.08)' : 'rgba(66, 133, 244, 0.04)',
                        },
                        fontWeight: 'bold'
                    })}
                >
                    Connect Google Calendar
                </Button>
            </Box>
            {/* </Box> */}
            <Divider />

            {/* Mini calendar */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                <DateCalendar
                    value={currentDate} // Displays the date from parent
                    onChange={onDateChange}
                />
            </LocalizationProvider>

            <Divider />

            {/* Dynamic event list */}
            <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
                <Typography variant="caption" color="primary" fontWeight="bold">
                    {format(currentDate, "dd MMMM yyyy", { locale: enUS })}
                </Typography>

                <List>
                    {todayEvents.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            No events for this day!
                        </Typography>
                    ) : (
                        todayEvents.map((event) => (
                            <ListItem key={event.event_id} disablePadding sx={{ mb: 2 }}>
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <>
                                            {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                                            {event.location && ` | ${event.location}`}
                                        </>
                                    }
                                    primaryTypographyProps={{ fontWeight: "bold", fontSize: "0.85rem" }}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>

            <Divider />


        </Paper>
    );
};

export default CalendarSidebar;