import React, { useEffect, useState } from "react";
import {
    CardContainer,
    TimeBox,
    TasksBox,
    DailyBox,
    WeeklyBox,
    SessionsBox,
    DeadlinesBox,
    CardHeading,
    CardList,
} from "./CardContainer.style";
import Card from "../Card/Card";
import Timer from "../Timer/Timer";
import DailyProgress from "../DailyProgress/DailyProgress"
import WeeklyProgress from "../WeeklyProgress/WeeklyProgress";


const CardContainerComp = ({ data }) => {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [tasksError, setTasksError] = useState("");
    const upcomingSessions = data?.upcomingSessions ?? [];
    const upcomingDeadlines = data?.upcomingDeadlines ?? [];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoadingTasks(true);
                setTasksError("");

                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/todos?_limit=8"
                );
                if (!res.ok) throw new Error("Failed to fetch tasks");

                const data = await res.json();
                setTasks(data);
            } catch (err) {
                setTasksError(err.message || "Unknown error");
            } finally {
                setLoadingTasks(false);
            }
        };
        fetchTasks();

    }, []);

    return (
        <CardContainer>
            <TimeBox>
                <Card>
                    <CardHeading>Timer</CardHeading>
                    <Timer />
                </Card>
            </TimeBox>

            <DailyBox>
                <Card>
                    <CardHeading>Daily progress</CardHeading>
                    <DailyProgress tasks={tasks} loading={loadingTasks} error={tasksError} />
                </Card>
            </DailyBox>

            <TasksBox>
                <Card>
                    <CardHeading>Today's tasks</CardHeading>

                    {loadingTasks && <p>Loading...</p>}

                    {tasksError && (
                        <p style={{ color: "red" }}>{tasksError}</p>
                    )}

                    {!loadingTasks && !tasksError && (
                        <CardList>
                            {tasks.filter((t) => !t.completed).map((t) => (
                                <li key={t.id}>
                                    {t.title}
                                </li>
                            ))}
                        </CardList>
                    )}
                </Card>
            </TasksBox>

            <WeeklyBox>
                <Card>
                    <CardHeading>Weekly progress</CardHeading>
                    <WeeklyProgress tasks={tasks} loading={loadingTasks} error={tasksError} />
                </Card>
            </WeeklyBox>

            <SessionsBox>
                <Card>
                    <CardHeading>Upcoming sessions</CardHeading>
                    <CardList>
                        {upcomingSessions.slice(0, 3).map((s) => (
                            <li key={s.id}>
                                {s.title} — {s.date} at {s.time}
                            </li>
                        ))}
                    </CardList>
                </Card>
            </SessionsBox>

            <DeadlinesBox>
                <Card>
                    <CardHeading>Upcoming deadlines</CardHeading>
                    <CardList>
                        {upcomingDeadlines.slice(0, 6).map((d) => (
                            <li key={d.id}>
                                {d.title} — {d.due}
                            </li>
                        ))}
                    </CardList>
                </Card>
            </DeadlinesBox>
        </CardContainer>
    );
};

export default CardContainerComp;