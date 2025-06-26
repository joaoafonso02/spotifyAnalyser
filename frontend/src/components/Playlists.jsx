import React, { useEffect, useState } from 'react';
import '../assets/css/Playlists.css';
import { Link } from 'react-router-dom';

const Playlists = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthenticationAndFetchPlaylists = async () => {
        try {
            const authResponse = await fetch('http://127.0.0.1:8080/secured', {
            method: 'GET',
            credentials: 'include',
            });

            if (authResponse.ok) {
            setIsAuthenticated(true);
            console.log('User is authenticated');
            
            const playlistsResponse = await fetch('http://127.0.0.1:8080/playlists', {
                method: 'GET',
                credentials: 'include',
            });

            if (playlistsResponse.ok) {
                const playlistsData = await playlistsResponse.json();
                setPlaylists(playlistsData);
                console.log('Playlists fetched:', playlistsData);
            } else {
                console.error('Failed to fetch playlists:', playlistsResponse.status);
            }
            } else if (authResponse.status === 401) {
            console.log('User is not authenticated');
            window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/spotify';
            } else {
            console.error('Unexpected response status:', authResponse.status);
            }
        } catch (error) {
            console.error('Error checking authentication or fetching playlists:', error);
        } finally {
            setLoading(false);
        }
        };

    

        checkAuthenticationAndFetchPlaylists();
    }, []);

    const handleOpenPlaylist = (playlistId, event) => {
        event.preventDefault();
        event.stopPropagation();
        
        // Open Spotify playlist in a new tab
        const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}`;
        window.open(spotifyUrl, '_blank');
    };
    


    
    if (loading) {
        return (
        <div className="tracks-loading-wrapper">
            <div className="tracks-loading-content">
            <div className="tracks-spinner"></div>
            <p className="tracks-loading-message">Loading playlists...</p>
            </div>
        </div>
        );
        }


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

    return (
        <div className="playlists-container">
        {/* Header Section */}
        <div className="playlists-header">
            <div className="header-content">
            <div className="navigation">
                <Link to="/dashboard" className="back-button">
                ← Back to Dashboard
                </Link>
            </div>
            <h1 className="playlists-title">
                <span className="title-icon">🎶</span>
                Your Music Library
            </h1>
            <p className="playlists-subtitle">
                Discover and explore your {playlists.length} playlists
            </p>
            </div>
            <div className="stats-card">
            <div className="stat-item">
                <span className="stat-number">{playlists.length}</span>
                <span className="stat-label">Playlists</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <span className="stat-number">
                {playlists.reduce((total, playlist) => total + (playlist.tracks?.total || 0), 0)}
                </span>
                <span className="stat-label">Total Tracks</span>
            </div>
            </div>
        </div>

        {/* Playlists Grid */}
        {playlists.length > 0 ? (
            <div className="playlists-grid">
            {playlists.map((playlist, index) => (
                <div key={playlist.id || index} className="playlist-card">
                <div className="image-container">
                    {playlist.images && playlist.images[0] ? (
                    <img 
                        src={playlist.images[0].url} 
                        alt={playlist.name}
                        className="playlist-image"
                    />
                    ) : (
                    <div className="placeholder-image">
                        <span className="placeholder-icon">🎵</span>
                    </div>
                    )}
                    <div className="play-button" onClick={(e) => handleOpenPlaylist(playlist.id, e)}>
                    <span className="play-icon">▶</span>
                    </div>
                </div>
                
                <div className="card-content">
                    <h3 className="playlist-title">{playlist.name}</h3>
                    {playlist.description ? (
                    <p className="playlist-description">
                        {playlist.description.length > 60 
                        ? `${playlist.description.substring(0, 60)}...`
                        : playlist.description
                        }
                    </p>
                    ) : (
                    <p className="playlist-description placeholder">
                        &nbsp;
                    </p>
                    )}
                    <div className="card-footer">
                    <span className="track-count">
                        <span className="track-icon">♪</span>
                        {playlist.tracks?.total || 0} tracks
                    </span>
                    <Link to={`/playlist-tracks/${playlist.id}`} className="view-button">
                        View Tracks
                    </Link>
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <h2 className="empty-title">No playlists found</h2>
            <p className="empty-text">
                Start creating playlists on Spotify to see them here!
            </p>
            <button className="create-button">
                Open Spotify
            </button>
            </div>
        )}
        </div>
    );
};

export default Playlists;