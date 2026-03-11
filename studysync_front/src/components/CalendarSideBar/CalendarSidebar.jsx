import React from "react";
import { Paper, Typography, Box, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { enUS } from "date-fns/locale";
import { isSameDay, format } from "date-fns";

import { styles as sidebarStyles } from './CalendarSidebar.style';

const CalendarSidebar = ({ currentDate, onDateChange, events = [], onConnectGoogle }) => {
    // Filter events for the selected day and sort by start time (earliest to latest)
    const todayEvents = events
        .filter((event) => isSameDay(event.start, currentDate))
        .sort((a, b) => new Date(a.start) - new Date(b.start));

    return (
        <Paper elevation={3} sx={sidebarStyles.paperContainer}>
            <Box sx={sidebarStyles.headerBox}>
                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<GoogleIcon />}
                    onClick={onConnectGoogle}
                    sx={sidebarStyles.connectButtonSx}
                >
                    Connect Google Calendar
                </Button>
            </Box>

            <Divider />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                <DateCalendar
                    value={currentDate} // Displays the date from parent
                    onChange={onDateChange}
                />
            </LocalizationProvider>

            <Divider />

            <Box sx={sidebarStyles.eventsBox}>
                <Typography variant="caption" sx={sidebarStyles.dateTitleTypography}>
                    {format(currentDate, "dd MMMM yyyy", { locale: enUS })}
                </Typography>

                <List>
                    {todayEvents.length === 0 ? (
                        <Typography variant="body2" sx={sidebarStyles.noEventsText}>
                            No events for this day!
                        </Typography>
                    ) : (
                        todayEvents.map((event) => (
                            <ListItem key={event.event_id} disablePadding sx={sidebarStyles.listItemSx}>
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <>
                                            {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                                            {event.location && ` | ${event.location}`}
                                        </>
                                    }
                                    primaryTypographyProps={sidebarStyles.primaryTypographyProps}
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