import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
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
            <h1>Welcome Back</h1>
            <p>Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create one</Link>
            </p>
          </div>
        </div>

        <div className="auth-decoration">
          <div className="decoration-content">
            <h2>Learn Anywhere, Anytime</h2>
            <p>Access premium courses and track your progress</p>
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

export default Login;
