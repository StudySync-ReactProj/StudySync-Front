// src/components/Tasks/TasksList.jsx
import TaskItem from "../TaskItem/TaskItem.jsx";

const TasksList = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return <p>No tasks available</p>;
    }
    return (
        <ul id="tasks-list">
            {tasks.map((task) => (<TaskItem key={task.id} task={task} />))}
        </ul>
    )
}

export default TasksList;
