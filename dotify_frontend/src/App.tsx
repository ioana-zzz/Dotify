import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './component/auth/Register'; 
import Login from './component/auth/Login';
import ArtistDashboard from './component/dashboards/ArtistDashboard';   
import IntroWindow from './component/dashboards/IntroWindow'; 
import UserDashboard from './component/dashboards/UserDashboard';
import AddAlbum from './component/artist_components/addAlbum';
import AddSong from './component/artist_components/AddSong';
import EditAlbum from './component/artist_components/editAlbum';
import ViewAlbum from './component/user_components/album_view';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<IntroWindow />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist-dashboard" element={<ArtistDashboard />} />
        <Route path='/user-dashboard' element={<UserDashboard/>} />
        <Route path='/add-album' element={<AddAlbum/>} />
        <Route path='/add-song' element={<AddSong/>} />
        <Route path="/edit-album/:albumId" element={<EditAlbum />} />
        <Route path = "/album/:albumId" element={<ViewAlbum />} />
      
       
      </Routes>
    </Router>
  );
}

export default App;