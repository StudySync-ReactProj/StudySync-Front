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


const CardContainerComp = ({ data }) => {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [tasksError, setTasksError] = useState("");
    const upcomingSessions = data?.upcomingSessions ?? [];

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
                <Card>10:40</Card>
            </TimeBox>

            <DailyBox>
                <Card>Daily progress</Card>
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
                            {tasks.map((t) => (
                                <li key={t.id}>
                                    {t.title} {t.completed ? "✅" : "❌"}
                                </li>
                            ))}
                        </CardList>
                    )}
                </Card>
            </TasksBox>

            <WeeklyBox>
                <Card>Weekly progress</Card>
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
                <Card>Upcoming deadlines</Card>
            </DeadlinesBox>
        </CardContainer>
    );
};

export default CardContainerComp;