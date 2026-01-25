import getMuiTheme from "./MuiTheme.style.js";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import TasksPage from "./pages/TasksPage/TasksPage.jsx";
import CalendarSync from "./pages/CalendarSync/CalendarSync.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useEffect } from "react";
import Layout from "./components/Layout/Layout.jsx";

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // if not logined in redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // if logged in redirect to dashboard
  return children;
}


function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const muiTheme = getMuiTheme(theme);



  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    
    // Cleanup function to remove theme class on unmount
    return () => {
      document.body.classList.remove("light", "dark");
    };
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Routes>

        {/* Redirect based on authentication status */}
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Signup route */}
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout theme={theme} setTheme={setTheme}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Tasks page route */}
        <Route
          path="/TasksPage"
          element={
            <ProtectedRoute>
              <Layout theme={theme} setTheme={setTheme}>
                <TasksPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Calendar Sync route */}
        <Route
          path="/CalendarSync"
          element={
            <ProtectedRoute>
              <Layout theme={theme} setTheme={setTheme}>
                <CalendarSync />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </ThemeProvider>
  );
}
export default App;