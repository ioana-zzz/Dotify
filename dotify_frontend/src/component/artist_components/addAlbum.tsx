import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {User } from '../../../../dotify_backend/src/users/entity/user.entity';
import {Album} from '../../../../dotify_backend/src/album/entities/album.entity';
import api from '../api';
import '../auth/auth.css'; // reuse your auth styles if you want
import 'bootstrap/dist/css/bootstrap.css';

const AddAlbum = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverArt: null as File | null,
  });
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
     const albumData: any = {
    artistId: (JSON.parse(sessionStorage.getItem('user') || '{}') as User).id?.toString(),
    title: formData.title
    };

      if (formData.coverArt instanceof File) {
        const coverArtBase64 = await resizeImageFile(formData.coverArt);
        albumData.coverArt = coverArtBase64;
      }

      await api.post('/album', albumData);

      navigate('/artist-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Album creation failed');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      <h1>Add Album</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Album Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="profile-picture-section">
          <button
            type="button"
            onClick={triggerFileInput}
            className="profile-picture-button"
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
        <button type="submit">Create Album</button>
      </form>
    </div>
  );
};

export default AddAlbum;