// src/utils/dateUtils.js

/**
 * =============================================================================
 * DATE UTILITIES
 * =============================================================================
 * 
 * This file contains all date and time formatting helper functions used
 * throughout the calendar application.
 * 
 * Functions:
 * - getCurrentTime(): Returns current time formatted for the scheduler
 * - formatDate(): Converts date objects to readable strings
 * - getTimeRange(): Formats start and end times as a range string
 * 
 * Purpose: Centralizes date manipulation logic to avoid duplication and
 * ensure consistent date formatting across the application.
 * =============================================================================
 */

/**
 * Get current time formatted as HH:MM for scheduler
 * @returns {string} Time string in format "HH:MM"
 */
export const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get time range string from start and end dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {string} Time range string
 */
export const getTimeRange = (start, end) => {
  const startTime = new Date(start).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTime = new Date(end).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${startTime} - ${endTime}`;
};
