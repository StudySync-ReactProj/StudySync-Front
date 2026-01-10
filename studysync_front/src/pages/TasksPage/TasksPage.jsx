// src/pages/TasksPage/TasksPage.jsx
import { useState, useEffect } from "react";
import TasksList from "../../components/TasksList/TasksList.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Header from "../../components/Header/Header.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";

const TasksPage = ({ onLogout, onGoToTasks, onGoToHome }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos?_limit=10"
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <Header
        onLogout={onLogout}
        onGoToTasks={onGoToTasks}
        onGoToHome={onGoToHome}
      />
      <Wrapper>
        <div id="tasks--title">
          <MainTitle title="My Tasks" />
        </div>
        <div id="tasks--list">
          {/* <div style={{ paddingLeft: "36px" }}> */}

          {/* <MainTitle title="My Tasks" /> */}
          {loading && <p>Loading tasks...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {!loading && !error && <TasksList tasks={tasks} />}
        </div>
      </Wrapper>
    </>
  );
};

export default TasksPage;
