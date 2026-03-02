import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    const result = await register({ name, email, password, role });
    
    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">LMS</span>
            </div>
            <h1>Create Account</h1>
            <p>Join us and start learning today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">I am a</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-content">
            <h2>Start Your Journey</h2>
            <p>Join thousands of learners worldwide</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Expert-led Courses</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Track Progress</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Certificates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
