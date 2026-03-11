// src/components/TasksList/TaskItem.jsx
import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';

import { containerSx, leftSectionSx, metaRowSx, deleteButtonSx, iconSx, deleteTextSx } from './TaskItem.style';

const TaskItem = ({ task, onDeleteTask }) => {
    const theme = useTheme();
    const isCompleted = task.status === "Completed";

    const renderEstimated = () => {
        if (!task.estimatedMinutes) return null;
        return (
            <Box sx={metaRowSx}>
                <AccessTimeIcon sx={iconSx} />
                <Typography variant="body2">Estimated: {task.estimatedMinutes} min</Typography>
            </Box>
        );
    };

    const renderScheduled = () => {
        if (!task.scheduledStart || !task.scheduledEnd) return null;
        const start = new Date(task.scheduledStart);
        const end = new Date(task.scheduledEnd);
        return (
            <Box sx={metaRowSx}>
                <EventIcon sx={iconSx} />
                <Typography variant="body2">Scheduled: {start.toLocaleString()} - {end.toLocaleTimeString()}</Typography>
            </Box>
        );
    };

    return (
        <Box component="li" sx={containerSx(isCompleted, theme)}>
            <Box sx={leftSectionSx}>
                <Typography variant="subtitle1"><strong>{task.title}</strong></Typography>
                <Typography variant="caption">Status: {task.status || "Pending"}</Typography>
                <Box>
                    {renderEstimated()}
                    {renderScheduled()}
                </Box>
            </Box>

            <IconButton
                aria-label="delete task"
                onClick={() => onDeleteTask(task._id)}
                sx={deleteButtonSx}
                size="small"
            >
                <Typography variant="button" sx={deleteTextSx}>Delete</Typography>
            </IconButton>
        </Box>
    );
};

export default TaskItem;