import { useState } from "react";
import VoiceFeedbackChat from "../Components/RateUs";
import Dashboard from "../Components/Dashboard";

export default function HomePage() {
  const [currentView, setCurrentView] = useState("rating"); // "rating" or "dashboard"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎤</span>
              <h1 className="text-xl font-bold text-gray-900">Voice NPS Feedback</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView("rating")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentView === "rating"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentView === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📊 Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-4">
        {currentView === "rating" ? <VoiceFeedbackChat /> : <Dashboard />}
      </div>
    </div>
  );
}
