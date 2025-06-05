import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Song } from '../../../../dotify_backend/src/songs/entities/song.entity';
import { User } from '../../../../dotify_backend/src/users/entity/user.entity';
import { Album } from '../../../../dotify_backend/src/album/entities/album.entity';
import MusicList from "./MusicListItem";
import api from '../api';
import './ArtistDashboard.css';

function ArtistDashboard() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const user = (JSON.parse(sessionStorage.getItem('user') || '{}') as User);
  

  useEffect(() => {
    const userId = user.id;
    api.get<Album[]>("/album/artist/" + userId)
      .then(response => setAlbums(response.data))
      .catch(error => console.error("Failed to fetch albums:", error));
    api.get<Song[]>("/songs/artist/" + userId)
      .then(response => setSongs(response.data))
      .catch(error => console.error("Failed to fetch songs:", error));
  }, [user.id]);

  return (
    <div className="artist-dashboard">
      <div className="dashboard-header">
        <div className="profile-info">
          <img
            className="profile-pic"
            src={user.profilePicture ?? "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}
            alt="Profile"
            width={100}
          />
          <div className="welcome-text">
            <h2>Welcome, {user.username}!</h2>
          </div>
        </div>
        <button
          className="logout-btn"
          type="button"
          onClick={() => {
            navigate("/");
            sessionStorage.setItem("authToken", "null");
            sessionStorage.setItem("user", "null");
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <section className="albums-section">
          <div className="section-header">
            <h2>Albums</h2>
            <button className="add-btn" onClick={() => navigate("/add-album")}>Add Album</button>
          </div>
          <div className="album-list">
            {albums.length === 0 ? (
              <div className="no-content">No albums yet.</div>
            ) : (
              albums.map((album) => (
                <div className="album-item" key={album.id}>
                  {album.coverArt && (
                    <div className="album-cover">
                      <img src={album.coverArt} alt={album.title} />
                    </div>
                  )}
                  <div className="album-info">
                    <span className="album-title">{album.title}</span>
                    <button onClick={() => navigate(`/edit-album/${album.id}`)}>
                            Edit</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="songs-section">
          <div className="section-header">
            <h2>Songs</h2>
            <button className="add-btn" onClick={() => navigate("/add-song")}>Add Song</button>
          </div>
          <div className="song-list">
            {songs.length === 0 ? (
              <div className="no-content">No songs yet.</div>
            ) : (
              <MusicList songs={songs} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ArtistDashboard;