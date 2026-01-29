import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

/**
 * UserContext provides centralized access to user data
 * This eliminates duplicate user fetching across components
 */
const UserContext = createContext();

/**
 * UserProvider wraps the app and provides user state from Redux
 * In the future, this could be enhanced to fetch user profile data from API
 */
export const UserProvider = ({ children }) => {
  // Get user from Redux store (already manages login/logout)
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const value = {
    user,
    isLoggedIn,
    username: user?.username || 'User',
    email: user?.email,
    token: user?.token,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to access user context
 * @returns {Object} { user, isLoggedIn, username, email, token }
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
