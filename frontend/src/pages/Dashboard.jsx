import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subjectsAPI, coursesAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, coursesRes] = await Promise.all([
        subjectsAPI.getAll(),
        coursesAPI.getAll()
      ]);
      
      setSubjects(subjectsRes.data.data || []);
      setCourses(coursesRes.data.courses || []);
      
      // Fetch enrolled courses
      try {
        const enrolledRes = await coursesAPI.getMyCourses();
        setEnrolledCourses(enrolledRes.data.courses || []);
      } catch (err) {
        console.log('Not enrolled in any courses yet');
      }

      // Fetch created courses for instructors
      if (isInstructor) {
        try {
          const createdRes = await coursesAPI.getMyCreatedCourses();
          setCreatedCourses(createdRes.data.courses || []);
        } catch (err) {
          console.log('No created courses yet');
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await coursesAPI.enroll(courseId);
      fetchData(); // Refresh to show enrolled status
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course._id === courseId);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LMS</span>
          </Link>
          
          <nav className="header-nav">
            <button 
              className={`nav-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              Browse Courses
            </button>
            <button 
              className={`nav-btn ${activeTab === 'mycourses' ? 'active' : ''}`}
              onClick={() => setActiveTab('mycourses')}
            >
              My Courses
            </button>
            {isInstructor && (
              <button 
                className={`nav-btn ${activeTab === 'created' ? 'active' : ''}`}
                onClick={() => setActiveTab('created')}
              >
                My Created Courses
              </button>
            )}
          </nav>

          <div className="header-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role badge badge-primary">{user?.role}</span>
            </div>
            <button onClick={logout} className="btn-ghost">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Continue your learning journey</p>
          </section>

          {/* Tab Content */}
          {activeTab === 'browse' && (
            <section className="courses-section">
              <h2>Available Courses</h2>
              {loading ? (
                <div className="loading-grid">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="skeleton course-skeleton" />
                  ))}
                </div>
              ) : (
                <div className="courses-grid">
                  {courses.map((course, index) => (
                    <div 
                      key={course._id || course.id || index} 
                      className="course-card card card-glow"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="course-thumbnail">
                        <div className="thumbnail-placeholder">
                          📚
                        </div>
                      </div>
                      <div className="course-content">
                        <h3>{course.title}</h3>
                        <p className="course-description">
                          {course.description || 'Learn this course at your own pace'}
                        </p>
                        <div className="course-meta">
                          <span className="badge badge-primary">{course.category || 'Course'}</span>
                          <span className="course-price">
                            {course.price === 0 ? 'Free' : `$${course.price}`}
                          </span>
                        </div>
                        <div className="course-actions">
                          {isEnrolled(course._id || course.id) ? (
                            <Link 
                              to={`/course/${course._id || course.id}`}
                              className="btn-primary"
                            >
                              Continue Learning
                            </Link>
                          ) : (
                            <button 
                              onClick={() => handleEnroll(course._id || course.id)}
                              className="btn-primary"
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!loading && courses.length === 0 && (
                <div className="empty-state">
                  <p>No courses available yet</p>
                </div>
              )}
            </section>
          )}

          {activeTab === 'mycourses' && (
            <section className="courses-section">
              <h2>My Enrolled Courses</h2>
              {loading ? (
                <div className="loading-grid">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton course-skeleton" />
                  ))}
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div className="courses-grid">
                  {enrolledCourses.map((course, index) => (
                    <div 
                      key={course._id || course.id || index} 
                      className="course-card card card-glow"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="course-thumbnail">
                        <div className="thumbnail-placeholder">
                          📚
                        </div>
                      </div>
                      <div className="course-content">
                        <h3>{course.title}</h3>
                        <p className="course-description">
                          {course.description || 'Continue learning'}
                        </p>
                        <div className="course-progress">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${course.progress || 0}%` }}
                            />
                          </div>
                          <span className="progress-text">{course.progress || 0}% complete</span>
                        </div>
                        <div className="course-actions">
                          <Link 
                            to={`/course/${course._id || course.id}`}
                            className="btn-primary"
                          >
                            Continue Learning
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📖</div>
                  <h3>No courses yet</h3>
                  <p>Start learning by enrolling in a course</p>
                  <button 
                    onClick={() => setActiveTab('browse')}
                    className="btn-primary mt-md"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </section>
          )}

          {activeTab === 'created' && isInstructor && (
            <section className="courses-section">
              <h2>My Created Courses</h2>
              <div className="section-actions">
                <button className="btn-primary">
                  + Create New Course
                </button>
              </div>
              {loading ? (
                <div className="loading-grid">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="skeleton course-skeleton" />
                  ))}
                </div>
              ) : createdCourses.length > 0 ? (
                <div className="courses-grid">
                  {createdCourses.map((course, index) => (
                    <div 
                      key={course._id || course.id || index} 
                      className="course-card card card-glow"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="course-thumbnail">
                        <div className="thumbnail-placeholder">
                          📚
                        </div>
                      </div>
                      <div className="course-content">
                        <h3>{course.title}</h3>
                        <p className="course-description">
                          {course.description || 'Manage your course'}
                        </p>
                        <div className="course-meta">
                          <span className="badge badge-primary">{course.category || 'Course'}</span>
                          <span className="students-count">
                            {course.enrolledStudents?.length || 0} students
                          </span>
                        </div>
                        <div className="course-actions">
                          <Link 
                            to={`/course/${course._id || course.id}/edit`}
                            className="btn-secondary"
                          >
                            Edit Course
                          </Link>
                          <Link 
                            to={`/course/${course._id || course.id}`}
                            className="btn-primary"
                          >
                            Preview
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No courses created yet</h3>
                  <p>Start creating your own courses to share with students</p>
                  <button className="btn-primary mt-md">
                    + Create Your First Course
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
