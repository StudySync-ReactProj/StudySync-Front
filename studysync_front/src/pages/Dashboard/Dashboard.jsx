import React from "react";
import { useApi } from "../../hooks/useApi";
import { useUser } from "../../context/UserContext";

// Components
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import WelcomeHeader from "../../components/WelcomeHeader/WelcomeHeader.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";
import DashboardSkeleton from "../../components/DashboardSkeleton/DashboardSkeleton.jsx";
import DashboardError from "../../components/DashboardError/DashboardError.jsx";

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Dashboard - Smart Container Component
 * 
 * Responsibilities:
 * - Fetch all dashboard data (stats, progress)
 * - Manage loading and error states
 * - Pass data down to presentation components
 * - Centralize user context access
 */
const Dashboard = () => {
  // Get user from centralized context (eliminates duplicate fetching)
  const { username } = useUser();

  // Fetch dashboard statistics (tasks, deadlines)
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApi(`${API_BASE_URL}/api/stats`);

  // Fetch weekly progress data (skip if endpoint doesn't exist)
  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useApi(`${API_BASE_URL}/api/progress/weekly`, {
    skip: false,
    initialData: { weekly: [], dailyGoalMinutes: 60 }
  });

  // Combined loading state
  const isLoading = statsLoading || progressLoading;

  // Only show error if stats fails (progress is optional)
  const hasError = statsError;
  const errorMessage = statsError;

  // Retry function for error state
  const handleRetry = () => {
    refetchStats();
    refetchProgress();
  };

  return (
    <Wrapper>
      <WelcomeHeader username={username} />

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
