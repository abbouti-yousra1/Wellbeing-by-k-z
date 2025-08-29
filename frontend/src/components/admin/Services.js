import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [editingService, setEditingService] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch services
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

  // Handle form submission (create or update)
  const onSubmit = async (data) => {
    try {
      if (editingService) {
        // Update service
        const response = await axios.put(`http://localhost:5000/admin/services/${editingService.id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setServices(services.map((s) => (s.id === editingService.id ? response.data.service : s)));
      } else {
        // Create service
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

  // Handle edit button
  const handleEdit = (service) => {
    setEditingService(service);
    reset(service);
  };

  // Handle delete
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

      {/* Service Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            style={styles.input}
          />
          {errors.name && <p style={styles.error}>{errors.name.message}</p>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            {...register('description')}
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (minutes)</label>
          <input
            type="number"
            {...register('duration', { required: 'Duration is required', min: 1 })}
            style={styles.input}
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
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL</label>
          <input
            {...register('imageUrl')}
            style={styles.input}
          />
        </div>
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
      </form>

      {/* Services Table */}
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
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    minHeight: '100px',
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

export default Services;