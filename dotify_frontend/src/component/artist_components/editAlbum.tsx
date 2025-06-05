import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../../../dotify_backend/src/users/entity/user.entity';
import { Album } from '../../../../dotify_backend/src/album/entities/album.entity';
import api from '../api';
import './edit-album.css';
import { Song } from '../../../../dotify_backend/src/songs/entities/song.entity';
import { UpdateAlbumDto } from '../../../../dotify_backend/src/album/dto/update-album.dto';
import MusicList from '../dashboards/MusicListItem';

const EditAlbum = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [title, setTitle] = useState('');
  const [coverArt, setCoverArt] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumRes = await api.get<Album>(`/album/${albumId}`);
        setAlbum(albumRes.data);
        setTitle(albumRes.data.title);
        setPreviewUrl(albumRes.data.coverArt);
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

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverArt(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let coverArtBase64 = previewUrl;
      if (coverArt) {
        coverArtBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(coverArt);
        });
      }

      const updateDto: UpdateAlbumDto = {
        title,
        coverArt: coverArtBase64 ?? undefined
      };
      await api.patch(`/album/${albumId}`, updateDto);
      alert('Album updated!');
      navigate('/artist-dashboard');
    } catch (err: any) {
      setError('Failed to update album');
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!window.confirm('Delete this song?')) return;
    try {
      await api.delete(`/songs/${songId}`);
      setSongs(songs.filter(song => song.id !== songId));
    } catch {
      alert('Failed to delete song');
    }
  };

  const handleDeleteAlbum = async () => {
    if (!window.confirm('Delete the entire album?')) return;
    try {
      await api.delete(`/album/${albumId}`);
      alert('Album deleted!');
      navigate('/artist-dashboard');
    } catch {
      alert('Failed to delete album');
    }
  };

  if (!album) return <div>Loading...</div>;

  return (
    <div className="edit-album-container">
      <h1>Edit Album</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdate} className='edit-album-form'>
        <input
          className='edit-album-title'
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Album Title"
          required
        />
        <input type="file" accept="image/*" onChange={handleCoverChange} className='edit-album-cover-preview' />
        {previewUrl && (
          <img src={previewUrl} alt="cover preview" style={{ width: 120, margin: 10 }} />
        )}
        <button type="submit">Update Album</button>
      </form>
      <button className = 'edit-album-delete-btn' onClick={handleDeleteAlbum}>
        Delete Album
      </button>
      <h2>Songs</h2>
          <section className="songs-section">
          <div className="section-header">
            <h2>Songs</h2>
          </div>
          <div className="edit-album-song-list-item">
            {songs.length === 0 ? (
              <div className="no-content">No songs yet.</div>
            ) : (
              <MusicList songs={songs} onClick={handleDeleteSong} buttonName='Delete'/>
            )}
          </div>
        </section>
      
    </div>
  );
};

export default EditAlbum;