import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded user:', JSON.stringify(decoded, null, 2)); // Detailed debug
        setUser(decoded);
        localStorage.setItem('token', token);
      } catch (err) {
        console.error('Token decode error:', {
          message: err.message,
          stack: err.stack,
        }); // Detailed debug
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  const login = (newToken, newUser) => {
    console.log('Login called with:', {
      token: newToken,
      user: JSON.stringify(newUser, null, 2),
    }); // Detailed debug
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};