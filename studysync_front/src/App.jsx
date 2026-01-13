import Theme from "./MuiTheme.style.js";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import TasksPage from "./pages/TasksPage/TasksPage.jsx";
import CalendarSync from "./pages/CalendarSync/CalendarSync.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";

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

  return (
    <ThemeProvider theme={Theme}>
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

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Tasks page route */}
        <Route
          path="/TasksPage"
          element={<ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
          }
        />

        {/* Calendar Sync route */}
        <Route
          path="/CalendarSync"
          element={<ProtectedRoute>
            <CalendarSync />
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