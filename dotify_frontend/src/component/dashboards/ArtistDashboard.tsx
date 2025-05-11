import { useNavigate } from "react-router-dom";

function ArtistDashboard() {

  const navigate = useNavigate();

  return (
    <div>
      <h1>Artist Dashboard</h1>
      <h2>Welcome to the Artist Dashboard, {localStorage.getItem('authToken')}!</h2>
      <form>
        <button type="button" onClick={() => {navigate('/');
                                            localStorage.setItem('authToken',  'null');}}>Logout</button>

      </form>
    </div>
  );
}

export default ArtistDashboard;