import React, { useEffect, useMemo, useState } from "react";
import {
  CardContainer,
  TimeBox,
  TasksBox,
  DailyBox,
  WeeklyBox,
  DeadlinesBox,
  CardHeading,
  CardList,
  ErrorText,
  GoalRow,
  GoalLabel,
  GoalInput,
  GoalButton,
  GoalHint,
} from "./CardContainer.style";

import Card from "../Card/Card";
import Timer from "../Timer/Timer";
import DailyProgress from "../DailyProgress/DailyProgress";
import WeeklyProgress from "../WeeklyProgress/WeeklyProgress";

import { useApi } from "../../hooks/useApi";
import API from "../../api/axiosConfig";

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CardContainerComp = () => {
  // ---- STATS (tasks + deadlines) ----
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useApi(`${API_BASE_URL}/api/stats`);

  // ---- PROGRESS (goal + last 7 days) ----
  const {
    data: progressRes,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useApi(`${API_BASE_URL}/api/progress/weekly`);

  // Safe fallbacks (avoid crash on first render)
  const todayTasks = stats?.tasks ?? [];
  const upcomingDeadlines = stats?.upcomingDeadlines ?? [];

  const weeklyData = progressRes?.weekly ?? [];
  const serverGoal = Number(progressRes?.dailyGoalMinutes ?? 60);

  // Goal input state (smooth typing)
  const [goalInput, setGoalInput] = useState(serverGoal);

  // Sync when server returns updated goal
  useEffect(() => {
    setGoalInput(serverGoal);
  }, [serverGoal]);

  // Use last day in weekly array as "today"
  const todayProgress = weeklyData?.[weeklyData.length - 1];

  // Compute daily percent from studied/goal
  const dailyPercent = useMemo(() => {
    const studied = Number(todayProgress?.studiedMinutes ?? 0);
    const goal = Number(todayProgress?.goalMinutes ?? serverGoal ?? 1);
    if (goal <= 0) return 0;
    return Math.min(100, Math.round((studied / goal) * 100));
  }, [todayProgress, serverGoal]);

  const studiedTodayMinutes = Number(todayProgress?.studiedMinutes ?? 0);
  const goalTodayMinutes = Number(todayProgress?.goalMinutes ?? serverGoal ?? 60);

  // Save daily goal to server
  const saveGoal = async () => {
    const minutes = Math.max(1, Number(goalInput) || 1);

    try {
      // axiosConfig baseURL should already include "/api"
      await API.post("/progress/goal", { minutes });
      refetchProgress(); // reload goal + weekly
    } catch (err) {
      console.error("Failed to save goal", err);
    }
  };

  return (
    <CardContainer>
      {/* TIMER */}
      <TimeBox>
        <Card>
          <CardHeading>Timer</CardHeading>
          <Timer onSessionSaved={refetchProgress} />
        </Card>
      </TimeBox>

      {/* TODAY TASKS */}
      <TasksBox>
        <Card>
          <CardHeading>Today's tasks</CardHeading>

          {statsLoading && <p>Loading...</p>}
          {!statsLoading && statsError && <ErrorText>{statsError}</ErrorText>}

          {!statsLoading && !statsError && (
            todayTasks.length ? (
              <CardList>
                {todayTasks.map((t) => (
                  <li key={t._id || t.id} data-status={t.status}>
                    {t.title}
                  </li>
                ))}
              </CardList>
            ) : (
              <p>No tasks for today 🎉</p>
            )
          )}
        </Card>
      </TasksBox>

      {/* DAILY PROGRESS */}
      <DailyBox>
        <Card>
          <CardHeading>Daily progress</CardHeading>
          {/* Goal input (styled) */}
          <GoalRow>
            <GoalLabel>Daily goal (min):</GoalLabel>
            <GoalInput
              type="number"
              min={1}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onBlur={saveGoal}
            />
            <GoalButton type="button" onClick={saveGoal}>
              Save
            </GoalButton>
          </GoalRow>

          <GoalHint>
            Studied: {studiedTodayMinutes} / {goalTodayMinutes} minutes
          </GoalHint>

          {progressLoading && <p>Loading...</p>}
          {!progressLoading && progressError && (
            <ErrorText>{progressError}</ErrorText>
          )}

          {!progressLoading && !progressError && (
            <DailyProgress percent={dailyPercent} />
          )}
        </Card>
      </DailyBox>

      {/* WEEKLY PROGRESS */}
      <WeeklyBox>
        <Card>
          <CardHeading>Weekly progress</CardHeading>

          {progressLoading && <p>Loading...</p>}
          {!progressLoading && progressError && (
            <ErrorText>{progressError}</ErrorText>
          )}

          {!progressLoading && !progressError && (
            <WeeklyProgress weeklyData={weeklyData} />
          )}
        </Card>
      </WeeklyBox>

      {/* UPCOMING DEADLINES */}
      <DeadlinesBox>
        <Card>
          <CardHeading>Upcoming deadlines</CardHeading>

          {statsLoading && <p>Loading...</p>}
          {!statsLoading && statsError && <ErrorText>{statsError}</ErrorText>}

          {!statsLoading && !statsError && (
            upcomingDeadlines.length ? (
              <CardList>
                {upcomingDeadlines.slice(0, 6).map((d) => (
                  <li key={d._id || d.id}>
                    {d.title} — {new Date(d.due).toLocaleDateString()}
                  </li>
                ))}
              </CardList>
            ) : (
              <p>No deadlines</p>
            )
          )}
        </Card>
      </DeadlinesBox>
    </CardContainer>
  );
};

export default CardContainerComp;
