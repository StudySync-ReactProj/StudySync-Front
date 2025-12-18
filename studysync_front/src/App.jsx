// src/App.jsx
import { useState } from "react";
import Theme from "./MuiTheme.style.js";
import { ThemeProvider } from "@mui/material/styles";
import Login from "./pages/Login/Login.jsx";
import HomePage from "./pages/Dashboard/Dashboard.jsx";
import TasksPage from "./pages/TasksPage/TasksPage.jsx";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  // 'login' | 'home' | 'tasks'

  // Navigation logic
  const navigateToLogin = () => setCurrentPage("login");
  const navigateToHome = () => setCurrentPage("home");
  const navigateToTasks = () => setCurrentPage("tasks");

  return (
    <ThemeProvider theme={Theme}>
      {currentPage === "login" && (
        <Login onLoginSuccess={navigateToHome} />
      )}

      {currentPage === "home" && (
        <HomePage
          onLogout={navigateToLogin}
          onGoToTasks={navigateToTasks}
        />
      )}

      {currentPage === "tasks" && (
        <TasksPage
          onLogout={navigateToLogin}
          onGoToTasks={navigateToTasks}
          onGoToHome={navigateToHome}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
