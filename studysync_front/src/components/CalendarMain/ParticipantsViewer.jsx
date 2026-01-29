// src/components/CalendarMain/ParticipantsViewer.jsx

/**
 * =============================================================================
 * PARTICIPANTS VIEWER COMPONENT
 * =============================================================================
 * 
 * A reusable component that displays event participants in the calendar
 * event viewer modal.
 * 
 * Features:
 * - Displays list of participants with avatars and names
 * - Shows delete button only for event creators (permission-based)
 * - Handles both local events and Google Calendar events
 * - Integrates with Material UI components for consistent styling
 * 
 * Props:
 * - event: Event object containing participants and metadata
 * - close: Callback function to close the event viewer
 * - onDeleteEvent: Callback function to handle event deletion
 * - currentUserId: ID of the currently logged-in user for permission checks
 * 
 * Purpose: Extracted from MainScheduler to create a focused, reusable
 * component that handles participant display logic independently.
 * =============================================================================
 */

import React from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * ParticipantsViewer Component
 * Displays event participants and delete button for event creators
 * 
 * @param {Object} event - The event object
 * @param {Function} close - Callback to close the viewer
 * @param {Function} onDeleteEvent - Callback to handle event deletion
 * @param {string} currentUserId - Current user's ID for permission check
 */
const ParticipantsViewer = ({ event, close, onDeleteEvent, currentUserId }) => {
  const hasParticipants = event.participants && event.participants.length > 0;
  const isLocalEvent = event.source !== 'google';
  const isCreator = currentUserId && event.creator === currentUserId;

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
            onClick={() => onDeleteEvent(event, close)}
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

export default ParticipantsViewer;
