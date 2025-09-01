import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Try decoding the token for initial user data
          const decoded = jwtDecode(token);
          console.log('Decoded user:', JSON.stringify(decoded, null, 2));
          setUser(decoded);

          // Validate token by fetching user from /admin/me
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get('http://localhost:5000/admin/me', { headers });
          console.log('Fetched user from /admin/me:', JSON.stringify(response.data, null, 2));
          setUser(response.data); // Override with server data
          localStorage.setItem('token', token); // Ensure token is stored
        } catch (err) {
          console.error('Auth error:', {
            message: err.message,
            stack: err.stack,
            response: err.response ? {
              status: err.response.status,
              data: err.response.data,
            } : null,
          });
          setAuthError('Invalid or expired token. Please log in again.');
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken, newUser) => {
    console.log('Login called with:', {
      token: newToken,
      user: JSON.stringify(newUser, null, 2),
    });
    setToken(newToken);
    setUser(newUser);
    setAuthError('');
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    console.log('Logout called');
    setToken('');
    setUser(null);
    setAuthError('');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};