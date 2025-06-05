import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../../../dotify_backend/src/users/entity/user.entity';
import { Album } from '../../../../dotify_backend/src/album/entities/album.entity';
import api from '../api';
import { Song } from '../../../../dotify_backend/src/songs/entities/song.entity';
import { UpdateAlbumDto } from '../../../../dotify_backend/src/album/dto/update-album.dto';
import MusicList from '../dashboards/MusicListItem';
import '../artist_components/edit-album.css';

const ViewAlbum = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumRes = await api.get<Album>(`/album/${albumId}`);
        setAlbum(albumRes.data);
           setSongs(albumRes.data.songs.map(song => ({
            ...song, 
            album: albumRes.data
        })));
      } catch (err: any) {
        setError('Failed to load album');
      }
    };
    fetchAlbum();
  }, [albumId]);



  if (!album) return <div>Loading...</div>;

  return (
    <div className="edit-album-container">
        <div className = 'album-details' style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
         <div className="album-item" key={album.id} style={{ display: 'flex', width:'100vw', height: '25vh', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      {album.coverArt && (
                        <img
                          src={album.coverArt}
                          alt={album.title}
                          style={{ width: 150, height: 150, borderRadius: 8, objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <span className="album-title" style={{ fontSize: '3.5em', color: '#666' }}>{album.title}</span>
                        {album.artist && (
                            <div style={{ fontSize: '1.5em', color: '#666' }}>
                            by {album.artist.username}
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
      <h2>Songs</h2>
          <section className="songs-section">
          <div className="section-header">
            <h2>Songs</h2>
          </div>
          <div className="edit-album-song-list-item">
            {songs.length === 0 ? (
              <div className="no-content">No songs yet.</div>
            ) : (
              <MusicList songs={songs}/>
            )}
          </div>
        </section>
      
    </div>
  );
};

export default ViewAlbum;