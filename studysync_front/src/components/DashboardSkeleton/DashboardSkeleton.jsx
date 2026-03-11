import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { CardContainer } from '../CardContainer/CardContainer.style';
import { styles } from './DashboardSkeleton.style';

/**
 * DashboardSkeleton - Loading state for dashboard
 * Displays skeleton screens while data is being fetched
 */
const DashboardSkeleton = () => {
  return (
    <CardContainer>
      {/* Timer Box */}
      <Box sx={styles.gridAreaBox('time')}>
        <Skeleton variant="rectangular" height={200} sx={styles.skeletonSx} />
      </Box>

      {/* Tasks Box */}
      <Box sx={styles.gridAreaBox('tasks')}>
        <Skeleton variant="rectangular" height={200} sx={styles.skeletonSx} />
      </Box>

      {/* Daily Progress */}
      <Box sx={styles.gridAreaBox('daily')}>
        <Skeleton variant="rectangular" height={200} sx={styles.skeletonSx} />
      </Box>

      {/* Weekly Progress */}
      <Box sx={styles.gridAreaBox('weekly')}>
        <Skeleton variant="rectangular" height={200} sx={styles.skeletonSx} />
      </Box>

      {/* Deadlines */}
      <Box sx={styles.gridAreaBox('deadlines')}>
        <Skeleton variant="rectangular" height={200} sx={styles.skeletonSx} />
      </Box>
    </CardContainer>
  );
};

export default DashboardSkeleton;
