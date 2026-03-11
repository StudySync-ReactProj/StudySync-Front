// src/components/TasksList/TaskItem.jsx
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';

const TaskItem = ({ task, onDeleteTask }) => {
    // MongoDB uses _id instead of id
    const isCompleted = task.status === "Completed";

    const renderEstimated = () => {
        if (!task.estimatedMinutes) return null;
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555' }}>
                <AccessTimeIcon sx={{ fontSize: 16 }} />
                <small>Estimated: {task.estimatedMinutes} min</small>
            </div>
        );
    };

    const renderScheduled = () => {
        if (!task.scheduledStart || !task.scheduledEnd) return null;
        const start = new Date(task.scheduledStart);
        const end = new Date(task.scheduledEnd);
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#555' }}>
                <EventIcon sx={{ fontSize: 16 }} />
                <small>Scheduled: {start.toLocaleString()} - {end.toLocaleTimeString()}</small>
            </div>
        );
    };

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
                <div style={{ marginTop: 6 }}>
                    {renderEstimated()}
                    {renderScheduled()}
                </div>
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