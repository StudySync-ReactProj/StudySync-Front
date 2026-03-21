import React, { createContext, useContext, useState } from 'react';

/**
 * NotificationContext provides global notification state management
 * Used to display toast-like notifications across all protected pages
 */
const NotificationContext = createContext();

/**
 * NotificationProvider wraps the app and provides notification functionality
 * Must be placed above all components that need to use notifications
 */
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    title: '',
    message: '',
    severity: 'info',
  });

  /**
   * Display a notification with the provided details
   * Supports both signatures:
   * 1) showNotification({ title, message, severity })
   * 2) showNotification(message, severity, title)
   */
  const showNotification = (input, severityArg = 'info', titleArg = '') => {
    const config = typeof input === 'string'
      ? { title: titleArg, message: input, severity: severityArg }
      : (input || {});

    const {
      title = '',
      message = '',
      severity = 'info',
    } = config;

    setNotification({
      open: true,
      title,
      message,
      severity,
    });
  };

  /**
   * Close the current notification
   */
  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const value = {
    notification,
    showNotification,
    closeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to access notification context
 * @returns {Object} { notification, showNotification, closeNotification }
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
