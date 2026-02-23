// src/components/CalendarMain/LoadingOverlay.jsx

/**
 * =============================================================================
 * LOADING OVERLAY COMPONENT
 * =============================================================================
 * 
 * A presentational component that displays a loading state for the calendar.
 * 
 * Features:
 * - Centered circular progress spinner (Material UI)
 * - Customizable loading message
 * - Consistent loading UX across the application
 * - Minimum height ensures proper visibility
 * 
 * Props:
 * * @param {string} message - Optional loading message to display
 * 
 * Purpose: Provides a reusable loading state component that can be used
 * anywhere in the application where calendar data is being fetched.
 * Improves UX by giving users visual feedback during async operations.
 * =============================================================================
 */

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingOverlay = ({ message = "Loading events..." }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: 2
      }}
    >
      <CircularProgress size={50} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;
