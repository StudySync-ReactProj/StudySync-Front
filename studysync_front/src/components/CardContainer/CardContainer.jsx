import React from "react";
import {
  CardContainer,
  TimeBox,
  TasksBox,
  DailyBox,
  WeeklyBox,
  // SessionsBox,
  DeadlinesBox,
  CardHeading,
  CardList,
} from "./CardContainer.style";
import Card from "../Card/Card";
import Timer from "../Timer/Timer";
import DailyProgress from "../DailyProgress/DailyProgress";
import WeeklyProgress from "../WeeklyProgress/WeeklyProgress";
import { useApi } from "../../hooks/useApi";

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CardContainerComp = () => {
  const { data: stats, loading, error } = useApi(`${API_BASE_URL}/api/stats`);

  // דיפולטים כדי שלא יקרוס אם stats עדיין null
  const todayTasks = stats?.tasks ?? [];
  const upcomingSessions = stats?.upcomingSessions ?? [];
  const upcomingDeadlines = stats?.upcomingDeadlines ?? [];
  const dailyProgress = stats?.dailyProgress ?? 0;
  const weeklyProgress = stats?.weeklyProgress ?? [];

  return (
    <CardContainer>
      {/* TIMER */}
      <TimeBox>
        <Card>
          <CardHeading>Timer</CardHeading>
          <Timer />
        </Card>
      </TimeBox>

      {/* TODAY TASKS */}
      <TasksBox>
        <Card>
          <CardHeading>Today's tasks</CardHeading>

          {loading && <p>Loading...</p>}
          {!loading && error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
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
              <p>No tasks for today 🎉</p>
            )
          )}
        </Card>
      </TasksBox>

      {/* DAILY PROGRESS */}
      <DailyBox>
        <Card>
          <CardHeading>Daily progress</CardHeading>

          {loading && <p>Loading...</p>}
          {!loading && error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && <DailyProgress percent={dailyProgress} />}
        </Card>
      </DailyBox>

      {/* WEEKLY PROGRESS */}
      <WeeklyBox>
        <Card>
          <CardHeading>Weekly progress</CardHeading>

          {loading && <p>Loading...</p>}
          {!loading && error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && <WeeklyProgress weeklyData={weeklyProgress} />}
        </Card>
      </WeeklyBox>

      {/* UPCOMING DEADLINES */}
      <DeadlinesBox>
        <Card>
          <CardHeading>Upcoming deadlines</CardHeading>

          {loading && <p>Loading...</p>}
          {!loading && error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
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
