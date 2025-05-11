import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './auth.css';
import 'bootstrap/dist/css/bootstrap.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    isArtist: false,
    profilePicture: null as File | null,
  });
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePicture: file });
      
      // Create a preview of the image
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
        const result = reader.result as string; 
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const registrationData: any = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.isArtist ? 'Artist' : 'User',
      };

      if (formData.profilePicture instanceof File) {
        const profilePicture = await convertFileToBase64(formData.profilePicture);
        registrationData.profilePicture = profilePicture;
      }

      const response = await api.post('/users/register', registrationData);

      localStorage.setItem('authToken', response.data.username);
      navigate(formData.isArtist ? '/artist-dashboard' : '/user-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        
        {/* Custom button to trigger file input */}
        <div className="profile-picture-section">
          <button
            type="button"
            onClick={triggerFileInput}
            className="profile-picture-button"
          >
            {formData.profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'}
          </button>
          
          {previewUrl && (
            <div className="profile-preview">
              <img 
                src={previewUrl} 
                alt="Profile Preview" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          )}
          
          {formData.profilePicture && (
            <div className="file-name">
              {formData.profilePicture.name}
            </div>
          )}
        </div>
        
        <label>
          <input
            type="checkbox"
            checked={formData.isArtist}
            onChange={(e) => setFormData({ ...formData, isArtist: e.target.checked })}
          />
          Register as Artist
        </label>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;