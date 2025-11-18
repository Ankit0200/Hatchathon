import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseLogin.css";

export default function CourseLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Mock credentials - in production, this would be handled by backend
  const MOCK_CREDENTIALS = {
    email: "owner@course.com",
    password: "course123"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Simple mock authentication
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      // Store login state in localStorage
      localStorage.setItem("courseOwnerLoggedIn", "true");
      localStorage.setItem("courseOwnerEmail", email);
      
      // Redirect to course dashboard
      navigate("/shop/dashboard");
    } else {
      setError("Invalid email or password. Use: owner@course.com / course123");
    }
  };

  return (
    <div className="course-login-container">
      <div className="login-background"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🎓</div>
          <h1>Course Owner Login</h1>
          <p>Access your course analytics dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@course.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-note">
            <strong>Demo Credentials:</strong><br />
            Email: owner@course.com<br />
            Password: course123
          </p>
        </div>
      </div>
    </div>
  );
}

