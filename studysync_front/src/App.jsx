import Theme from "./MuiTheme.style.js";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login/Login.jsx";
import TasksPage from "./pages/TasksPage/TasksPage.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/TasksPage" element={<TasksPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </ThemeProvider>
  );
}


export default App;