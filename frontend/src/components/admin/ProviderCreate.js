import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const ProviderCreate = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [services, setServices] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      services: [],
    },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:5000/admin/services', { headers });
        setServices(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch services');
      }
    };
    fetchServices();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('http://localhost:5000/admin/providers', {
        ...data,
        services: data.services.map(Number), // Convert to numbers
      }, { headers });
      navigate('/admin/providers');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create provider');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Provider</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Provider Details</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
              style={styles.input}
              placeholder="Enter provider email"
            />
            {errors.email && <p style={styles.error}>{errors.email.message}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              style={styles.input}
              placeholder="Enter provider password"
            />
            {errors.password && <p style={styles.error}>{errors.password.message}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              style={styles.input}
              placeholder="Enter provider name"
            />
            {errors.name && <p style={styles.error}>{errors.name.message}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              {...register('phone')}
              style={styles.input}
              placeholder="Enter provider phone"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Assigned Services</label>
            <select
              multiple
              {...register('services')}
              style={styles.select}
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton} className="submit-button">
            Create Provider
          </button>
          <button type="button" onClick={() => navigate('/admin/providers')} style={styles.cancelButton} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
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
    fontSize: '14px',
    marginBottom: '16px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${Colors.lightBg}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    color: Colors.textSecondary,
    backgroundColor: '#fff',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${Colors.lightBg}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    color: Colors.textSecondary,
    backgroundColor: '#fff',
    minHeight: '120px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: Colors.deepPurple,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    transition: 'background-color 0.3s, transform 0.2s',
  },
  cancelButton: {
    padding: '10px 24px',
    backgroundColor: Colors.textSecondary,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    transition: 'background-color 0.3s, transform 0.2s',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
};

export default ProviderCreate;