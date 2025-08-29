import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const register = async (email, password, name, phone, dateOfBirth, gender) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/register', {
        email, password, name, phone, dateOfBirth, gender
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};