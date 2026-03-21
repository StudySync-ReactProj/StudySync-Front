import React from "react";
import { useApi } from "../../hooks/useApi";
import { useSelector } from "react-redux";

// Components
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import WelcomeHeader from "../../components/WelcomeHeader/WelcomeHeader.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";
import DashboardSkeleton from "../../components/DashboardSkeleton/DashboardSkeleton.jsx";
import DashboardError from "../../components/DashboardError/DashboardError.jsx";
import PendingEventsStat from '../../components/PendingEventsStat/PendingEventsStat';
import { Box } from "@mui/material"; // הוספתי Box מ-MUI כדי שנוכל לעשות רווח קטן
import { styles } from './Dashboard.style';

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const username = user?.username || "User";

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

  // 2. הוספנו פה שליפה של האירועים מהשרת (וודאי שהנתיב /api/events תואם לשרת שלך)
  const {
    data: events,
    loading: eventsLoading,
  } = useApi(`${API_BASE_URL}/api/events`, {
    initialData: [] // נותן מערך ריק כברירת מחדל עד שיגיעו הנתונים
  });

  // 3. הוספנו את eventsLoading למצב הטעינה המשולב
  const isLoading = statsLoading || progressLoading || eventsLoading;

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
        <PendingEventsStat events={events} currentUser={user} />
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