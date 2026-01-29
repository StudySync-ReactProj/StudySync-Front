// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box, Avatar, Typography, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { SchedulerWrapper } from "./MainScheduler.style";
import { deleteEventAsync } from "../../store/eventsSlice";

const MainScheduler = ({ selectedDate, events = [] }) => {
  const dispatch = useDispatch();
  const [schedulerRef, setSchedulerRef] = React.useState(null);
  const { isLoading } = useSelector((state) => state.events);
  const currentUser = useSelector((state) => state.user.user); // Get current user info
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  console.log("Current time:", currentTime, "Full date:", now); // Debug log

  const handleDeleteEvent = async (event, closeViewer) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      try {
        await dispatch(deleteEventAsync(event.event_id)).unwrap();
        // Close the event viewer after successful deletion
        if (closeViewer) {
          closeViewer();
        }
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const ParticipantsViewer = ({ event, close }) => {
    const hasParticipants = event.participants && event.participants.length > 0;
    const isLocalEvent = event.source !== 'google';
    // Check if current user is the creator of the event
    const isCreator = currentUser && event.creator === currentUser._id;

    if (!hasParticipants && !isLocalEvent) {
      return null;
    }

    return (
      <Box sx={{ mt: 2 }}>
        {hasParticipants && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Participants:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {event.participants.map((participant, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                >
                  <Avatar
                    src={participant.avatar}
                    alt={participant.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    {!participant.avatar && participant.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2">
                    {participant.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
        {isLocalEvent && isCreator && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)'
            }}
          >
            <IconButton
              size="small"
              onClick={() => handleDeleteEvent(event, close)}
              sx={{
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <SchedulerWrapper>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress size={50} />
          <Typography variant="body2" color="text.secondary">
            Loading events...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          {events.length === 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: 3,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                minWidth: '300px'
              }}
            >
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                🗓️ Your schedule is clear for today!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start by creating a meeting poll or syncing your calendar.
              </Typography>
            </Box>
          )}
          <Scheduler
            view="week"
            events={events || []}
            selectedDate={selectedDate}
            scrollToTime={currentTime}
            hourHeight={40}
            editable={false}
            deletable={false}
            draggable={false}
            customEditor={() => false}
            onCellClick={() => { }}
            onEventClick={(event) => {
              console.log("Event clicked:", event);
            }}
            viewerExtraComponent={(fields, event) => {
              return <ParticipantsViewer event={event} close={fields.close} />;
            }}
            week={{
              weekDays: [0, 1, 2, 3, 4, 5],
              weekStartOn: 0,
              startHour: 0,
              endHour: 24,
              step: 60,
            }}
          />
        </Box>
      )}
    </SchedulerWrapper>
  );
};
export default MainScheduler;