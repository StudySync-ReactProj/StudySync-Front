// src/components/CalendarMain/EmptyStateOverlay.jsx

/**
 * =============================================================================
 * EMPTY STATE OVERLAY COMPONENT
 * =============================================================================
 * 
 * A presentational component that displays a friendly message when the
 * calendar has no events to show.
 * 
 * Features:
 * - Positioned absolutely over the calendar grid (doesn't hide the grid)
 * - Semi-transparent white background with shadow for depth
 * - Friendly emoji and helpful message to guide users
 * - Encourages user action (create meeting poll or sync calendar)
 * 
 * Props: None - this is a static presentational component
 * 
 * Purpose: Improves UX by providing guidance when the calendar is empty,
 * while still maintaining visibility of the calendar grid itself.
 * Follows Material Design principles for empty states.
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
        🗓️ Your schedule is clear for today!
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Start by creating a meeting poll or syncing your calendar.
      </Typography>
    </Box>
  );
};

export default EmptyStateOverlay;
