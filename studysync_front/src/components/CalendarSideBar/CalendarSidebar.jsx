import React from "react";
import { Paper, Typography, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { enUS } from "date-fns/locale";
import { isSameDay, format } from "date-fns";

const CalendarSidebar = ({ currentDate, onDateChange, events = [] }) => {
    const todayEvents = events.filter((event) =>
        isSameDay(event.start, currentDate)
    );
    return (
        <Paper
            elevation={3}
            sx={{
                width: 320,
                flexShrink: 0,
                // height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "white",
                borderRight: "1px solid #e0e0e0"
            }}
        >
            {/* כותרת */}
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontWeight="bold">Sync Up</Typography>
            </Box>
            <Divider />

            {/* מיני לוח שנה */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                <DateCalendar
                    value={currentDate} // המהות: מציג את התאריך מהאבא
                    onChange={onDateChange}
                />
            </LocalizationProvider>

            <Divider />

            {/* רשימת אירועים (כרגע סטטית - רק לעיצוב) */}
            {/* רשימת האירועים הדינמית */}
            <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
                <Typography variant="caption" color="primary" fontWeight="bold">
                    {format(currentDate, "dd MMMM yyyy", { locale: enUS })} {/* תאריך יפה בכותרת */}
                </Typography>

                <List>
                    {todayEvents.length === 0 ? (
                        // מה מציגים כשאין כלום?
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                           No events for this day!
                        </Typography>
                    ) : (
                        // מה מציגים כשיש אירועים?
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
                                    primaryTypographyProps={{ fontWeight: "bold", fontSize: "0.9rem" }}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Box>
        </Paper>
    );
};

export default CalendarSidebar;