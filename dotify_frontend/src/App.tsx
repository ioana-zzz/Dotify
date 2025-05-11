import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './component/auth/Register'; 
import Login from './component/auth/Login';
import ArtistDashboard from './component/dashboards/ArtistDashboard';   
import IntroWindow from './component/dashboards/IntroWindow'; 
import UserDashboard from './component/dashboards/UserDashboard';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<IntroWindow />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/artist-dashboard" element={<ArtistDashboard />} />
        <Route path='/user-dashboard' element={<UserDashboard/>} />
      
       
      </Routes>
    </Router>
  );
}

export default App;