import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const CabinetCreate = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      address: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post('http://localhost:5000/admin/cabinets', data, { headers });
      navigate('/admin/cabinets');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create cabinet');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Cabinet</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Cabinet Details</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              style={styles.input}
              placeholder="Enter cabinet name"
            />
            {errors.name && <p style={styles.error}>{errors.name.message}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input
              {...register('address')}
              style={styles.input}
              placeholder="Enter cabinet address"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              {...register('description')}
              style={styles.textarea}
              placeholder="Enter cabinet description"
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton} className="submit-button">
            Create Cabinet
          </button>
          <button type="button" onClick={() => navigate('/admin/cabinets')} style={styles.cancelButton} className="cancel-button">
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
  textarea: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${Colors.lightBg}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    color: Colors.textSecondary,
    minHeight: '120px',
    resize: 'vertical',
    backgroundColor: '#fff',
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

export default CabinetCreate;