import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';

const Login = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add a small delay for better UX
      setTimeout(() => {
        window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/spotify';
      }, 500);
    } catch (err) {
      console.error('An error occurred during login:', err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="floating-note note-1">🎵</div>
        <div className="floating-note note-2">🎶</div>
        <div className="floating-note note-3">🎵</div>
        <div className="floating-note note-4">🎶</div>
        <div className="floating-note note-5">🎵</div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo-section">
            <div className="logo-icon">🎧</div>
            <h1 className="app-title">Spotify Analyzer</h1>

          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="card-header">
            <div className="spotify-logo">
              <svg width="40" height="40" viewBox="0 0 168 168" fill="none">
                <path d="M83.996 0C37.563 0 0 37.563 0 83.996s37.563 83.996 83.996 83.996 83.996-37.563 83.996-83.996S130.429 0 83.996 0zM122.85 121.176c-1.299 2.137-4.077 2.804-6.214 1.505-17.036-10.405-38.476-12.766-63.747-6.991-2.424.553-4.847-0.956-5.4-3.38-.553-2.424.956-4.847 3.38-5.4 27.563-6.307 51.804-3.598 71.416 8.052 2.137 1.299 2.804 4.077 1.565 6.214zm8.877-19.726c-1.632 2.649-5.094 3.495-7.743 1.863-19.501-11.984-49.215-15.465-72.26-8.464-3.037.921-6.245-0.795-7.166-3.832-.921-3.037.795-6.245 3.832-7.166 26.354-8.021 59.338-4.133 82.071 9.756 2.649 1.632 3.495 5.094 1.266 7.843zm.763-20.533c-23.378-13.889-61.994-15.158-84.323-8.386-3.699 1.124-7.612-0.921-8.736-4.62-1.124-3.699.921-7.612 4.62-8.736 25.61-7.757 68.507-6.266 95.83 9.717 3.133 1.835 4.175 5.823 2.34 8.956-1.835 3.133-5.823 4.175-9.731 2.069z" fill="#1DB954"/>
              </svg>
            </div>
            <h2 className="login-title">Connect to Spotify</h2>
            <p className="login-subtitle">
              Sign in with your Spotify account to explore your music like never before
            </p>
          </div>

          <div className="features-preview">
            <div className="feature-item">
              <span className="feature-icon">🎵</span>
              <span className="feature-text">Browse your playlists</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎧</span>
              <span className="feature-text">Listen with embedded players</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Analyze your music taste</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={handleLogin} 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 168 168" fill="none">
                  <path d="M83.996 0C37.563 0 0 37.563 0 83.996s37.563 83.996 83.996 83.996 83.996-37.563 83.996-83.996S130.429 0 83.996 0zM122.85 121.176c-1.299 2.137-4.077 2.804-6.214 1.505-17.036-10.405-38.476-12.766-63.747-6.991-2.424.553-4.847-0.956-5.4-3.38-.553-2.424.956-4.847 3.38-5.4 27.563-6.307 51.804-3.598 71.416 8.052 2.137 1.299 2.804 4.077 1.565 6.214zm8.877-19.726c-1.632 2.649-5.094 3.495-7.743 1.863-19.501-11.984-49.215-15.465-72.26-8.464-3.037.921-6.245-0.795-7.166-3.832-.921-3.037.795-6.245 3.832-7.166 26.354-8.021 59.338-4.133 82.071 9.756 2.649 1.632 3.495 5.094 1.266 7.843zm.763-20.533c-23.378-13.889-61.994-15.158-84.323-8.386-3.699 1.124-7.612-0.921-8.736-4.62-1.124-3.699.921-7.612 4.62-8.736 25.61-7.757 68.507-6.266 95.83 9.717 3.133 1.835 4.175 5.823 2.34 8.956-1.835 3.133-5.823 4.175-9.731 2.069z" fill="currentColor"/>
                </svg>
                <span>Continue with Spotify</span>
              </>
            )}
          </button>

          <div className="login-footer">
            <p className="privacy-text">
              We will only access your public playlists 
              <br>
              </br>and basic profile information
            </p>
            <div className="security-badges">
              <span className="security-badge">🔒 Secure</span>
              <span className="security-badge"> 🛡️ Private</span>
              <span className="security-badge"> ✨ Free</span>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Login;