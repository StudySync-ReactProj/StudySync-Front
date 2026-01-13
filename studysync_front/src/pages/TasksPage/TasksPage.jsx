// src/pages/TasksPage/TasksPage.jsx
import TasksList from "../../components/TasksList/TasksList.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Header from "../../components/Header/Header.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import { useApi } from "../../hooks/useApi";

const TasksPage = ({ onLogout, onGoToTasks, onGoToHome }) => {
  const { data: tasks, loading, error } = useApi(
    "https://jsonplaceholder.typicode.com/todos?_limit=10"
  );

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
