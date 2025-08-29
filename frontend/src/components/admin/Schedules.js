import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/schedules', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSchedules(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch schedules');
      }
    };
    fetchSchedules();
  }, []);

  // Handle form submission (create or update)
  const onSubmit = async (data) => {
    try {
      if (editingSchedule) {
        // Update schedule
        const response = await axios.put(`http://localhost:5000/admin/schedules/${editingSchedule.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSchedules(schedules.map((s) => (s.id === editingSchedule.id ? response.data.schedule : s)));
      } else {
        // Create schedule
        const response = await axios.post('http://localhost:5000/admin/schedules', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSchedules([...schedules, response.data.schedule]);
      }
      reset();
      setEditingSchedule(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save schedule');
    }
  };

  // Handle edit button
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    reset({
      providerId: schedule.providerId,
      cabinetId: schedule.cabinetId,
      startTime: schedule.startTime.slice(0, 16), // For datetime-local input
      endTime: schedule.endTime.slice(0, 16),
    });
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/schedules/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSchedules(schedules.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete schedule');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Schedules</h2>
      {error && <p style={styles.error}>{error}</p>}

      {/* Schedule Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Provider ID</label>
          <input
            type="number"
            {...register('providerId', { required: 'Provider ID is required', min: 1 })}
            style={styles.input}
          />
          {errors.providerId && <p style={styles.error}>{errors.providerId.message}</p>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Cabinet ID</label>
          <input
            type="number"
            {...register('cabinetId', { required: 'Cabinet ID is required', min: 1 })}
            style={styles.input}
          />
          {errors.cabinetId && <p style={styles.error}>{errors.cabinetId.message}</p>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Start Time</label>
          <input
            type="datetime-local"
            {...register('startTime', { required: 'Start time is required' })}
            style={styles.input}
          />
          {errors.startTime && <p style={styles.error}>{errors.startTime.message}</p>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>End Time</label>
          <input
            type="datetime-local"
            {...register('endTime', { required: 'End time is required' })}
            style={styles.input}
          />
          {errors.endTime && <p style={styles.error}>{errors.endTime.message}</p>}
        </div>
        <button type="submit" style={styles.submitButton}>
          {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
        </button>
        {editingSchedule && (
          <button
            type="button"
            onClick={() => { reset(); setEditingSchedule(null); }}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Schedules Table */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Provider ID</th>
            <th style={styles.th}>Cabinet ID</th>
            <th style={styles.th}>Start Time</th>
            <th style={styles.th}>End Time</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id} style={styles.tr}>
              <td style={styles.td}>{schedule.providerId}</td>
              <td style={styles.td}>{schedule.cabinetId}</td>
              <td style={styles.td}>{new Date(schedule.startTime).toLocaleString()}</td>
              <td style={styles.td}>{new Date(schedule.endTime).toLocaleString()}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEdit(schedule)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(schedule.id)}
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

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#e5e7eb',
  },
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
  },
  tr: {
    borderBottom: '1px solid #ccc',
  },
  td: {
    padding: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Schedules;