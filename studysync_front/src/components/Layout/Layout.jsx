// src/components/Layout/Layout.jsx
import React from "react";
import PropTypes from "prop-types";
import Header from "../Header/Header.jsx";
import Notifications from "../Notifications/Notifications.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";

/**
 * Layout component - Provides consistent layout structure for protected routes
 * Includes the Header navigation and wraps page content
 * Renders global notifications for all pages using this layout
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Function} props.setTheme - Function to update theme
 */
const Layout = ({ children, theme, setTheme }) => {
  const { notification, closeNotification } = useNotification();

  return (
    <>
      <Header theme={theme} setTheme={setTheme} />

      {/* Global Notifications - available across all pages */}
      <Notifications
        open={notification.open}
        title={notification.title}
        message={notification.message}
        severity={notification.severity}
        onClose={closeNotification}
      />

      {/* Main content area - rendered page components */}
      <main className="content-container">
        {children}
      </main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.oneOf(["light", "dark"]).isRequired,
  setTheme: PropTypes.func.isRequired,
};

export default Layout;