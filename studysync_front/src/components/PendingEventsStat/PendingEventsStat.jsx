// Component that shows in dashboard the number of pending events for the user
import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

const PendingEventsStat = ({ events = [], currentUser }) => {
    // Calculate pending count - events waiting for user's RSVP
    const pendingCount = events.filter(event =>
        event.participants?.some(
            p => p.email === currentUser?.email && p.status?.toLowerCase() === 'pending'
        )
    ).length;

    // Don't render if no pending invitations
    if (pendingCount === 0) return null;

    return (
        <Tooltip 
            title="Events waiting for your RSVP response." 
            arrow
            placement="bottom"
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
                <Typography sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1.1rem' }}>
                    {pendingCount}
                </Typography>
                <Typography sx={{ fontWeight: 'normal', color: 'text.primary', fontSize: '1.1rem' }}>
                    Pending Events
                </Typography>
            </Box>
        </Tooltip>
    );
};

export default PendingEventsStat;
