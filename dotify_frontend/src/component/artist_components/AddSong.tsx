import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {User } from '../../../../dotify_backend/src/users/entity/user.entity';
import {Album} from '../../../../dotify_backend/src/album/entities/album.entity';
import api from '../api';
import '../auth/auth.css'; 
import 'bootstrap/dist/css/bootstrap.css';

const AddSong = () => {
  const [formData, setFormData] = useState({
    title: '',
    songData: null as File | null,
    coverArt: null as File | null,
    album: null as string | null,
  });
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);


  useEffect(() => {
  const fetchAlbums = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const userId = (user as User).id;
      
      if (userId) {
        const response = await api.get<Album[]>(`/album/artist/${userId}`);
        setAlbums(response.data.filter(album => !album.title.includes('Single')));
      }
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    }
  };

  fetchAlbums();
}, []);



  const navigate = useNavigate();

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, songData: file });
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, coverArt: file });
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

 

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     const songDto: any = {
    artistId: (JSON.parse(sessionStorage.getItem('user') || '{}') as User).id?.toString(),
    title: formData.title
    };

      if (formData.coverArt instanceof File) {
        const coverArtBase64 = await resizeImageFile(formData.coverArt);
        songDto.coverArt = coverArtBase64;
      }

      if(formData.songData instanceof File) {
        const songDataBase64 = await convertFileToBase64(formData.songData);
        songDto.songData = songDataBase64;
      }

      if (formData.album) {
        songDto.albumId = formData.album;
      } else if (selectedAlbum) {
        songDto.albumId = selectedAlbum;
      }
    
      console.log('Song DTO:', songDto);

      await api.post('/songs', songDto);

      navigate('/artist-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Song creation failed');
    }
  };

  const triggerFileInput = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }

    if(audioInputRef.current) {
      audioInputRef.current.click();
    }
  };

function resizeImageFile(file: File, maxWidth = 300, maxHeight = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const aspect = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspect);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspect);
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.85)); 
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

  return (
    <div className="auth-container">
      <h1>Add New Song</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Song Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="file"
          ref={imgInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageChange}
        />
           <div >
          <button
            type="button"
            onClick={triggerFileInput}
          >
            {formData.coverArt ? 'Change Cover Art' : 'Upload Cover Art'}
          </button>
          {previewUrl && (
            <div className="profile-preview">
              <img
                src={previewUrl}
                alt="Cover Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10%' }}
              />
            </div>
          )}
          {formData.coverArt && (
            <div className="file-name">
              {formData.coverArt.name}
            </div>
          )}
        </div>
         <input
          type="file"
          ref={audioInputRef}
          style={{ display: 'none' }}
          accept="audio/*"
          onChange={handleAudioChange}
        />
        <div >
          <button
            type="button"
            onClick={triggerFileInput}
          >
            {formData.songData ? 'Change Audio File' : 'Upload Audio File'}
          </button>
          {previewUrl && (
            <div className="profile-preview">
              <audio
                src={previewUrl}
              />
            </div>
          )}
          {formData.songData && (
            <div className="file-name">
              {formData.songData.name}
            </div>
          )}
        </div>
        <label htmlFor="album">Select Album:</label>
        <select
          id="album"
          name="album"
          value={selectedAlbum || ''}
          onChange={(e) => setFormData({ ...formData,  album: e.target.value })}
        >
          <option value="" disabled>Select an album</option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.title}
            </option>
          ))}
        </select>
        <button type="submit">Create Album</button>
      </form>
    </div>
  );
};

export default AddSong;