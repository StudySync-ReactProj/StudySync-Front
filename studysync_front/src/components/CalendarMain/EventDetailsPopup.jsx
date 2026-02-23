// src/components/CalendarMain/ParticipantsViewer.jsx

/**
 * =============================================================================
 * EVENT DETAILS POPUP COMPONENT
 * =============================================================================
 * 
 * Displays event details in the calendar event viewer modal.
 * This component is used as viewerExtraComponent in the scheduler.
 * 
 * Features:
 * - Displays event description with fallback for empty descriptions
 * - Shows list of participants with avatars and names
 * - Works with @aldabil/react-scheduler's built-in edit/delete buttons
 * - Handles both local events and Google Calendar events
 * 
 * Props:
 * @param {Object} event - The event object containing description, participants, and metadata
 * @param {Function} close - Callback to close the viewer (provided by scheduler)
 * @param {string} currentUserId - Current user's ID for permission check
 * @param {boolean} showActions - Whether action buttons should be shown (controlled by parent)
 */


import React from "react";
import { Box, Avatar, Typography } from "@mui/material";


const EventDetailsPopup = ({ event, close, currentUserId, showActions }) => {
  const hasParticipants = event.participants && event.participants.length > 0;
  const hasDescription = event.description && event.description.trim().length > 0;

  // Always render content - the scheduler handles visibility
  return (
    <Box sx={{ mt: 2 }}>
      {/* Description Section */}
      <Box sx={{ mb: hasParticipants ? 2 : 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
          Description:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: hasDescription ? 'text.secondary' : 'text.disabled',
            fontStyle: hasDescription ? 'normal' : 'italic',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            backgroundColor: hasDescription ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
            padding: hasDescription ? 1.5 : 0,
            borderRadius: 1,
            border: hasDescription ? '1px solid rgba(0, 0, 0, 0.08)' : 'none'
          }}
        >
          {hasDescription ? event.description : 'No description provided'}
        </Typography>
      </Box>

      {/* Participants Section */}
      {hasParticipants && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
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
                  {participant.name || participant.email}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {/* Note: Edit and Delete buttons are handled by the scheduler library */}
    </Box>
  );
};

export default EventDetailsPopup;
