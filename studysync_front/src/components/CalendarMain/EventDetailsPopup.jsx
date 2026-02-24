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
 * @param {Object} currentUser - Current user object with _id and email
 * @param {string} currentUserId - Current user's ID for permission check
 * @param {boolean} showActions - Whether action buttons should be shown (controlled by parent)
 * @param {Function} onRsvp - Callback to handle RSVP status update (eventId, status)
 */


import React from "react";
import { Box, Avatar, Typography, Button, ButtonGroup } from "@mui/material";


const EventDetailsPopup = ({ event, close, currentUser, currentUserId, showActions, onRsvp }) => {
  const hasParticipants = event.participants && event.participants.length > 0;
  const hasDescription = event.description && event.description.trim().length > 0;
  
  // Debug logging
  console.log('🔍 EventDetailsPopup Debug:');
  console.log('  currentUserId:', currentUserId);
  console.log('  currentUser.email:', currentUser?.email);
  console.log('  event.participants:', event.participants);
  console.log('  event.source:', event.source);
  
  // Check if current user is a participant - match by email
  const currentUserParticipant = hasParticipants 
    ? event.participants.find(p => {
        console.log('  Checking participant:', p.email, 'against user email:', currentUser?.email);
        return p.email === currentUser?.email;
      })
    : null;
  
  console.log('  currentUserParticipant:', currentUserParticipant);
  
  const isParticipant = !!currentUserParticipant;
  const currentUserStatus = currentUserParticipant?.status?.toLowerCase() || 'pending';
  const canRsvp = isParticipant && event.source !== 'google';
  
  console.log('  isParticipant:', isParticipant);
  console.log('  canRsvp:', canRsvp);

  // Handle RSVP button clicks
  const handleRsvp = (status) => {
    if (onRsvp) {
      onRsvp(event._id || event.event_id || event.id, status);
    }
  };
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
            {event.participants.map((participant, index) => {
              // Get RSVP status (default to 'Pending' if missing)
              const status = participant.status || 'Pending';
              
              // Determine status color based on status value (case-insensitive)
              const statusLower = status.toLowerCase();
              let statusColor;
              if (statusLower === 'accepted') {
                statusColor = 'success.main';
              } else if (statusLower === 'declined') {
                statusColor = 'error.main';
              } else if (statusLower === 'maybe') {
                statusColor = 'warning.main';
              } else {
                statusColor = 'text.secondary';
              }

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    p: 1,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                  <Typography 
                    variant="caption"
                    sx={{
                      color: statusColor,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}
                  >
                    {status}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* RSVP Buttons Section */}
      {canRsvp && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
            Your Response:
          </Typography>
          <ButtonGroup fullWidth variant="outlined" sx={{ gap: 1 }}>
            <Button
              onClick={() => handleRsvp('Accepted')}
              disabled={currentUserStatus === 'accepted'}
              variant={currentUserStatus === 'accepted' ? 'contained' : 'outlined'}
              color="success"
              sx={{ 
                flex: 1,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() => handleRsvp('Maybe')}
              disabled={currentUserStatus === 'maybe'}
              variant={currentUserStatus === 'maybe' ? 'contained' : 'outlined'}
              color="warning"
              sx={{ 
                flex: 1,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Maybe
            </Button>
            <Button
              onClick={() => handleRsvp('Declined')}
              disabled={currentUserStatus === 'declined'}
              variant={currentUserStatus === 'declined' ? 'contained' : 'outlined'}
              color="error"
              sx={{ 
                flex: 1,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              No
            </Button>
          </ButtonGroup>
        </Box>
      )}
      
      {/* Note: Edit and Delete buttons are handled by the scheduler library */}
    </Box>
  );
};

export default EventDetailsPopup;
