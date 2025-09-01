import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.js';
import { Colors } from '../../constants/Colors.ts';

const Clients = () => {
  const { token } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get('http://localhost:5000/admin/users', { headers });
        // Filter for clients only
        const clientUsers = res.data.filter((user) => user.role === 'CLIENT');
        setClients(clientUsers);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch clients');
        console.error('Data error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [token]);

  // Navigate to client details page
  const handleClientClick = (clientId) => {
    navigate(`/admin/clients/${clientId}`);
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Clients Management</h1>
      {error && <p style={styles.error}>{error}</p>}

      {/* Clients Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.sectionTitle}>Clients List</h2>
        {clients.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  style={styles.tr}
                  onClick={() => handleClientClick(client.id)}
                >
                  <td style={styles.td}>{client.name || '-'}</td>
                  <td style={styles.td}>{client.email}</td>
                  <td style={styles.td}>{client.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No clients found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
  },
  mainTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '32px',
    fontWeight: '700',
    color: Colors.vibrantPlum,
    marginBottom: '24px',
  },
  sectionTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '24px',
    fontWeight: '600',
    color: Colors.vibrantPlum,
    marginBottom: '16px',
  },
  error: {
    color: '#dc2626',
    fontSize: '16px',
    marginBottom: '20px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: Colors.textSecondary,
  },
  tableContainer: {
    marginTop: '32px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: Colors.lightBg,
    padding: '12px',
    textAlign: 'left',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontWeight: '600',
    color: Colors.textSecondary,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    color: Colors.textSecondary,
  },
  tr: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
};

export default Clients;