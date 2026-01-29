// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, Today } from "@mui/icons-material";
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
 * @param {Function} onDateChange - Callback to update selected date
 * @param {Array} events - Array of events to display
 */
const MainScheduler = ({ selectedDate, onDateChange, events = [] }) => {
  const { isLoading, currentUser, handleDeleteEvent } = useCalendarData();
  const currentTime = getCurrentTime();

  // Week navigation handlers
  const handlePreviousWeek = () => {
    if (onDateChange) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      onDateChange(newDate);
    }
  };

  const handleNextWeek = () => {
    if (onDateChange) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    if (onDateChange) {
      onDateChange(new Date());
    }
  };

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
        
        {/* Week Navigation Controls */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mb: 2,
          p: 1.5,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <Tooltip title="Previous Week" arrow>
            <IconButton
              onClick={handlePreviousWeek}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                width: 38,
                height: 38,
              }}
            >
              <ChevronLeft />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go to Today" arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={handleToday}
            >
              <Today sx={{ fontSize: 20, color: 'primary.main' }} />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  minWidth: 150,
                  textAlign: 'center',
                }}
              >
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Next Week" arrow>
            <IconButton
              onClick={handleNextWeek}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                width: 38,
                height: 38,
              }}
            >
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>

        <Scheduler
          key={selectedDate.toISOString()}
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
          navigation={false}
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