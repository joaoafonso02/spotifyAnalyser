import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../assets/css/PlaylistTracks.css';

const PlaylistTracks = () => {
    const { playlistId } = useParams();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPlayer, setShowPlayer] = useState({}); // New state for toggling players

    useEffect(() => {
        const checkAuthenticationAndFetchTracks = async () => {
        try {
            // Check authentication first
            const authResponse = await fetch('http://127.0.0.1:8080/secured', {
            method: 'GET',
            credentials: 'include',
            });

            if (authResponse.ok) {
            setIsAuthenticated(true);
            
            // Fetch playlist tracks
            const tracksResponse = await fetch(`http://127.0.0.1:8080/playlist-tracks/${playlistId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (tracksResponse.ok) {
                const tracksData = await tracksResponse.json();
                setTracks(tracksData);
                console.log('Tracks fetched:', tracksData);
            } else {
                console.error('Failed to fetch tracks:', tracksResponse.status);
            }
            } else if (authResponse.status === 401) {
            console.log('User is not authenticated');
            window.location.href = 'http://127.0.0.1:8080/oauth2/authorization/spotify';
            }
        } catch (error) {
            console.error('Error checking authentication or fetching tracks:', error);
        } finally {
            setLoading(false);
        }
        };

        checkAuthenticationAndFetchTracks();
    }, [playlistId]);

    // Toggle player function
    const togglePlayer = (trackIndex) => {
        setShowPlayer(prev => ({
        ...prev,
        [trackIndex]: !prev[trackIndex]
        }));
    };

    //   if (loading) {
    //     return (
    //       <div className="loading-container">
    //         <div className="loading-spinner">
    //           <div className="spinner"></div>
    //           <p className="loading-text">Loading playlist tracks...</p>
    //         </div>
    //       </div>
    //     );
    //   }

    if (loading) {
        return (
        <div className="tracks-loading-wrapper">
            <div className="tracks-loading-content">
            <div className="tracks-spinner"></div>
            <p className="tracks-loading-message">Loading playlist tracks...</p>
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
        <div className="tracks-container">
        <div className="tracks-header">
            <Link to="/playlists" className="back-button">
            ← Back to Playlists
            </Link>
            <h1 className="tracks-title">Playlist Tracks</h1>
        </div>

        {tracks.length > 0 ? (
            <div className="tracks-list">
            {tracks.map((item, index) => {
                const track = item.track;
                const durationMs = track.duration_ms;
                const minutes = Math.floor(durationMs / 60000);
                const seconds = Math.floor((durationMs % 60000) / 1000);
                const durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                
                const artistNames = track.artists
                .map(artist => artist.name)
                .join(', ');
                
                const albumCover = track.album.images && track.album.images.length > 0
                ? track.album.images[track.album.images.length - 1].url
                : null;

                // Spotify embed URL for the track
                const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`;

                return (
                <div key={index} className="track-item">
                    <div className="track-info-section">
                    <div className="track-image">
                        {albumCover ? (
                        <img src={albumCover} alt={track.name} />
                        ) : (
                        <div className="placeholder-track-image">🎵</div>
                        )}
                    </div>
                    <div className="track-info">
                        <h3 className="track-name">{track.name}</h3>
                        <p className="track-artist">{artistNames}</p>
                        <p className="track-duration">{durationFormatted}</p>
                    </div>
                    <div className="track-controls">
                        <button 
                        onClick={() => togglePlayer(index)}
                        className="play-toggle-button"
                        >
                        {showPlayer[index] ? '🎵 Hide Player' : '▶️ Show Player'}
                        </button>
                    </div>
                    </div>

                    {/* Conditional Spotify Embed Player */}
                    {showPlayer[index] && (
                    <div className="spotify-embed">
                        <iframe 
                        src={spotifyEmbedUrl}
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allowtransparency="true" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        title={`Spotify player for ${track.name}`}
                        ></iframe>
                    </div>
                    )}
                </div>
                );
            })}
            </div>
        ) : (
            <div className="empty-tracks">
            <p>No tracks found in this playlist.</p>
            </div>
        )}
        </div>
    );
};

export default PlaylistTracks;