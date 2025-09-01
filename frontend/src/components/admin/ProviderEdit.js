import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const ProviderEdit = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      services: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [providerRes, servicesRes] = await Promise.all([
          axios.get(`http://localhost:5000/admin/providers/${id}`, { headers }),
          axios.get('http://localhost:5000/admin/services', { headers }),
        ]);
        const provider = providerRes.data;
        reset({
          email: provider.email || '',
          name: provider.name || '',
          phone: provider.phone || '',
          services: provider.services.map((s) => s.id.toString()) || [],
        });
        setServices(servicesRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch provider or services');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, id, reset]);

  const onSubmit = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        email: data.email,
        name: data.name,
        phone: data.phone,
        services: data.services.map(Number),
      };
      if (data.password) payload.password = data.password;
      await axios.put(`http://localhost:5000/admin/providers/${id}`, payload, { headers });
      navigate('/admin/providers');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update provider');
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Provider</h2>
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
            <label style={styles.label}>Password (leave blank to keep unchanged)</label>
            <input
              type="password"
              {...register('password', { minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              style={styles.input}
              placeholder="Enter new password (optional)"
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
            Update Provider
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
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: Colors.textSecondary,
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

export default ProviderEdit;