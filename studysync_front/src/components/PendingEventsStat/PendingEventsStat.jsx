// Component that shows in dashboard the number of pending events for the user
import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styles as pendingStyles } from './PendingEventsStat.style';

const PendingEventsStat = ({ events = [], currentUser }) => {
    const now = new Date();

    const pendingCount = (Array.isArray(events) ? events : [])
        .filter((event) => {
            const eventStartRaw = event.startDateTime || event.start;
            if (!eventStartRaw) return false;

            const eventStartDate = new Date(eventStartRaw);
            if (Number.isNaN(eventStartDate.getTime())) return false;

            return eventStartDate >= now;
        })
        .filter((event) =>
            event.participants?.some(
                (participant) =>
                    participant.email === currentUser?.email &&
                    participant.status?.toLowerCase() === 'pending'
            )
        )
        .length;

    return (
        <Tooltip
            title="Events waiting for your RSVP response."
            arrow
            placement="bottom"
        >
            <Box sx={pendingStyles.container}>
                <Typography sx={pendingStyles.countText}>
                    {pendingCount}
                </Typography>
                <Typography sx={pendingStyles.labelText}>
                    Pending Events
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default PendingEventsStat;
