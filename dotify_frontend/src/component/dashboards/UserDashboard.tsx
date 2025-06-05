import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Song } from '../../../../dotify_backend/src/songs/entities/song.entity';
import { Album } from '../../../../dotify_backend/src/album/entities/album.entity';
import { User } from '../../../../dotify_backend/src/users/entity/user.entity';
import MusicList from './MusicListItem';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSongs, setSearchSongs] = useState<Song[]>([]);
  const [searchAlbums, setSearchAlbums] = useState<Album[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const user = (JSON.parse(sessionStorage.getItem('user') || '{}') as User);

  function likeSong(songId: string) {
    api.post(`/users/${user.id}/like-song`, { songId })
    .then(() => {
      const songToAdd = searchSongs.find(song => song.id === songId);
      if (songToAdd) {
        setLikedSongs(prev => [...prev, songToAdd]);
      }
    })
    .catch(error => console.error('Failed to like song:', error));
  }

  function dislikeSong(songId: string) {
    api.post(`/users/${user.id}/unlike-song`, { songId })
    .then(() => setLikedSongs(prev => prev.filter(song => song.id !== songId)))
    .catch(error => console.error('Failed to dislike song:', error));
  }

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await api.get<Song[]>(`/users/${user.id}/liked-songs`);
        
        const fullSongs = await Promise.all(
          response.data.map(song => api.get<Song>(`/songs/${song.id}`).then(res => res.data))
        );
        setLikedSongs(fullSongs);
      } catch (error) {
        console.error('Failed to fetch liked songs:', error);
      }
    };
    if (user.id) fetchLikedSongs();
  }, [user.id]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchSongs([]);
      setSearchAlbums([]);
      setHasSearched(false);
      return;
    }

    setSearching(true);
    setHasSearched(true);
    
    try {
      const [songsRes, albumsRes] = await Promise.all([
        api.get<Song[]>(`/songs/search?name=${encodeURIComponent(searchTerm.trim())}`),
        api.get<Album[]>(`/album/search?name=${encodeURIComponent(searchTerm.trim())}`)
      ]);
      setSearchSongs(songsRes.data);
      setSearchAlbums(albumsRes.data);
    } catch (error) {
      setSearchSongs([]);
      setSearchAlbums([]);
      console.error('Search failed:', error);
    }
    setSearching(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        setSearchSongs([]);
        setSearchAlbums([]);
        setHasSearched(false);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchSongs([]);
    setSearchAlbums([]);
    setHasSearched(false);
  };

  return (
    <div className="artist-dashboard" style={{ display: 'flex', minHeight: '80vh' }}>
      <div className = "user-dashboard-left" >
        <div className="dashboard-header">
          <div className="profile-info">
            <img
              className="profile-pic"
              src={user.profilePicture ?? "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"}
              alt="Profile"
              width={80}
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
        <section className="liked-songs-section">
          <h2>Liked Songs</h2>
          <div className="song-list">
            {likedSongs.length === 0 ? (
              <div className="no-content">No liked songs yet.</div>
            ) : (
              <MusicList songs={likedSongs} onClick={dislikeSong} buttonName='Dislike song' />
            )}
          </div>
        </section>
      </div>

      <div className='user-dashboard-right'>
        <section className="search-section">
          <h2>Search Songs & Albums</h2>
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              style={{ 
                width: '100%', 
                padding: 12, 
                borderRadius: 6, 
                border: '1px solid #ccc',
                marginBottom: 12,
                fontSize: 16
              }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                type="button" 
                className="add-btn" 
                onClick={() => handleSearch()}
                disabled={searching || !searchTerm.trim()}
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
              {(searchTerm || hasSearched) && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: 6, 
                    border: '1px solid #ccc',
                    background: '#f5f5f5',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {hasSearched && (
            <div>
              <h3>Songs ({searchSongs.length})</h3>
              <div className="song-list">
                {searchSongs.length === 0 ? (
                  <div className="no-content">No songs found for "{searchTerm}".</div>
                ) : (
                  <MusicList 
                    songs={searchSongs} 
                    onClick={likeSong} 
                    buttonName='Like Song'
                  />
                )}
              </div>
              
              <h3 style={{ marginTop: 24 }}>Albums ({searchAlbums.length})</h3>
              <div className="album-list">
                {searchAlbums.length === 0 ? (
                  <div className="no-content">No albums found for "{searchTerm}".</div>
                ) : (
                  searchAlbums.map(album => (
                    <div className="album-item" key={album.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}
                    onClick={() => navigate(`/album/${album.id}`)}>
                      {album.coverArt && (
                        <img
                          src={album.coverArt}
                          alt={album.title}
                          style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <span className="album-title">{album.title}</span>
                        {album.artist && (
                          <div style={{ fontSize: '0.9em', color: '#666' }}>
                            by {album.artist.username}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {!hasSearched && (
            <div className="no-content" style={{ textAlign: 'center', marginTop: 40 }}>
              Enter a search term to find songs and albums
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;