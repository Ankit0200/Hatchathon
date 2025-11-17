import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./Pages/Home/Home.jsx";
import VoiceNPSChat from "./Components/RateUs.jsx";
import Dashboard from "./Components/Dashboard.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Dashboard />
  </StrictMode>,
)
