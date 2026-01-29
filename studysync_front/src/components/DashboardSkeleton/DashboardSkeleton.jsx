import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { CardContainer } from '../CardContainer/CardContainer.style';

/**
 * DashboardSkeleton - Loading state for dashboard
 * Displays skeleton screens while data is being fetched
 */
const DashboardSkeleton = () => {
  return (
    <CardContainer>
      {/* Timer Box */}
      <Box sx={{ gridArea: 'time' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
      
      {/* Tasks Box */}
      <Box sx={{ gridArea: 'tasks' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
      
      {/* Daily Progress */}
      <Box sx={{ gridArea: 'daily' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
      
      {/* Weekly Progress */}
      <Box sx={{ gridArea: 'weekly' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
      
      {/* Deadlines */}
      <Box sx={{ gridArea: 'deadlines' }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
      </Box>
    </CardContainer>
  );
};

export default DashboardSkeleton;
