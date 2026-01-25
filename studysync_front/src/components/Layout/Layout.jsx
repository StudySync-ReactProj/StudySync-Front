// src/components/Layout/Layout.jsx
import React from "react";
import PropTypes from "prop-types";
import Header from "../Header/Header.jsx";

/**
 * Layout component - Provides consistent layout structure for protected routes
 * Includes the Header navigation and wraps page content
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Function} props.setTheme - Function to update theme
 */
const Layout = ({ children, theme, setTheme }) => {
  return (
    <>
      <Header theme={theme} setTheme={setTheme} />
      
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