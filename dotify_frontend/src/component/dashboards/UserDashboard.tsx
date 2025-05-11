import React from 'react';
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

    return (
      <div>
        <h1>Artist Dashboard</h1>
        <p>Welcome to the User Dashboard, {localStorage.getItem('authToken')}!</p>
        <button type="button" onClick={() => {navigate('/');
                                            localStorage.setItem('authToken',  'null');}}>Logout</button>
      </div>
    );
  }
  
  export default UserDashboard;