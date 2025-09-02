import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const SchedulesList = () => {
  const { token } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/admin/schedules', { headers });
        setSchedules(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch schedules');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:5000/admin/schedules/${id}`, { headers });
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete schedule');
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Schedules</h2>
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.submitButton} onClick={() => navigate('/admin/schedules/create')} className="submit-button">
        Create New Schedule
      </button>

      <div style={styles.scheduleGrid}>
        {schedules.map((schedule) => (
          <div key={schedule.id} style={styles.card}>
            <h3 style={styles.cardTitle}>Schedule ID: {schedule.id}</h3>
            <p style={styles.cardText}>
              <strong>Provider:</strong> {schedule.provider?.name || 'Not specified'}
            </p>
            <p style={styles.cardText}>
              <strong>Cabinet:</strong> {schedule.cabinet?.name || 'Not specified'}
            </p>
            <p style={styles.cardText}>
              <strong>Date:</strong> {new Date(schedule.date).toLocaleDateString()}
            </p>
            <p style={styles.cardText}>
              <strong>Time:</strong> {new Date(schedule.startTime).toLocaleTimeString()} -{' '}
              {new Date(schedule.endTime).toLocaleTimeString()}
            </p>
            <p style={styles.cardText}>
              <strong>Status:</strong> {schedule.status || 'AVAILABLE'}
            </p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => navigate(`/admin/schedules/${schedule.id}/edit`)}
                style={styles.editButton}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(schedule.id)}
                style={styles.deleteButton}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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
  scheduleGrid: {
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

export default SchedulesList;