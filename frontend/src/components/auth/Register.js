import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: 'MALE',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.dateOfBirth,
        formData.gender
      );
      alert('Registration successful! Please log in.');
    } catch (err) {
      setError(err.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register as Client (Step {step}/2)</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} style={styles.form}>
          {step === 1 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <button type="submit" style={styles.button}>Next</button>
            </>
          )}
          {step === 2 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} style={styles.select}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
              </div>
              <div style={styles.buttonGroup}>
                <button type="button" onClick={prevStep} style={{ ...styles.button, ...styles.backButton }}>
                  Back
                </button>
                <button type="submit" style={styles.button}>Register</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: 'url(/images/bg-well.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    fontFamily: "'Inter', Arial, sans-serif",
    position: 'relative' ,
    '&::before': {
      content: '""',
      position: 'absolute' ,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Overlay for readability
    },
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center' ,
    zIndex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#eec4e1ff',
    marginBottom: '20px',
  },
  error: {
    color: '#dc2626',
    fontSize: '16px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' ,
    gap: '16px',
  },
  formGroup: {
    textAlign: 'left',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '10px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s',
    backgroundColor: '#fff',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#fff',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  button: {
    backgroundColor: '#ECD5E5',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  backButton: {
    backgroundColor: '#6b7280',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'space-between',
  },
};

export default Register;