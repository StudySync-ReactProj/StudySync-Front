// src/components/TasksList/TaskItem.jsx

const TaskItem = ({ task, onDeleteTask }) => {
    // MongoDB uses _id instead of id
    const isCompleted = task.status === "Completed"; 

    return (
        <li style={{
            marginBottom: "12px",
            padding: "10px",
            border: "1px solid #eee",
            borderRadius: "8px",
            listStyle: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textDecoration: isCompleted ? "line-through" : "none",
            color: isCompleted ? "gray" : "black",
        }}>
            <div>
                <strong>{task.title}</strong> <br />
                <small>Status: {task.status || "Pending"}</small>
            </div>
            
            {/* Pass task._id to the delete handler */}
            <button 
                onClick={() => onDeleteTask(task._id)}
                style={{ color: 'red', cursor: 'pointer' }}
            >
                Delete
            </button>
        </li>
    );
}

export default TaskItem;