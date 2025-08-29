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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
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
    <div>
      <h2>Register as Client (Step {step}/2)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        {step === 1 && (
          <>
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
            <button type="button" onClick={prevStep}>Back</button>
            <button type="submit">Register</button>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;