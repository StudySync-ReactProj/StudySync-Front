import React, { useEffect, useState } from "react";
import {
    CardContainer,
    TimeBox,
    TasksBox,
    DailyBox,
    WeeklyBox,
    SessionsBox,
    DeadlinesBox,
} from "./CardContainer.style";
import Card from "../Card/Card";


const CardContainerComp = () => {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [tasksError, setTasksError] = useState("");

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
                <h3 style={{marginBottom:"20px" }}>Today's tasks</h3>

                {loadingTasks && <p>Loading...</p>}

                {tasksError && (
                    <p style={{color: "red" }}>{tasksError}</p>
                )}

                {!loadingTasks && !tasksError && (
                    <ul style={{paddingLeft: "18px" }}>
                    {tasks.map((t) => (
                        <li key={t.id} style={{ marginBottom: "10px" }}>
                        {t.title} {t.completed ? "✅" : "❌"}
                        </li>
                    ))}
                    </ul>
                )}
                </Card>
            </TasksBox>

            <WeeklyBox>
                <Card>Weekly progress</Card>
            </WeeklyBox>

            <SessionsBox>
                <Card>Upcoming sessions</Card>
            </SessionsBox>

            <DeadlinesBox>
                <Card>Upcoming deadlines</Card>
            </DeadlinesBox>
        </CardContainer>
    );
};

export default CardContainerComp;