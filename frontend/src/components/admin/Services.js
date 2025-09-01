import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const ServicesList = () => {
  const { token } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/admin/services', { headers });
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch services');
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/admin/services/${id}`, { headers });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete service');
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Services</h2>
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.submitButton} onClick={() => navigate('/admin/services/create')}>
        Create New Service
      </button>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Variants</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} style={styles.tr}>
              <td style={styles.td}>{service.name}</td>
              <td style={styles.td}>{service.description || '-'}</td>
              <td style={styles.td}>{service.variants.length}</td>
              <td style={styles.td}>
                <button
                  onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles (adapted from your code)
const styles = {
  container: {
    backgroundColor: 'transparent',
    fontFamily: "'Inter', Arial, sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: '24px',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: Colors.vibrantPlum ,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: Colors.textSecondary,
    borderBottom: '1px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.3s',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#4b5563',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: Colors.vibrantPlum,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginRight: '8px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: Colors.mediumGrey,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#4b5563',
  },
};

export default ServicesList;