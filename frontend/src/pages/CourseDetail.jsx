import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI, videoProgressAPI } from '../services/api';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoProgressMap, setVideoProgressMap] = useState({});
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Save progress when video time updates
  useEffect(() => {
    if (videoRef.current && currentVideo && videoDuration > 0) {
      const saveProgress = async () => {
        try {
          await videoProgressAPI.updateProgress({
            videoId: currentVideo._id,
            watchedTime: Math.floor(watchedTime),
            duration: Math.floor(videoDuration)
          });
        } catch (err) {
          console.error('Failed to save progress:', err);
        }
      };

      // Save every 10 seconds
      const interval = setInterval(saveProgress, 10000);
      return () => clearInterval(interval);
    }
  }, [watchedTime, videoDuration, currentVideo]);

  const fetchCourse = async () => {
    try {
      setVideoLoaded(false); // Reset video loaded state
      const response = await coursesAPI.getById(id);
      const courseData = response.data.course || response.data;
      setCourse(courseData);
      
      // Fetch all video progress for this course
      let progressData = {};
      try {
        const progressResponse = await videoProgressAPI.getCourseProgress(id);
        if (progressResponse.data.progress) {
          progressData = progressResponse.data.progress;
          setVideoProgressMap(progressData);
        }
      } catch (err) {
        console.log('No course progress found');
      }
      
      // Set first video as current if available
      if (courseData.sections && courseData.sections.length > 0) {
        const firstSection = courseData.sections[0];
        if (firstSection.videos && firstSection.videos.length > 0) {
          const firstVideo = firstSection.videos[0];
          // Get saved progress if available
          const savedProgress = progressData[firstVideo._id];
          const savedTime = savedProgress?.watchedTime || 0;
          
          setCurrentSection(firstSection);
          setCurrentVideo(firstVideo);
          setWatchedTime(savedTime);
          setVideoLoaded(true); // Video is now ready with correct start time
        }
      } else if (courseData.lessons && courseData.lessons.length > 0) {
        // Fallback to lessons if no sections
        const firstLesson = courseData.lessons[0];
        const savedProgress = progressData[firstLesson._id];
        const savedTime = savedProgress?.watchedTime || 0;
        setCurrentVideo(firstLesson);
        setWatchedTime(savedTime);
        setVideoLoaded(true);
      }
    } catch (err) {
      console.error('Failed to fetch course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video, section) => {
    // Get saved progress for this video before switching
    const savedProgress = videoProgressMap[video._id];
    const savedTime = savedProgress?.watchedTime || 0;
    
    setCurrentVideo(video);
    setCurrentSection(section);
    setWatchedTime(savedTime);
    setVideoProgress(0);
    setVideoLoaded(true); // Video is now ready with correct start time
    
    // For non-YouTube videos, seek to saved position after video loads
    if (videoRef.current && savedTime > 0) {
      const isYouTube = isYouTubeVideo(video.videoUrl || video.url);
      if (!isYouTube) {
        // Will be applied in handleLoadedMetadata
      }
    }
  };

  const playRandomVideo = () => {
    if (!course) return;
    
    // Collect all videos from all sections
    const allVideos = [];
    
    if (course.sections && course.sections.length > 0) {
      course.sections.forEach((section) => {
        if (section.videos && section.videos.length > 0) {
          section.videos.forEach((video) => {
            allVideos.push({ video, section });
          });
        }
      });
    } else if (course.lessons && course.lessons.length > 0) {
      // Fallback to lessons if no sections
      course.lessons.forEach((lesson) => {
        allVideos.push({ video: lesson, section: null });
      });
    }
    
    // Pick a random video
    if (allVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * allVideos.length);
      const randomVideo = allVideos[randomIndex];
      handleVideoSelect(randomVideo.video, randomVideo.section);
    }
  };

  const handleLoadedMetadata = (e) => {
    const duration = e.target.duration;
    setVideoDuration(duration);
    
    // Check for saved progress - either from videoProgressMap or from handleVideoSelect
    let savedTime = 0;
    
    // First check if we have it in state (passed from handleVideoSelect)
    if (watchedTime > 0 && watchedTime < duration * 0.95) {
      savedTime = watchedTime;
    } else if (currentVideo && videoProgressMap[currentVideo._id]) {
      // Fallback to videoProgressMap
      savedTime = videoProgressMap[currentVideo._id].watchedTime;
    }
    
    // Resume from saved position if valid
    if (savedTime > 0 && savedTime < duration * 0.95) {
      e.target.currentTime = savedTime;
      setWatchedTime(savedTime);
    }
  };

  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    setWatchedTime(currentTime);
    
    if (duration > 0) {
      const progress = (currentTime / duration) * 100;
      setVideoProgress(progress);
    }
  };

  const handleVideoEnded = async () => {
    if (currentVideo) {
      try {
        await videoProgressAPI.updateProgress({
          videoId: currentVideo._id,
          watchedTime: videoDuration,
          duration: videoDuration
        });
        
        // Update local progress map
        setVideoProgressMap(prev => ({
          ...prev,
          [currentVideo._id]: {
            watchedTime: videoDuration,
            completed: true
          }
        }));
      } catch (err) {
        console.error('Failed to mark as complete:', err);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Check if URL is a YouTube video
  const isYouTubeVideo = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // Get YouTube embed URL with optional start time
  const getYouTubeEmbedUrl = (url, startTime = 0) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    // Check for timestamp in URL (e.g., ?t=300s or &t=300s)
    const timestampMatch = url.match(/[?&]t=(\d+)/);
    const urlTime = timestampMatch ? parseInt(timestampMatch[1]) : 0;
    
    // Use provided startTime, URL timestamp, or 0
    const start = startTime || urlTime;
    
    return `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=0`;
  };

  const getVideoProgressPercentage = (videoId) => {
    const progress = videoProgressMap[videoId];
    if (!progress) return 0;
    return progress.completed ? 100 : 0;
  };

  const isVideoCompleted = (videoId) => {
    const progress = videoProgressMap[videoId];
    return progress?.completed || false;
  };

  if (loading) {
    return (
      <div className="course-detail">
        <div className="loading-container">
          <div className="skeleton" style={{ height: '400px' }} />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail">
        <div className="container">
          <div className="empty-state">
            <h2>Course not found</h2>
            <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail">
      {/* Header */}
      <header className="course-header">
        <Link to="/dashboard" className="back-btn">
          ← Back to Courses
        </Link>
        <h1>{course.title}</h1>
      </header>

      <div className="course-content-wrapper">
        {/* Video Player */}
        <div className="video-section">
          {currentVideo ? (
            <>
              <div className="video-container">
                {isYouTubeVideo(currentVideo.videoUrl || currentVideo.url) ? (
                  videoLoaded ? (
                    <iframe
                      key={`${currentVideo._id}-${watchedTime}`}
                      src={getYouTubeEmbedUrl(currentVideo.videoUrl || currentVideo.url, watchedTime)}
                      title={currentVideo.title}
                      className="video-player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="video-loading">Loading video...</div>
                  )
                ) : (
                  <video
                    ref={videoRef}
                    key={currentVideo._id}
                    controls
                    className="video-player"
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                  >
                    <source src={currentVideo.videoUrl || currentVideo.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div className="video-info">
                <div className="video-title-row">
                  <h2>{currentVideo.title}</h2>
                  <button className="random-video-btn" onClick={playRandomVideo}>
                    🎲 Play Random Video
                  </button>
                </div>
                <p>{currentVideo.description || 'Watch this video to continue learning'}</p>
                <div className="video-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${videoProgress}%` }} />
                  </div>
                  <span>{formatTime(watchedTime)} / {formatTime(videoDuration)} ({Math.round(videoProgress)}%)</span>
                  {watchedTime > 0 && videoProgress < 95 && (
                    <button 
                      className="resume-btn"
                      onClick={() => videoRef.current && (videoRef.current.currentTime = watchedTime)}
                    >
                      Resume from {formatTime(watchedTime)}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-video">
              <div className="no-video-icon">📹</div>
              <h3>No video available</h3>
              <p>Select a video from the sidebar to start learning</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={`course-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '→' : '←'}
          </button>
          
          <div className="sidebar-content">
            <h3>Course Content</h3>
            {course.sections && course.sections.length > 0 ? (
              <div className="sections-list">
                {course.sections.map((section, sectionIndex) => (
                  <div key={section._id || sectionIndex} className="section-item">
                    <div className="section-header">
                      <span className="section-number">{sectionIndex + 1}</span>
                      <h4>{section.title}</h4>
                    </div>
                    {section.videos && section.videos.length > 0 && (
                      <div className="videos-list">
                        {section.videos.map((video, videoIndex) => (
                          <button
                            key={video._id || videoIndex}
                            className={`video-item ${currentVideo?._id === video._id ? 'active' : ''}`}
                            onClick={() => handleVideoSelect(video, section)}
                          >
                            <span className="video-icon">
                              {isVideoCompleted(video._id) ? '✓' : '▶'}
                            </span>
                            <span className="video-title">{video.title}</span>
                            <span className="video-duration">{video.duration ? formatTime(video.duration) : '0:00'}</span>
                            {isVideoCompleted(video._id) && (
                              <span className="completed-badge">Completed</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : course.lessons && course.lessons.length > 0 ? (
              <div className="videos-list">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson._id || index}
                    className={`video-item ${currentVideo?._id === lesson._id ? 'active' : ''}`}
                    onClick={() => setCurrentVideo(lesson)}
                  >
                    <span className="video-icon">▶</span>
                    <span className="video-title">{lesson.title}</span>
                    <span className="video-duration">{lesson.duration || '0:00'}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-content">No course content available</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
