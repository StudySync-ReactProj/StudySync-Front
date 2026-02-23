// src/components/CalendarMain/EmptyStateOverlay.jsx

/**
 * =============================================================================
 * EMPTY STATE OVERLAY COMPONENT
 * =============================================================================
 * 
 * This component is displayed when there are no events to show in the calendar.
 * 
 * =============================================================================
 */

import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * EmptyStateOverlay Component
 * Displays a centered overlay when no events exist
 * Appears on top of the calendar grid
 */
const EmptyStateOverlay = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 3,
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        minWidth: '300px'
      }}
    >
      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
        Your schedule is clear for now!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Start by creating a meeting poll or syncing your calendar.
      </Typography>
    </Box>
  );
};

export default EmptyStateOverlay;
