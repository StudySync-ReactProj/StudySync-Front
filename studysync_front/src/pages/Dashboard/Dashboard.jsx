import React, { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/eventsSlice";

// Components
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import WelcomeHeader from "../../components/WelcomeHeader/WelcomeHeader.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";
import DashboardSkeleton from "../../components/DashboardSkeleton/DashboardSkeleton.jsx";
import DashboardError from "../../components/DashboardError/DashboardError.jsx";
import PendingEventsStat from '../../components/PendingEventsStat/PendingEventsStat';
import { Box, CircularProgress } from "@mui/material"; // הוספתי Box מ-MUI כדי שנוכל לעשות רווח קטן
import { styles } from './Dashboard.style';

// Use environment variable, fallback to same-origin API path
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const username = user?.username || "User";
  const events = useSelector((state) => state.events.events || []);
  const reduxEventsLoading = useSelector((state) => state.events.loading ?? state.events.isLoading);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  console.log('Dashboard Events Data:', events);

  // Fetch dashboard statistics (tasks, deadlines)
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApi(`${API_BASE_URL}/api/stats`);

  // Fetch weekly progress data
  const {
    data: progressData,
    loading: progressLoading,
    error: _progressError,
    refetch: refetchProgress,
  } = useApi(`${API_BASE_URL}/api/progress/weekly`, {
    skip: false,
    initialData: { weekly: [] }
  });

  const eventsStatusLoading = reduxEventsLoading;
  const safeEvents = Array.isArray(events) ? events : [];

  // 3. הוספנו את eventsLoading למצב הטעינה המשולב
  const isLoading = statsLoading || progressLoading;

  // Only show error if stats fails (progress is optional)
  const hasError = statsError;
  const errorMessage = statsError;

  // Retry function for error state
  const handleRetry = () => {
    refetchStats();
    refetchProgress();
    // (אפשר גם להוסיף כאן ריפרש לאירועים אם יש לך פונקציית refetchEvents)
  };

  return (
    <Wrapper>
      {/* Header with Pending Invitations on same line */}
      <Box sx={styles.headerRow}>
        <WelcomeHeader username={username} />
        {eventsStatusLoading ? (
          <CircularProgress size={24} />
        ) : (
          <PendingEventsStat events={safeEvents} currentUser={user} />
        )}
      </Box>

      {/* Loading State */}
      {isLoading && <DashboardSkeleton />}

      {/* Error State */}
      {!isLoading && hasError && (
        <DashboardError message={errorMessage} onRetry={handleRetry} />
      )}

      {/* Success State - Render Dashboard Cards */}
      {!isLoading && !hasError && (
        <CardContainerComp
          stats={stats}
          progressData={progressData}
          onRefreshProgress={refetchProgress}
        />
      )}
    </Wrapper>
  );
};

export default Dashboard;