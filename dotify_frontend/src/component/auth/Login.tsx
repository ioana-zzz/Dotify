import './auth.css'
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';


import 'bootstrap/dist/css/bootstrap.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/users/login', {
        email: formData.email,
        password: formData.password,
      });

      const user = response.data
     
      sessionStorage.setItem('authToken', user.username);
      sessionStorage.setItem('user', JSON.stringify(user));

      navigate(user.role === 'Artist' ? '/artist-dashboard' : '/user-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {error && <p className='errorMessage'>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Log In</button>
      </form>

      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    
    </div>
  );
};

export default Login;
