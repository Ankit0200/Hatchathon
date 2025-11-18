import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CoursePlayer.css";

export default function CoursePlayer() {
  const navigate = useNavigate();
  const [currentModule, setCurrentModule] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);
  const totalModules = 4;

  // Coding-related video URLs for each module (short sample videos for demo)
  // Replace these with your actual coding tutorial videos
  const videoUrls = {
    1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // HTML Basics
    2: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // CSS Styling  
    3: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // JavaScript Fundamentals
    4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" // Building Website
  };

  const [watchedModules, setWatchedModules] = useState(new Set());

  useEffect(() => {
    // Reset video when module changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setVideoProgress(0);
      setIsPlaying(false);
    }
    
    // Mark module as watched when user interacts with it
    setWatchedModules(prev => new Set([...prev, currentModule]));
  }, [currentModule]);

  useEffect(() => {
    // Update course progress based on watched modules
    const watchedCount = watchedModules.size;
    const newProgress = (watchedCount / totalModules) * 100;
    setProgress(newProgress);
    
    // Mark as completed when all modules are watched
    // Check if all modules 1-4 are in the watchedModules set
    const allModulesWatched = [1, 2, 3, 4].every(module => watchedModules.has(module));
    
    if (allModulesWatched && watchedCount >= totalModules) {
      setIsCompleted(true);
      setProgress(100);
      console.log("✅ Course completed! All modules watched:", Array.from(watchedModules));
    } else {
      console.log("Progress:", watchedCount, "/", totalModules, "modules watched. Set:", Array.from(watchedModules));
    }
  }, [watchedModules, totalModules]);

  useEffect(() => {
    // Update video progress
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setVideoProgress(percent);
      }
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
      // Mark current module as fully watched
      setWatchedModules(prev => {
        const newSet = new Set([...prev, currentModule]);
        console.log(`Video ended for module ${currentModule}. Watched modules:`, Array.from(newSet));
        return newSet;
      });
      
      // Check if this was the last module
      if (currentModule === totalModules) {
        console.log("Last module completed! Course should be marked as complete.");
      } else if (currentModule < totalModules) {
        // Auto-advance to next module after short delay
        setTimeout(() => {
          setCurrentModule(prev => prev + 1);
        }, 2000);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleVideoEnd);
    
    // Mark module as watched when video starts playing
    const handlePlay = () => {
      setWatchedModules(prev => new Set([...prev, currentModule]));
    };
    video.addEventListener('play', handlePlay);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('play', handlePlay);
    };
  }, [currentModule, totalModules]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
      // Mark module as watched when user starts playing
      setWatchedModules(prev => new Set([...prev, currentModule]));
    }
  };

  const handlePrevious = () => {
    if (currentModule > 1) {
      setCurrentModule(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentModule < totalModules) {
      setCurrentModule(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    navigate("/shop/complete?business_category=online_course&course_id=webdev101");
  };

  return (
    <div className="course-player-container">
      <div className="player-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/shop")}>
            ← Back to Course
          </button>
          <h1>Introduction to Web Development</h1>
        </div>
        <div className="progress-indicator">
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="player-content">
        <div className="video-section">
          <div className="video-player">
            <div className="video-screen">
              {isCompleted ? (
                <div className="completion-overlay">
                  <div className="completion-icon">✓</div>
                  <h2>Course Complete!</h2>
                  <p>Congratulations! You've finished all {totalModules} modules.</p>
                  <button className="complete-course-btn-inline" onClick={handleComplete}>
                    Get Your Certificate
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={videoUrls[currentModule]}
                    className="course-video"
                    onClick={handlePlayPause}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  {!isPlaying && (
                    <div className="video-overlay" onClick={handlePlayPause}>
                      <div className="play-button-large">▶</div>
                      <p>Module {currentModule}: {getModuleName(currentModule)}</p>
                    </div>
                  )}
                  <div className="video-progress-bar">
                    <div 
                      className="video-progress-fill" 
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                </>
              )}
            </div>
            
            <div className="video-controls">
              <button 
                className="control-btn" 
                onClick={handlePrevious}
                disabled={currentModule === 1}
              >
                ⏮ Previous
              </button>
              <button 
                className="control-btn" 
                onClick={handlePlayPause}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <button 
                className="control-btn" 
                onClick={handleNext}
                disabled={currentModule === totalModules}
              >
                ⏭ Next
              </button>
            </div>
          </div>

          <div className="module-info">
            <h2>Module {currentModule}: {getModuleName(currentModule)}</h2>
            <p>{getModuleDescription(currentModule)}</p>
          </div>
        </div>

        <div className="sidebar">
          <div className="progress-card">
            <h3>Course Progress</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{Math.round(progress)}% Complete</p>
          </div>

          <div className="modules-list">
            <h3>Course Modules</h3>
            {[1, 2, 3, 4].map((module) => (
              <div
                key={module}
                className={`module-item ${currentModule === module ? 'active' : ''} ${module <= currentModule ? 'completed' : ''}`}
                onClick={() => setCurrentModule(module)}
              >
                <div className="module-number">
                  {module <= currentModule ? '✓' : module}
                </div>
                <div className="module-details">
                  <span className="module-title">Module {module}</span>
                  <span className="module-name">{getModuleName(module)}</span>
                </div>
              </div>
            ))}
          </div>

          {isCompleted && (
            <button className="complete-course-btn" onClick={handleComplete}>
              🎓 Complete Course & Get Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function getModuleName(module) {
  const names = {
    1: "HTML Basics",
    2: "CSS Styling",
    3: "JavaScript Fundamentals",
    4: "Building Your First Website"
  };
  return names[module] || "Module";
}

function getModuleDescription(module) {
  const descriptions = {
    1: "Learn the fundamentals of HTML5, semantic markup, and document structure.",
    2: "Master CSS3, flexbox, grid, and modern styling techniques.",
    3: "Understand JavaScript basics, variables, functions, and DOM manipulation.",
    4: "Put it all together and build a complete website from scratch."
  };
  return descriptions[module] || "Course content";
}

