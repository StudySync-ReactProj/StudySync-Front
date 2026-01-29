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
  // Fetch dashboard stats (tasks/sessions/deadlines)
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useApi(`${API_BASE_URL}/api/stats`);

  // Fetch progress data (goal + last 7 days)
  const {
    data: progressRes,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useApi(`${API_BASE_URL}/api/progress/weekly`);

  // Safe fallbacks for stats
  const todayTasks = stats?.tasks ?? [];
  const upcomingSessions = stats?.upcomingSessions ?? [];
  const upcomingDeadlines = stats?.upcomingDeadlines ?? [];

  // Safe fallbacks for progress
  const weeklyData = progressRes?.weekly ?? [];
  const serverGoal = progressRes?.dailyGoalMinutes ?? 60;

  // Local state for the goal input (smooth typing)
  const [goalInput, setGoalInput] = useState(serverGoal);

  // Sync input when server goal arrives/changes
  useEffect(() => {
    setGoalInput(serverGoal);
  }, [serverGoal]);

  // Compute today's percent from the last item in weekly array
  const todayProgress = weeklyData?.[weeklyData.length - 1];

  const dailyPercent = useMemo(() => {
    if (!todayProgress) return 0;

    const studied = Number(todayProgress.studiedMinutes || 0);
    const goal = Number(todayProgress.goalMinutes || serverGoal || 1);
    if (goal <= 0) return 0;

    // Clamp 0-100
    return Math.min(100, Math.round((studied / goal) * 100));
  }, [todayProgress, serverGoal]);

  // Optional text
  const studiedTodayMinutes = Number(todayProgress?.studiedMinutes || 0);
  const goalTodayMinutes = Number(todayProgress?.goalMinutes || serverGoal || 60);

  // Save goal to server
  const saveGoal = async () => {
    const minutes = Math.max(1, Number(goalInput) || 1);
    try {
      // axiosConfig already has baseURL "/api"
      await API.post("/progress/goal", { minutes });
      // Refresh progress after saving
      refetchProgress();
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
          <Timer />
          {/* Manual refresh (useful after saving sessions from Timer) */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={refetchProgress}>Refresh progress</button>
          </div>
        </Card>
      </TimeBox>

      {/* TODAY TASKS */}
      <TasksBox>
        <Card>
          <CardHeading>Today's tasks</CardHeading>

          {statsLoading && <p>Loading...</p>}
          {!statsLoading && statsError && (
            <p style={{ color: "red" }}>{statsError}</p>
          )}

          {!statsLoading && !statsError && (
            todayTasks.length ? (
              <CardList>
                {todayTasks.map((t) => (
                  <li 
                    key={t._id || t.id}
                    style={{
                      textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                      opacity: t.status === 'Completed' ? 0.6 : 1,
                      fontSize: '1.2rem'
                    }}
                  >
                    {t.title}
                  </li>
                ))}
              </CardList>
            ) : (
              <p>No tasks for today</p>
            )
          )}
        </Card>
      </TasksBox>

      {/* DAILY PROGRESS */}
      <DailyBox>
        <Card>
          <CardHeading>Daily progress</CardHeading>

          {/* Daily goal input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <span>Daily goal (min):</span>
            <input
              type="number"
              min={1}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onBlur={saveGoal} // Save when user leaves input
              style={{ width: 90 }}
            />
            <button onClick={saveGoal}>Save</button>
          </div>

          {progressLoading && <p>Loading...</p>}
          {!progressLoading && progressError && (
            <p style={{ color: "red" }}>{progressError}</p>
          )}

          {!progressLoading && !progressError && (
            <>
              {/* Small clarity text */}
              <p style={{ marginBottom: 8 }}>
                Studied: {studiedTodayMinutes} / {goalTodayMinutes} minutes
              </p>

              {/* DailyProgress should accept "percent" prop */}
              <DailyProgress percent={dailyPercent} />
            </>
          )}
        </Card>
      </DailyBox>

      {/* WEEKLY PROGRESS */}
      <WeeklyBox>
        <Card>
          <CardHeading>Weekly progress</CardHeading>

          {progressLoading && <p>Loading...</p>}
          {!progressLoading && progressError && (
            <p style={{ color: "red" }}>{progressError}</p>
          )}

          {!progressLoading && !progressError && (
            <WeeklyProgress weeklyData={weeklyData} />
          )}
        </Card>
      </WeeklyBox>

      {/* UPCOMING SESSIONS */}
      <Card>
        <CardHeading>Upcoming sessions</CardHeading>

        {statsLoading && <p>Loading...</p>}
        {!statsLoading && statsError && (
          <p style={{ color: "red" }}>{statsError}</p>
        )}

        {!statsLoading && !statsError && (
          upcomingSessions.length ? (
            <CardList>
              {upcomingSessions.slice(0, 3).map((s) => (
                <li key={s._id || s.id}>
                  {s.title} — {s.date} at {s.time}
                </li>
              ))}
            </CardList>
          ) : (
            <p>No upcoming sessions</p>
          )
        )}
      </Card>

      {/* UPCOMING DEADLINES */}
      <DeadlinesBox>
        <Card>
          <CardHeading>Upcoming deadlines</CardHeading>

          {statsLoading && <p>Loading...</p>}
          {!statsLoading && statsError && (
            <p style={{ color: "red" }}>{statsError}</p>
          )}

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
