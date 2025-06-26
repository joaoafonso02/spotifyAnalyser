import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ping from './components/Ping';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Playlists from './components/Playlists';
import PlaylistTracks from './components/PlaylistTracks'; 
import Logout from './components/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ping" element={<Ping />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist-tracks/:playlistId" element={<PlaylistTracks />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
};

export default App;