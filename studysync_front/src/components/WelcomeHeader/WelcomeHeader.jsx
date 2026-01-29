import React from 'react';
import MainTitle from '../MainTitle/MainTitle.jsx';

/**
 * WelcomeHeader - Display personalized greeting based on time of day
 * @param {string} username - User's display name
 */
const WelcomeHeader = ({ username = 'User' }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 22) return "Good evening";
    return "Good night";
  };

  return <MainTitle title={`${getGreeting()}, ${username}!`} />;
};

export default WelcomeHeader;
