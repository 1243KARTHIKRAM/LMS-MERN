import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import './CourseEditor.css';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Section/Video management
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(null); // sectionId
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    isFree: false
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await coursesAPI.getById(id);
      setCourse(response.data.course || response.data);
    } catch (err) {
      setError('Failed to load course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const response = await coursesAPI.addSection(id, newSection);
      setCourse(response.data.course);
      setNewSection({ title: '', description: '' });
      setShowAddSection(false);
    } catch (err) {
      setError('Failed to add section');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Are you sure you want to delete this section and all its videos?')) return;
    
    setSaving(true);
    setError('');
    
    try {
      const response = await coursesAPI.deleteSection(id, sectionId);
      setCourse(response.data.course);
    } catch (err) {
      setError('Failed to delete section');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddVideo = async (e, sectionId) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const response = await coursesAPI.addVideo(id, sectionId, newVideo);
      setCourse(response.data.course);
      setNewVideo({
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        isFree: false
      });
      setShowAddVideo(null);
    } catch (err) {
      setError('Failed to add video');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (sectionId, videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setSaving(true);
    setError('');
    
    try {
      const response = await coursesAPI.deleteVideo(id, sectionId, videoId);
      setCourse(response.data.course);
    } catch (err) {
      setError('Failed to delete video');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateVideo = async (sectionId, videoId, data) => {
    setSaving(true);
    setError('');
    
    try {
      const response = await coursesAPI.updateVideo(id, sectionId, videoId, data);
      setCourse(response.data.course);
    } catch (err) {
      setError('Failed to update video');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="course-editor">
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-editor">
        <div className="error-container">
          <h2>Course not found</h2>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-editor">
      <header className="editor-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-btn">← Back</Link>
          <h1>Edit Course: {course.title}</h1>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate(`/course/${id}`)}
          >
            Preview Course
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="editor-content">
        <section className="sections-manager">
          <div className="section-header">
            <h2>Course Content</h2>
            <button 
              className="btn-secondary"
              onClick={() => setShowAddSection(true)}
            >
              + Add Section
            </button>
          </div>

          {showAddSection && (
            <form className="add-form" onSubmit={handleAddSection}>
              <h3>Add New Section</h3>
              <div className="form-group">
                <label>Section Title</label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  placeholder="e.g., Introduction, Getting Started"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  placeholder="What will students learn in this section?"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddSection(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Adding...' : 'Add Section'}
                </button>
              </div>
            </form>
          )}

          <div className="sections-list">
            {course.sections && course.sections.length > 0 ? (
              course.sections.map((section, sectionIndex) => (
                <div key={section._id || sectionIndex} className="section-card">
                  <div className="section-card-header">
                    <div className="section-info">
                      <span className="section-number">{sectionIndex + 1}</span>
                      <div>
                        <h3>{section.title}</h3>
                        {section.description && <p>{section.description}</p>}
                        <span className="video-count">
                          {section.videos?.length || 0} video{section.videos?.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="section-actions">
                      <button 
                        className="btn-icon"
                        onClick={() => setShowAddVideo(section._id)}
                        title="Add Video"
                      >
                        +
                      </button>
                      <button 
                        className="btn-icon delete"
                        onClick={() => handleDeleteSection(section._id)}
                        title="Delete Section"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {showAddVideo === section._id && (
                    <form className="add-video-form" onSubmit={(e) => handleAddVideo(e, section._id)}>
                      <h4>Add Video</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Video Title</label>
                          <input
                            type="text"
                            value={newVideo.title}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                            placeholder="e.g., Welcome to the Course"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration (seconds)</label>
                          <input
                            type="number"
                            value={newVideo.duration}
                            onChange={(e) => setNewVideo({ ...newVideo, duration: parseInt(e.target.value) || 0 })}
                            placeholder="300"
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Video URL</label>
                        <input
                          type="url"
                          value={newVideo.videoUrl}
                          onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                          placeholder="https://example.com/video.mp4"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={newVideo.description}
                          onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                          placeholder="What will students learn in this video?"
                        />
                      </div>
                      <div className="form-group checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={newVideo.isFree}
                            onChange={(e) => setNewVideo({ ...newVideo, isFree: e.target.checked })}
                          />
                          Free Preview
                        </label>
                      </div>
                      <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => setShowAddVideo(null)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={saving}>
                          {saving ? 'Adding...' : 'Add Video'}
                        </button>
                      </div>
                    </form>
                  )}

                  {section.videos && section.videos.length > 0 && (
                    <div className="videos-list">
                      {section.videos.map((video, videoIndex) => (
                        <div key={video._id || videoIndex} className="video-item">
                          <div className="video-info">
                            <span className="video-number">{videoIndex + 1}</span>
                            <div>
                              <h4>{video.title}</h4>
                              <p>{video.description}</p>
                              <span className="video-meta">
                                {formatDuration(video.duration)} 
                                {video.isFree && <span className="free-badge">Free</span>}
                              </span>
                            </div>
                          </div>
                          <div className="video-actions">
                            <a 
                              href={video.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-link"
                            >
                              Preview
                            </a>
                            <button 
                              className="btn-icon delete"
                              onClick={() => handleDeleteVideo(section._id, video._id)}
                              title="Delete Video"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!section.videos || section.videos.length === 0) && (
                    <div className="empty-videos">
                      <p>No videos in this section yet.</p>
                      <button 
                        className="btn-secondary"
                        onClick={() => setShowAddVideo(section._id)}
                      >
                        + Add First Video
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-sections">
                <h3>No sections yet</h3>
                <p>Start by adding sections to organize your course content.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddSection(true)}
                >
                  + Add First Section
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseEditor;
