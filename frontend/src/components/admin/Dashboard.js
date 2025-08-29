import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/admin/dashboard');
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
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <>
          <p>{data.message}</p>
          <h3>Users List:</h3>
          <ul>
            {data.users.map(u => (
              <li key={u.id}>{u.name} ({u.role}) - {u.email}</li>
            ))}
          </ul>
        </>
      )}
      {/* Add features like manage services, providers later */}
    </div>
  );
};

export default AdminDashboard;