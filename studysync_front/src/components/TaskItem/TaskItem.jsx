
const TaskItem = ({ task }) => {
    const isCompleted = task.Completed;
    return (
        <li style={{
            marginBottom: "8px",
            textDecoration: isCompleted ? "line-through" : "none",
            color: isCompleted ? "gray" : "black",
        }}>
            <strong>{task.title}</strong> <br />
            <small>
                Status: {isCompleted ? "Completed" : "Pending"}
            </small>
        </li>
    );
}
export default TaskItem;