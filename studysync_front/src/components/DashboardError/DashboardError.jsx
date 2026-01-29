import React from 'react';
import { Box, Alert, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

/**
 * DashboardError - Error state for dashboard
 * @param {string} message - Error message to display
 * @param {function} onRetry - Callback to retry fetching data
 */
const DashboardError = ({ message, onRetry }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )
        }
      >
        {message || 'Failed to load dashboard data. Please try again.'}
      </Alert>
    </Box>
  );
};

export default DashboardError;
