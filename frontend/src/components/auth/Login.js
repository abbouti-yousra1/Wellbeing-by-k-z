import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'PROVIDER' | 'CLIENT';
  name?: string;
}


const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password,
      });
      console.log('Login response:', JSON.stringify(response.data, null, 2));
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Invalid login response: token or user missing');
      }
      login(token, user);
      console.log('User role:', user.role);
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/client/dashboard', { replace: true });
      }
      setError('');
    } catch (err) {
      console.error('Login error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.error || 'Login failed: ' + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(/images/bg-well.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: "'Inter', Arial, sans-serif",
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Overlay for readability
    },
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#eec4e1ff',
    marginBottom: '20px',
  },
  error: {
    color: '#dc2626',
    fontSize: '16px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' ,
    gap: '16px',
  },
  formGroup: {
    textAlign: 'left' ,
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '10px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ECD5E5',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Login;