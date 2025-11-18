import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import VoiceNPSChat from "./Components/RateUs.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import CourseLanding from "./Pages/shop/CourseLanding.jsx";
import CoursePlayer from "./Pages/shop/CoursePlayer.jsx";
import CourseComplete from "./Pages/shop/CourseComplete.jsx";
import CourseDashboard from "./Pages/shop/CourseDashboard.jsx";
import CourseLogin from "./Pages/shop/CourseLogin.jsx";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<VoiceNPSChat />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Shop/Course Demo Routes */}
        <Route path="/shop" element={<CourseLanding />} />
        <Route path="/shop/course" element={<CoursePlayer />} />
        <Route path="/shop/complete" element={<CourseComplete />} />
        <Route path="/shop/login" element={<CourseLogin />} />
        <Route path="/shop/dashboard" element={<CourseDashboard />} />
        {/* Fallback route */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
