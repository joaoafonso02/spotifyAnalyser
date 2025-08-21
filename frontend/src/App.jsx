import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ping from './components/Ping';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Playlists from './components/Playlists';
import PlaylistTracks from './components/PlaylistTracks'; 
import Logout from './components/Logout';
import Analytics from './components/Analytics';
import ChatBot from './components/ChatBot'; 
import FloatingChatBot from './components/FloatingChatBot';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ping" element={<Ping />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlist-tracks/:playlistId" element={<PlaylistTracks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chatbot" element={<ChatBot />} /> 
        <Route path="/logout" element={<Logout />} />
      </Routes>

      <FloatingChatBot />
    </Router>
  );
};

export default App;