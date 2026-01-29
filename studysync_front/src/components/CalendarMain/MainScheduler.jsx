// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box, Avatar, Typography } from "@mui/material";
import { SchedulerWrapper } from "./MainScheduler.style";

const MainScheduler = ({ selectedDate, events = [] }) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  console.log("Current time:", currentTime, "Full date:", now); // Debug log


  const ParticipantsViewer = ({ event }) => {
    if (!event.participants || event.participants.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 2 }}>
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
      </Box>
    );
  };

  return (
    <SchedulerWrapper>
      <Scheduler
        view="week"
        events={events}
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
        viewerExtraComponent={(fields, event) => <ParticipantsViewer event={event} />}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5],
          weekStartOn: 0,
          startHour: 0,
          endHour: 24,
          step: 60,
        }}
      />
    </SchedulerWrapper>
  );
};
export default MainScheduler;