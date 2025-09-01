import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const CabinetsList = () => {
  const { token } = useContext(AuthContext);
  const [cabinets, setCabinets] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/admin/cabinets', { headers });
        setCabinets(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch cabinets');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCabinets();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cabinet?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/admin/cabinets/${id}`, { headers });
      setCabinets(cabinets.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete cabinet');
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Cabinets</h2>
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.submitButton} onClick={() => navigate('/admin/cabinets/create')} className="submit-button">
        Create New Cabinet
      </button>

      <div style={styles.cabinetGrid}>
        {cabinets.map((cabinet) => {
          // Extract unique services from schedules
          const services = [
            ...new Set(
              cabinet.schedules
                .flatMap((schedule) => schedule.provider.services)
                .map((service) => service.name)
            ),
          ];

          return (
            <div key={cabinet.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{cabinet.name}</h3>
              <p style={styles.cardText}>
                <strong>Address:</strong> {cabinet.address || 'Not specified'}
              </p>
              <p style={styles.cardText}>
                <strong>Description:</strong> {cabinet.description || 'No description'}
              </p>
              <p style={styles.cardText}>
                <strong>Services Offered:</strong>
                {services.length > 0 ? (
                  <ul style={styles.serviceList}>
                    {services.map((serviceName, index) => (
                      <li key={index} style={styles.serviceItem}>
                        {serviceName}
                      </li>
                    ))}
                  </ul>
                ) : (
                  ' No services scheduled'
                )}
              </p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => navigate(`/admin/cabinets/${cabinet.id}/edit`)}
                  style={styles.editButton}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cabinet.id)}
                  style={styles.deleteButton}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '32px',
    fontWeight: '700',
    color: Colors.vibrantPlum,
    marginBottom: '24px',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: Colors.vibrantPlum,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    transition: 'background-color 0.3s, transform 0.2s',
    marginBottom: '24px',
  },
  cabinetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  cardTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '24px',
    fontWeight: '600',
    color: Colors.vibrantPlum,
    marginBottom: '16px',
  },
  cardText: {
    fontSize: '14px',
    color: Colors.textSecondary,
    marginBottom: '12px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
  },
  serviceList: {
    listStyle: 'none',
    padding: 0,
    margin: '8px 0 0 0',
  },
  serviceItem: {
    fontSize: '14px',
    color: Colors.textSecondary,
    marginBottom: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: Colors.vibrantPlum,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    transition: 'background-color 0.3s, transform 0.2s',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: Colors.textSecondary,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    transition: 'background-color 0.3s, transform 0.2s',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: Colors.textSecondary,
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
  },
};

export default CabinetsList;