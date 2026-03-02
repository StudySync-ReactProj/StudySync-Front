/**
 * Event utility functions for calendar event management
 */

/**
 * Determine the color for a calendar event based on its properties
 * @param {Object} event - The event object
 * @param {string} currentUserId - The current user's ID
 * @returns {string} Hex color code for the event
 */
export const getEventColor = (event, currentUserId) => {
  // Priority 1: Invited events (soft grey)
  if (event.isInvited) {
    return "#B0BEC5";
  }

  // Priority 2: Google Calendar events (Google blue)
  if (event.source === 'google') {
    return "#4285F4";
  }

  // Priority 3: User's own events (purple)
  // This includes both drafts and scheduled events created by the user
  if (event.status === 'Draft' || event.creator === currentUserId) {
    return "#C98BB9";
  }

  // Fallback: Default blue
  return "#2196f3";
};
