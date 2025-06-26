import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/dashboard.css';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/secured', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setIsAuthenticated(true);
          setUser(userData);
          console.log('User is authenticated:', userData);
        } else if (response.status === 401) {
          console.log('User is not authenticated');
          window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/spotify'; 
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="nav-brand">
            <span className="brand-icon">🎵</span>
            <span className="brand-text">Spotify Analyzer</span>
          </div>
          <div className="nav-user">
            <div className="user-info">
              <span className="user-name">{user?.name || 'Music Lover'}</span>
              <span className="user-id">#{user?.id|| 'user'}</span>
            </div>
            <Link to="/logout" className="logout-btn">
              <span>Log Out</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Compact */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="welcome-message">
            <h1 className="hero-title">
              Welcome back, <span className="user-highlight">{user?.name || 'Music Lover'}</span>! 🎵
            </h1>
            <p className="hero-subtitle">
              Ready to dive into your musical universe? Let's explore your playlists and discover new sounds.
            </p>
          </div>
          <div className="hero-stats">
            <div className="stat-badge">
              <span className="stat-icon">🎶</span>
              <span className="stat-text">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Compact */}
      <div className="quick-actions">
        <div className="quick-action-item">
          <Link to="/playlists" className="quick-btn primary">
            <span className="quick-icon">🎵</span>
            <span className="quick-text">Playlists</span>
          </Link>
        </div>
        <div className="quick-action-item">
          <button className="quick-btn secondary" disabled>
            <span className="quick-icon">📊</span>
            <span className="quick-text">Analytics</span>
          </button>
        </div>
        <div className="quick-action-item">
          <button className="quick-btn secondary" disabled>
            <span className="quick-icon">🔍</span>
            <span className="quick-text">Discover</span>
          </button>
        </div>
      </div>

      {/* Main Content Cards - Compact */}
      <div className="content-section">
        <h2 className="section-title">Features</h2>
        <div className="content-grid">
          <Link to="/playlists" className="feature-card active">
            <div className="feature-header">
              <div className="feature-icon">🎵</div>
              <div className="feature-badge available">Available</div>
            </div>
            <h3 className="feature-title">Your Playlists</h3>
            <p className="feature-description">
              Explore and play your Spotify playlists with embedded players
            </p>
            <div className="feature-footer">
              <span className="feature-action">Explore Now →</span>
            </div>
          </Link>

          <div className="feature-card upcoming">
            <div className="feature-header">
              <div className="feature-icon">📈</div>
              <div className="feature-badge coming-soon">Coming Soon</div>
            </div>
            <h3 className="feature-title">Music Analytics</h3>
            <p className="feature-description">
              Deep insights into your listening habits and preferences
            </p>
            <div className="feature-footer">
              <span className="feature-action">Coming Soon</span>
            </div>
          </div>

          <div className="feature-card upcoming">
            <div className="feature-header">
              <div className="feature-icon">🎨</div>
              <div className="feature-badge coming-soon">Coming Soon</div>
            </div>
            <h3 className="feature-title">Playlist Generator</h3>
            <p className="feature-description">
              Create custom playlists using AI and mood analysis
            </p>
            <div className="feature-footer">
              <span className="feature-action">Coming Soon</span>
            </div>
          </div>

          <div className="feature-card upcoming">
            <div className="feature-header">
              <div className="feature-icon">🔍</div>
              <div className="feature-badge coming-soon">Coming Soon</div>
            </div>
            <h3 className="feature-title">Smart Recommendations</h3>
            <p className="feature-description">
              Get personalized music recommendations based on your taste
            </p>
            <div className="feature-footer">
              <span className="feature-action">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;