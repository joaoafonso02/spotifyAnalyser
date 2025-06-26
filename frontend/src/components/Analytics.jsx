import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Analytics.css';

/**
 * Analytics Component
 * 
 * Displays comprehensive music analytics including top artists, tracks, genres,
 * and listening statistics with dynamic time range selection.
 * 
 * Features:
 * - Top Artists with popularity metrics and genres
 * - Top Tracks with album information and popularity
 * - Listening Statistics (artist count, track count, genre diversity, avg popularity)
 * - Top Genres with frequency bars
 * - Dynamic time range filtering (Last 4 Weeks, Last 6 Months, All Time)
 * - Responsive grid layout
 * - Loading states and error handling
 * 
 * @returns {JSX.Element} Analytics dashboard component
 */
const Analytics = () => {
  // State management for analytics data and UI states
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChangingTimeRange, setIsChangingTimeRange] = useState(false);
  const [artistLimit, setArtistLimit] = useState(20); 
  const [trackLimit, setTrackLimit] = useState(20);

  /**
   * Fetches analytics data from backend API for specified time range
   * 
   * @param {string} selectedTimeRange - Spotify time range (short_term, medium_term, long_term)
   */
  const fetchAnalytics = async (selectedTimeRange, customArtistLimit = artistLimit, customTrackLimit = trackLimit) => {
    try {
      // Fetch top artists from backend
      const artistsUrl = `http://127.0.0.1:8080/analytics/top-artists?time_range=${selectedTimeRange}&limit=${customArtistLimit}`;
      const artistsResponse = await fetch(artistsUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        setTopArtists(artistsData);
      } else {
        setTopArtists([]);
      }
  
      // Fetch top tracks from backend
      const tracksUrl = `http://127.0.0.1:8080/analytics/top-tracks?time_range=${selectedTimeRange}&limit=${customTrackLimit}`;
      const tracksResponse = await fetch(tracksUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json();
        setTopTracks(tracksData);
      } else {
        setTopTracks([]);
      }
  
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setTopArtists([]);
      setTopTracks([]);
    }
  };

  /**
   * Handles artist limit changes
   * Updates the number of artists to display and refetches data
   * 
   * @param {number} newLimit - New limit for number of artists
   */
  const handleArtistLimitChange = async (newLimit) => {
    if (newLimit !== artistLimit && newLimit > 0 && newLimit <= 50) {
      setArtistLimit(newLimit);
      await fetchAnalytics(timeRange, newLimit, trackLimit);
    }
  };

  /**
   * Handles track limit changes
   * Updates the number of tracks to display and refetches data
   * 
   * @param {number} newLimit - New limit for number of tracks
   */
  const handleTrackLimitChange = async (newLimit) => {
    if (newLimit !== trackLimit && newLimit > 0 && newLimit <= 50) {
      setTrackLimit(newLimit);
      await fetchAnalytics(timeRange, artistLimit, newLimit);
    }
  };

  /**
   * Initial component mount effect
   * Checks user authentication and loads initial analytics data
   */
  useEffect(() => {
    const checkAuthenticationAndInitialize = async () => {
      try {
        setLoading(true);
        
        // Verify user authentication
        const authResponse = await fetch('http://127.0.0.1:8080/secured', {
          method: 'GET',
          credentials: 'include',
        });

        if (authResponse.ok) {
          setIsAuthenticated(true);
          await fetchAnalytics(timeRange);
        } else if (authResponse.status === 401) {
          // Redirect to Spotify OAuth if not authenticated
          window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/spotify';
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthenticationAndInitialize();
  }, []);

  /**
   * Handles time range selection changes
   * Updates state and fetches new data for selected time period
   * 
   * @param {string} newTimeRange - New time range to fetch data for
   */
  const handleTimeRangeChange = async (newTimeRange) => {
    if (newTimeRange !== timeRange && !isChangingTimeRange) {
      setIsChangingTimeRange(true);
      setTimeRange(newTimeRange);
      
      try {
        await fetchAnalytics(newTimeRange);
      } catch (error) {
        console.error('Error changing time range:', error);
      } finally {
        setIsChangingTimeRange(false);
      }
    }
  };

  /**
   * Converts time range codes to human-readable labels
   * 
   * @param {string} range - Time range code (short_term, medium_term, long_term)
   * @returns {string} Human-readable time range label
   */
  const getTimeRangeLabel = (range) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'All Time';
      default: return 'Last 6 Months';
    }
  };

  // Loading state component
  if (loading) {
    return (
      <div className="analytics-loading-wrapper">
        <div className="analytics-loading-content">
          <div className="analytics-spinner"></div>
          <p className="analytics-loading-message">
            {isAuthenticated ? 'Loading analytics data...' : 'Loading your music analytics...'}
          </p>
        </div>
      </div>
    );
  }

  // Authentication redirect component
  if (!isAuthenticated) {
    return (
      <div className="redirect-container">
        <div className="redirect-card">
          <div className="spotify-icon">🎵</div>
          <h2 className="redirect-title">Connecting to Spotify</h2>
          <p className="redirect-text">Please wait while we redirect you to login...</p>
        </div>
      </div>
    );
  }

  // Main analytics dashboard render
  return (
    <div className="analytics-container">
      {/* Page Header with Navigation and Time Range Selector */}
      <div className="analytics-header">
        <div className="header-navigation">
          <Link to="/dashboard" className="back-button">
            ← Back to Dashboard
          </Link>
        </div>
        
        <h1 className="analytics-title">
          <span className="analytics-icon">📊</span>
          Music Analytics
        </h1>
        
        <p className="analytics-subtitle">
          Deep insights into your listening habits for {getTimeRangeLabel(timeRange).toLowerCase()}
        </p>
        
        {/* Time Range Selection Buttons */}
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === 'short_term' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('short_term')}
            disabled={isChangingTimeRange}
          >
            {isChangingTimeRange && timeRange === 'short_term' ? '🔄 Loading...' : 'Last 4 Weeks'}
          </button>
          <button 
            className={`time-btn ${timeRange === 'medium_term' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('medium_term')}
            disabled={isChangingTimeRange}
          >
            {isChangingTimeRange && timeRange === 'medium_term' ? '🔄 Loading...' : 'Last 6 Months'}
          </button>
          <button 
            className={`time-btn ${timeRange === 'long_term' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('long_term')}
            disabled={isChangingTimeRange}
          >
            {isChangingTimeRange && timeRange === 'long_term' ? '🔄 Loading...' : 'All Time'}
          </button>
        </div>
      </div>

      {/* Loading Overlay for Time Range Changes */}
      {isChangingTimeRange && (
        <div className="time-range-loading">
          <div className="mini-spinner"></div>
          
        </div>
      )}

      {/* Main Analytics Content Grid */}
      <div className="analytics-grid">
        
        {/* Top Artists Card */}
        <div className="analytics-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">🎤</span>
              Top Artists ({getTimeRangeLabel(timeRange)})
            </h2>
            <div className="card-controls">
              <label className="limit-label">
                Show:
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={artistLimit}
                  onChange={(e) => handleArtistLimitChange(parseInt(e.target.value))}
                  className="limit-input"
                />
                artists
              </label>
            </div>
          </div>
          
          <div className="artists-list">
            {topArtists.slice(0, artistLimit).map((artist, index) => (
              <div key={artist.id} className="artist-item">
                <div className="artist-rank">#{index + 1}</div>
                
                {/* Artist Image */}
                <div className="artist-image-container">
                  {artist.images && artist.images[0] ? (
                    <img 
                      src={artist.images[0].url} 
                      alt={artist.name} 
                      className="artist-image" 
                    />
                  ) : (
                    <div className="artist-placeholder">🎤</div>
                  )}
                </div>
                
                {/* Artist Information */}
                <div className="artist-info">
                  <h3 className="artist-name">{artist.name}</h3>
                  <p className="artist-genres">
                    {artist.genres && artist.genres.length > 0 
                      ? artist.genres.slice(0, 2).join(', ') 
                      : 'No genres available'
                    }
                  </p>
                </div>
                
                {/* Popularity Meter */}
                <div className="artist-popularity">
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{width: `${artist.popularity}%`}}
                    ></div>
                  </div>
                  <span className="popularity-text">{artist.popularity}%</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {topArtists.length === 0 && (
            <div className="empty-state">
              <p>No top artists data available for {getTimeRangeLabel(timeRange).toLowerCase()}.</p>
            </div>
          )}
        </div>

        {/* Top Tracks Card */}
        <div className="analytics-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">🎵</span>
              Top Tracks ({getTimeRangeLabel(timeRange)})
            </h2>
            <div className="card-controls">
              <label className="limit-label">
                Show:
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={trackLimit}
                  onChange={(e) => handleTrackLimitChange(parseInt(e.target.value))}
                  className="limit-input"
                />
                tracks
              </label>
            </div>
          </div>
          
          <div className="tracks-list">
            {topTracks.slice(0, trackLimit).map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-rank">#{index + 1}</div>
                
                {/* Album Cover */}
                <div className="track-image-container">
                  {track.album.images && track.album.images[0] ? (
                    <img 
                      src={track.album.images[0].url} 
                      alt={track.name} 
                      className="track-image" 
                    />
                  ) : (
                    <div className="track-placeholder">🎵</div>
                  )}
                </div>
                
                {/* Track Information */}
                <div className="track-info">
                  <h3 className="track-name">{track.name}</h3>
                  <p className="track-artists">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  <p className="track-album">{track.album.name}</p>
                </div>
                
                {/* Popularity Meter */}
                <div className="track-popularity">
                  <div className="popularity-bar">
                    <div 
                      className="popularity-fill" 
                      style={{width: `${track.popularity}%`}}
                    ></div>
                  </div>
                  <span className="popularity-text">{track.popularity}%</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {topTracks.length === 0 && (
            <div className="empty-state">
              <p>No top tracks data available for {getTimeRangeLabel(timeRange).toLowerCase()}.</p>
            </div>
          )}
        </div>



        {/* Top Genres Card */}
        <div className="analytics-card genres-card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">🎨</span>
              Top Genres ({getTimeRangeLabel(timeRange)})
            </h2>
          </div>
          
          <div className="genres-list">
            {Array.from(
              // Count genre frequency across all artists
              topArtists.reduce((genreCount, artist) => {
                artist.genres?.forEach(genre => {
                  genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
                });
                return genreCount;
              }, new Map())
            )
            .sort(([,a], [,b]) => b - a) // Sort by frequency (descending)
            .slice(0, 8) // Show top 8 genres
            .map(([genre, count]) => (
              <div key={genre} className="genre-item">
                <span className="genre-name">{genre}</span>
                <div className="genre-bar">
                  <div 
                    className="genre-fill" 
                    style={{width: `${(count / topArtists.length) * 100}%`}}
                  ></div>
                </div>
                <span className="genre-count">{count}</span>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {topArtists.length === 0 && (
            <div className="empty-state">
              <p>No genre data available for {getTimeRangeLabel(timeRange).toLowerCase()}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;