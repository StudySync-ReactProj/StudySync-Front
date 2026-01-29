// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box } from "@mui/material";
import { SchedulerWrapper } from "./MainScheduler.style";
import { useCalendarData } from "../../hooks/useCalendarData";
import { getCurrentTime } from "../../utils/dateUtils";
import ParticipantsViewer from "./ParticipantsViewer";
import LoadingOverlay from "./LoadingOverlay";
import EmptyStateOverlay from "./EmptyStateOverlay";

/**
 * MainScheduler Component
 * Displays a weekly calendar scheduler with events
 * Supports loading states, empty states, and event management
 * 
 * @param {Date} selectedDate - Currently selected date for the scheduler
 * @param {Array} events - Array of events to display
 */
const MainScheduler = ({ selectedDate, events = [] }) => {
  const { isLoading, currentUser, handleDeleteEvent } = useCalendarData();
  const currentTime = getCurrentTime();

  // Show loading overlay while fetching events
  if (isLoading) {
    return (
      <SchedulerWrapper>
        <LoadingOverlay />
      </SchedulerWrapper>
    );
  }

  return (
    <SchedulerWrapper>
      <Box sx={{ position: 'relative' }}>
        {/* Show empty state overlay when no events exist */}
        {events.length === 0 && <EmptyStateOverlay />}
        
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
          onEventClick={() => { }}
          viewerExtraComponent={(fields, event) => (
            <ParticipantsViewer
              event={event}
              close={fields.close}
              onDeleteEvent={handleDeleteEvent}
              currentUserId={currentUser?._id}
            />
          )}
          week={{
            weekDays: [0, 1, 2, 3, 4, 5],
            weekStartOn: 0,
            startHour: 0,
            endHour: 24,
            step: 60,
          }}
        />
      </Box>
    </SchedulerWrapper>
  );
};

export default MainScheduler;