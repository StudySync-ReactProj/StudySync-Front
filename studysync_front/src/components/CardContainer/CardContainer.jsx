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
  RefreshRow,
  RefreshButton,
} from "./CardContainer.style";

import Card from "../Card/Card";
import Timer from "../Timer/Timer";
import DailyProgress from "../DailyProgress/DailyProgress";
import WeeklyProgress from "../WeeklyProgress/WeeklyProgress";

import API from "../../api/axiosConfig";

/**
 * CardContainerComp - Presentation Component
 * 
 * Receives all data as props from Dashboard (smart container)
 * No direct API calls - only displays data and handles user interactions
 * 
 * @param {Object} stats - Tasks and deadlines data
 * @param {Object} progressData - Weekly progress and goal data
 * @param {Function} onRefreshProgress - Callback to refresh progress data
 */
const CardContainerComp = ({ stats, progressData, onRefreshProgress }) => {
  // Safe fallbacks (avoid crash if data is undefined)
  const todayTasks = stats?.tasks ?? [];
  const upcomingDeadlines = stats?.upcomingDeadlines ?? [];

  const weeklyData = progressData?.weekly ?? [];
  const serverGoal = Number(progressData?.dailyGoalMinutes ?? 60);

  // Goal input state (smooth typing)
  const [goalInput, setGoalInput] = useState(serverGoal);
  const [savingGoal, setSavingGoal] = useState(false);

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

    setSavingGoal(true);
    try {
      await API.post("/progress/goal", { minutes });
      // Trigger parent refresh callback
      if (onRefreshProgress) {
        onRefreshProgress();
      }
    } catch (err) {
      console.error("Failed to save goal", err);
      alert("Failed to save goal. Please try again.");
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <CardContainer>
      {/* TIMER */}
      <TimeBox>
        <Card>
          <CardHeading>Timer</CardHeading>
          <Timer />

          <RefreshRow>
            <RefreshButton 
              type="button" 
              onClick={onRefreshProgress}
              disabled={savingGoal}
            >
              Refresh progress
            </RefreshButton>
          </RefreshRow>
        </Card>
      </TimeBox>

      {/* TODAY TASKS */}
      <TasksBox>
        <Card>
          <CardHeading>Today's tasks</CardHeading>

          {todayTasks.length ? (
            <CardList>
              {todayTasks.map((t) => (
                <li key={t._id || t.id} data-status={t.status}>
                  {t.title}
                </li>
              ))}
            </CardList>
          ) : (
            <p>No tasks for today 🎉</p>
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
              disabled={savingGoal}
            />
            <GoalButton 
              type="button" 
              onClick={saveGoal}
              disabled={savingGoal}
            >
              {savingGoal ? 'Saving...' : 'Save'}
            </GoalButton>
          </GoalRow>

          <GoalHint>
            Studied: {studiedTodayMinutes} / {goalTodayMinutes} minutes
          </GoalHint>

          <DailyProgress percent={dailyPercent} />
        </Card>
      </DailyBox>

      {/* WEEKLY PROGRESS */}
      <WeeklyBox>
        <Card>
          <CardHeading>Weekly progress</CardHeading>
          <WeeklyProgress weeklyData={weeklyData} />
        </Card>
      </WeeklyBox>

      {/* UPCOMING DEADLINES */}
      <DeadlinesBox>
        <Card>
          <CardHeading>Upcoming deadlines</CardHeading>

          {upcomingDeadlines.length ? (
            <CardList>
              {upcomingDeadlines.slice(0, 6).map((d) => (
                <li key={d._id || d.id}>
                  {d.title} — {new Date(d.due).toLocaleDateString()}
                </li>
              ))}
            </CardList>
          ) : (
            <p>No deadlines</p>
          )}
        </Card>
      </DeadlinesBox>
    </CardContainer>
  );
};

export default CardContainerComp;
