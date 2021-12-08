import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import CreatePlaylistPage from './pages/CreatePlaylistPage';
import EditPlaylistPage from './pages/EditPlaylistPage';
import AddSongsPage from './pages/AddSongsPage';
import ProfilePage from './pages/ProfilePage';
import EmailPage from './pages/EmailPage';
import FavPage from './pages/FavPage';
import RecommendPage from './pages/RecommendPage';
import RecListPage from './pages/RecListPage';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="home" element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="createPlaylist" element={<CreatePlaylistPage />} />
        <Route path="editPlaylist" element={<EditPlaylistPage />} />
        <Route path="addSongs" element={<AddSongsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="email" element={<EmailPage />} />
        <Route path="fav" element={<FavPage />} />
        <Route path="rec" element={<RecommendPage />} />
        <Route path="recList" element={<RecListPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
