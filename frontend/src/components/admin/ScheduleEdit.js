import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const ScheduleEdit = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      providerId: '',
      cabinetId: '',
      date: '',
      startTime: '',
      endTime: '',
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [scheduleRes, providersRes, cabinetsRes] = await Promise.all([
          axios.get(`http://localhost:5000/admin/schedules/${id}`, { headers }),
          axios.get('http://localhost:5000/admin/providers', { headers }),
          axios.get('http://localhost:5000/admin/cabinets', { headers }),
        ]);
        const schedule = scheduleRes.data;
        reset({
          providerId: schedule.providerId?.toString() || '',
          cabinetId: schedule.cabinetId?.toString() || '',
          date: new Date(schedule.date).toISOString().split('T')[0],
          startTime: new Date(schedule.startTime).toISOString().slice(0, 16),
          endTime: new Date(schedule.endTime).toISOString().slice(0, 16),
          status: schedule.status || 'AVAILABLE',
        });
        setProviders(providersRes.data);
        setCabinets(cabinetsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch schedule');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, id, reset]);

  const onSubmit = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`http://localhost:5000/admin/schedules/${id}`, {
        ...data,
        date: new Date(data.date).toISOString(),
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        providerId: parseInt(data.providerId),
        cabinetId: data.cabinetId ? parseInt(data.cabinetId) : null,
      }, { headers });
      navigate('/admin/schedules');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update schedule');
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Schedule</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Schedule Details</h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Provider</label>
            <select
              {...register('providerId', { required: 'Provider is required' })}
              style={styles.input}
            >
              <option value="">Select a provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            {errors.providerId && <p style={styles.error}>{errors.providerId.message}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cabinet</label>
            <select
              {...register('cabinetId')}
              style={styles.input}
            >
              <option value="">Select a cabinet (optional)</option>
              {cabinets.map((cabinet) => (
                <option key={cabinet.id} value={cabinet.id}>
                  {cabinet.name}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              style={styles.input}
            />
            {errors.date && <p style={styles.error}>{errors.date.message}</p>}
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
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              style={styles.input}
            >
              <option value="AVAILABLE">Available</option>
              <option value="BOOKED">Booked</option>
              <option value="OFF">Off</option>
              <option value="BREAK">Break</option>
            </select>
            {errors.status && <p style={styles.error}>{errors.status.message}</p>}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton} className="submit-button">
            Update Schedule
          </button>
          <button type="button" onClick={() => navigate('/admin/schedules')} style={styles.cancelButton} className="cancel-button">
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

export default ScheduleEdit;