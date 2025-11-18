import { useNavigate } from "react-router-dom";
import "./CourseLanding.css";

export default function CourseLanding() {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate("/shop/course");
  };

  const handleDemo = () => {
    navigate("/shop/login");
  };

  return (
    <div className="course-landing-container">
      <div className="course-hero">
        <div className="course-hero-content">
          <div className="course-badge">Best Seller</div>
          <h1 className="course-title">Introduction to Web Development</h1>
          <p className="course-subtitle">
            Master the fundamentals of web development with HTML, CSS, and JavaScript. 
            Build real-world projects and launch your career as a web developer.
          </p>
          
          <div className="course-meta">
            <div className="meta-item">
              <span className="meta-icon">👨‍🏫</span>
              <span>Instructor: Sarah Johnson</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>8 hours</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📚</span>
              <span>12 modules</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⭐</span>
              <span>4.8 (2,450 reviews)</span>
            </div>
          </div>

          <div className="course-pricing">
            <span className="price">$49.99</span>
            <span className="original-price">$99.99</span>
          </div>

          <div className="button-group">
            <button className="enroll-btn" onClick={handleEnroll}>
              Enroll Now
            </button>
            <button className="demo-btn" onClick={handleDemo}>
              Demo (Owner Login)
            </button>
          </div>
        </div>

        <div className="course-preview">
          <div className="video-placeholder">
            <div className="play-icon">▶</div>
            <p>Preview Course</p>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="content-section">
          <h2>What You'll Learn</h2>
          <div className="learning-points">
            <div className="point">✓ HTML5 and semantic markup</div>
            <div className="point">✓ CSS3 and modern layouts</div>
            <div className="point">✓ JavaScript fundamentals</div>
            <div className="point">✓ Responsive web design</div>
            <div className="point">✓ Building real-world projects</div>
            <div className="point">✓ Version control with Git</div>
          </div>
        </div>

        <div className="content-section">
          <h2>Course Curriculum</h2>
          <div className="curriculum">
            <div className="module">
              <div className="module-header">
                <span>Module 1: HTML Basics</span>
                <span>45 min</span>
              </div>
            </div>
            <div className="module">
              <div className="module-header">
                <span>Module 2: CSS Styling</span>
                <span>60 min</span>
              </div>
            </div>
            <div className="module">
              <div className="module-header">
                <span>Module 3: JavaScript Fundamentals</span>
                <span>90 min</span>
              </div>
            </div>
            <div className="module">
              <div className="module-header">
                <span>Module 4: Building Your First Website</span>
                <span>120 min</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2>About the Instructor</h2>
          <div className="instructor-card">
            <div className="instructor-avatar">SJ</div>
            <div className="instructor-info">
              <h3>Sarah Johnson</h3>
              <p>Senior Web Developer with 10+ years of experience</p>
              <div className="instructor-stats">
                <span>50,000+ students</span>
                <span>•</span>
                <span>15 courses</span>
                <span>•</span>
                <span>4.9 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

