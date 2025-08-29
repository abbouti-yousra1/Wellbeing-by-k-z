import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/client/dashboard');
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      }
    };
    fetchData();
  }, []);

  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h2>Client Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {/* Add features like view services, book sessions later */}
    </div>
  );
};

export default ClientDashboard;