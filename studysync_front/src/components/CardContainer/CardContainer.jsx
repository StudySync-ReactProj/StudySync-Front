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
  // ErrorText,
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

  // weeklyData comes from backend: [{ date, day, studiedMinutes, goalMinutes }]
  const weeklyData = useMemo(() => progressData?.weekly ?? [], [progressData?.weekly]);

  // Fallback default goal when server doesn't provide one for a day
  const DEFAULT_DAILY_GOAL = 60;

  // Goal input state (smooth typing)
  const [goalInput, setGoalInput] = useState(DEFAULT_DAILY_GOAL);
  const [savingGoal, setSavingGoal] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  // Optimistic weekly data to ensure UI shows the saved goal immediately
  const [optimisticWeekly, setOptimisticWeekly] = useState(null);

  // Local override for today's goal (so setting a goal affects only today's display)
  // { date: 'Tue Mar 01 2026', minutes: 250 }
  const [todayGoalOverride, setTodayGoalOverride] = useState(null);
  const LOCAL_OVERRIDE_KEY = 'studysync_today_goal_override';

  // Load persisted override on mount (if it matches today's date)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_OVERRIDE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === new Date().toDateString()) {
        setTodayGoalOverride(parsed);
        // Also ensure goalInput reflects persisted minutes (clamped to max)
        if (parsed.minutes) setGoalInput(Math.min(720, Number(parsed.minutes) || DEFAULT_DAILY_GOAL));
      }
    } catch (e) {
      console.debug('Failed to read persisted today override', e);
    }
  }, []);

  // Sync when server returns updated goal
  useEffect(() => {
    const todayStr = new Date().toDateString();
    // Only sync from server if we don't have a local override for today
    if (!todayGoalOverride || todayGoalOverride.date !== todayStr) {
      // Take the last entry from weeklyData as 'today' and use its goalMinutes
      const last = Array.isArray(weeklyData) && weeklyData.length ? weeklyData[weeklyData.length - 1] : null;
      // clamp server-provided values to the 720 minute maximum
      const serverMinutes = Math.min(720, Number(last?.goalMinutes ?? DEFAULT_DAILY_GOAL));
      setGoalInput(serverMinutes);
    }
  }, [weeklyData, todayGoalOverride]);

  // Clear override if the day changed (so override only applies to the day it was set)
  useEffect(() => {
    if (!todayGoalOverride) return;
    const todayStr = new Date().toDateString();
    if (todayGoalOverride.date !== todayStr) {
      setTodayGoalOverride(null);
    }
  }, [todayGoalOverride]);

  // Persist override to localStorage whenever it changes
  useEffect(() => {
    try {
      if (!todayGoalOverride) {
        localStorage.removeItem(LOCAL_OVERRIDE_KEY);
      } else {
        localStorage.setItem(LOCAL_OVERRIDE_KEY, JSON.stringify(todayGoalOverride));
      }
    } catch (e) {
      console.debug('Failed to persist today override', e);
    }
  }, [todayGoalOverride]);

  // When server data updates, clear optimisticWeekly so real server values show
  useEffect(() => {
    setOptimisticWeekly(null);
  }, [weeklyData]);

  // Use last day in weekly array as "today"
  // Apply override to weeklyData copy so only today's entry is modified locally
  const adjustedWeeklyData = useMemo(() => {
    const todayStr = new Date().toDateString();

    // Build a safe fallback week if server didn't provide weeklyData
    let base = [];
    if (!Array.isArray(weeklyData) || weeklyData.length === 0) {
      // create 7 items with studied 0 and goal = DEFAULT_DAILY_GOAL
      base = Array.from({ length: 7 }).map(() => ({ studiedMinutes: 0, goalMinutes: DEFAULT_DAILY_GOAL }));
    } else {
      // Copy server-provided items and ensure goalMinutes exists per day
      // clamp any server-provided goalMinutes to the maximum allowed
      base = weeklyData.map((d) => ({ ...d, goalMinutes: Math.min(720, Number(d?.goalMinutes ?? DEFAULT_DAILY_GOAL)) }));
    }

    // If there is no override for today, just return the base array
    if (!todayGoalOverride || todayGoalOverride.date !== todayStr) return base;

    // Apply override to the last entry (today)
    const copy = base.map((d) => ({ ...d }));
    const lastIdx = copy.length - 1;
    if (lastIdx >= 0) {
      copy[lastIdx].goalMinutes = Math.min(720, Number(todayGoalOverride.minutes) || copy[lastIdx].goalMinutes);
    }
    return copy;
  }, [weeklyData, todayGoalOverride, DEFAULT_DAILY_GOAL]);

  const todayProgress = adjustedWeeklyData?.[adjustedWeeklyData.length - 1];

  // Compute daily percent from studied/goal
  const dailyPercent = useMemo(() => {
    const studied = Number(todayProgress?.studiedMinutes ?? 0);
    const goal = Number(todayProgress?.goalMinutes ?? DEFAULT_DAILY_GOAL ?? 1);
    if (goal <= 0) return 0;
    return Math.round((studied / goal) * 100);
  }, [todayProgress]);

  const studiedTodayMinutes = Number(todayProgress?.studiedMinutes ?? 0);
  const goalTodayMinutes = Number(todayProgress?.goalMinutes ?? DEFAULT_DAILY_GOAL);

  // Save daily goal to server
  const saveGoal = async () => {
    // Ensure saved value is within 1..720
    const minutes = Math.max(1, Math.min(720, Number(goalInput) || 1));

    setSavingGoal(true);
    try {
      // Immediately apply local override so UI updates instantly
      setTodayGoalOverride({ date: new Date().toDateString(), minutes });
      // Make sure the input shows the saved value immediately
      setGoalInput(minutes);
      const res = await API.post("/progress/goal", { minutes });
      console.debug('POST /progress/goal response:', res?.status, res?.data);
      // If server returned updated weekly data, use it to update the chart immediately
      if (res?.data?.weekly) {
        try {
          // clamp server payload to max per-day minutes
          const serverWeekly = Array.isArray(res.data.weekly) ? res.data.weekly.map(d => ({ ...d, goalMinutes: Math.min(720, Number(d.goalMinutes ?? DEFAULT_DAILY_GOAL)) })) : null;
          if (serverWeekly) {
            setOptimisticWeekly(serverWeekly);
          }
        } catch (e) {
          console.debug('Failed to apply server weekly payload', e);
        }
      }
      // Optimistically update weekly data shown in the chart
      try {
        const newWeekly = Array.isArray(adjustedWeeklyData) ? adjustedWeeklyData.map(d => ({ ...d })) : [];
        if (newWeekly.length > 0) {
          newWeekly[newWeekly.length - 1].goalMinutes = Math.min(720, minutes);
          setOptimisticWeekly(newWeekly);
        }
      } catch (e) {
        console.debug('Failed to set optimistic weekly', e);
      }
      // Locally override today's goal so weekly chart and daily card reflect the chosen value
      // Trigger parent refresh callback
      if (onRefreshProgress) {
        await onRefreshProgress();
        // show short confirmation - prefer server message if provided
        const serverMsg = res?.data?.message || "Today's goal updated";
        setConfirmation(serverMsg);
        setTimeout(() => setConfirmation(null), 3000);
      }
    } catch (err) {
      // Keep the local override so the UI reflects the user's chosen value
      console.error("Failed to save goal", err);
      const serverMsg = err?.response?.data?.message || err?.response?.data || err.message || 'Unknown error';
      // Show a clearer error to the user (include status if available)
      const status = err?.response?.status;
      alert(`Failed to save goal${status ? ` (status ${status})` : ''}: ${serverMsg}`);
      // Don't trigger onRefreshProgress on failure — local override remains active
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
          <Timer onSessionSaved={onRefreshProgress} />
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
              max={720}
              value={goalInput}
              onChange={(e) => {
                let val = e.target.value;
                const num = Number(val);
                // If the user inserts more than 720, notify and clamp immediately
                if (!isNaN(num) && num > 720) {
                  alert("Don't study more then 12H");
                  val = '720';
                  setGoalInput(val);
                  setTodayGoalOverride({ date: new Date().toDateString(), minutes: 720 });
                  return;
                }
                // keep the raw input so typing isn't interrupted
                setGoalInput(val);
                // Apply override immediately as the user types so today's goal updates in the UI
                if (val === '' || Number(val) <= 0) {
                  setTodayGoalOverride(null);
                } else {
                  const clamped = Math.max(1, Math.min(720, isNaN(num) ? DEFAULT_DAILY_GOAL : num));
                  setTodayGoalOverride({ date: new Date().toDateString(), minutes: clamped });
                }
              }}
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
          {confirmation ? (
            <div style={{ color: 'green', fontSize: 12, marginTop: 6 }}>{confirmation}</div>
          ) : null}

          <DailyProgress percent={dailyPercent} />
        </Card>
      </DailyBox>

      {/* WEEKLY PROGRESS */}
      <WeeklyBox>
        <Card>
          <CardHeading>Weekly progress</CardHeading>
          <WeeklyProgress
            weeklyData={optimisticWeekly ?? adjustedWeeklyData}
          />
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
