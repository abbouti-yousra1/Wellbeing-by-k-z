import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/services', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch services');
      }
    };
    fetchServices();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingService) {
        const response = await axios.put(`http://localhost:5000/admin/services/${editingService.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setServices(services.map((s) => (s.id === editingService.id ? response.data.service : s)));
      } else {
        const response = await axios.post('http://localhost:5000/admin/services', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setServices([...services, response.data.service]);
      }
      reset();
      setEditingService(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    reset(service);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete service');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Services</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            style={styles.input}
            placeholder="Enter service name"
          />
          {errors.name && <p style={styles.error}>{errors.name.message}</p>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            {...register('description')}
            style={styles.textarea}
            placeholder="Enter service description"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (minutes)</label>
          <input
            type="number"
            {...register('duration', { required: 'Duration is required', min: 1 })}
            style={styles.input}
            placeholder="Enter duration"
          />
          {errors.duration && <p style={styles.error}>{errors.duration.message}</p>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price')}
            style={styles.input}
            placeholder="Enter price"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL</label>
          <input
            {...register('imageUrl')}
            style={styles.input}
            placeholder="Enter image URL"
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            {editingService ? 'Update Service' : 'Create Service'}
          </button>
          {editingService && (
            <button
              type="button"
              onClick={() => { reset(); setEditingService(null); }}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Duration</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} style={styles.tr}>
              <td style={styles.td}>{service.name}</td>
              <td style={styles.td}>{service.duration} min</td>
              <td style={styles.td}>{service.price ? `$${service.price.toFixed(2)}` : '-'}</td>
              <td style={styles.td}>
                <button
                  onClick={() => handleEdit(service)}
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

const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    fontFamily: "'Inter', Arial, sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '24px',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '32px',
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'border-color 0.3s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    padding: '10px 24px',
    backgroundColor: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
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
    color: '#1e3a8a',
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
    backgroundColor: '#f59e0b',
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
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Services;