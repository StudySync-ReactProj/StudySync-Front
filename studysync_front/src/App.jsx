import { useState } from 'react'
import Theme from './MuiTheme.style.js'
import { ThemeProvider } from "@mui/material/styles"
import Login from './pages/Login/Login.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider theme={Theme}>
      <Login />
    </ThemeProvider >
  )
}

export default App
