import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CourseFeedback from "./CourseFeedback.jsx";
import "./CourseComplete.css";

export default function CourseComplete() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const businessCategory = searchParams.get("business_category") || "online_course";
  const courseId = searchParams.get("course_id") || "webdev101";

  useEffect(() => {
    // Update URL to include business category for the widget
    if (!searchParams.get("business_category")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("business_category", businessCategory);
      newParams.set("course_id", courseId);
      window.history.replaceState({}, "", `?${newParams.toString()}`);
    }
  }, [searchParams, businessCategory, courseId]);

  useEffect(() => {
    // Auto-open feedback popup after a short delay
    const timer = setTimeout(() => {
      setShowFeedbackPopup(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="course-complete-container">
      <div className="completion-hero">
        <div className="certificate-icon">🎓</div>
        <h1>Congratulations!</h1>
        <p className="completion-message">
          You've successfully completed <strong>Introduction to Web Development</strong>
        </p>
        <div className="certificate-preview">
          <div className="certificate">
            <div className="certificate-header">
              <h2>Certificate of Completion</h2>
            </div>
            <div className="certificate-body">
              <p>This certifies that</p>
              <h3>Student Name</h3>
              <p>has successfully completed the course</p>
              <h4>Introduction to Web Development</h4>
              <div className="certificate-date">
                <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="certificate-footer">
              <div className="signature">
                <div className="signature-line"></div>
                <p>Sarah Johnson</p>
                <p className="signature-title">Course Instructor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="feedback-section">
        <div className="feedback-header">
          <h2>How was your learning experience?</h2>
          <p>Your feedback helps us improve our courses and helps other students make informed decisions.</p>
          <button 
            className="open-feedback-btn"
            onClick={() => setShowFeedbackPopup(true)}
          >
            Share Your Feedback
          </button>
        </div>
      </div>

      {/* Feedback Popup */}
      <CourseFeedback 
        isOpen={showFeedbackPopup} 
        onClose={() => setShowFeedbackPopup(false)} 
      />

      <div className="next-steps">
        <h3>What's Next?</h3>
        <div className="next-steps-grid">
          <div className="next-step-card">
            <div className="step-icon">📚</div>
            <h4>Explore More Courses</h4>
            <p>Continue your learning journey with our advanced courses</p>
            <button className="step-btn" onClick={() => navigate("/shop")}>
              Browse Courses
            </button>
          </div>
          <div className="next-step-card">
            <div className="step-icon">📊</div>
            <h4>View Your Progress</h4>
            <p>Track your learning achievements and certificates</p>
            <button className="step-btn" onClick={() => navigate("/dashboard")}>
              View Dashboard
            </button>
          </div>
          <div className="next-step-card">
            <div className="step-icon">💼</div>
            <h4>Build Your Portfolio</h4>
            <p>Showcase your projects and skills to employers</p>
            <button className="step-btn">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}

