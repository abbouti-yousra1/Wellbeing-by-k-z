import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const ServiceEdit = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      assignedProviders: [],
      variants: [],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [providersRes, serviceRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/providers', { headers }),
          axios.get(`http://localhost:5000/admin/services/${id}`, { headers }),
        ]);
        setProviders(providersRes.data);

        const service = serviceRes.data;
        reset({
          name: service.name || '',
          description: service.description || '',
          imageUrl: service.imageUrl || '',
          assignedProviders: service.assignedProviders.map((p) => p.id.toString()),
          variants: service.variants.map((v) => ({
            id: v.id,
            duration: parseInt(v.duration),
            price: parseFloat(v.price),
          })),
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, id, reset]);

  const onSubmit = async (data) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const serviceData = {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        assignedProviders: data.assignedProviders.map(Number),
      };

      await axios.put(`http://localhost:5000/admin/services/${id}`, serviceData, { headers });

      for (const variant of data.variants) {
        const variantData = {
          duration: parseInt(variant.duration),
          price: parseFloat(variant.price),
        };
        if (variant.id) {
          await axios.put(`http://localhost:5000/admin/services/${id}/variants/${variant.id}`, variantData, { headers });
        } else {
          await axios.post(`http://localhost:5000/admin/services/${id}/variants`, variantData, { headers });
        }
      }

      navigate('/admin/services');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update service');
    }
  };

  const handleAddVariant = () => {
    append({ duration: 0, price: 0 });
  };

  const handleRemoveVariant = (index) => {
    remove(index);
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Service</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Service Details</h3>
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
            <label style={styles.label}>Image URL</label>
            <input
              {...register('imageUrl')}
              style={styles.input}
              placeholder="Enter image URL"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Assigned Providers</label>
            <select
              multiple
              {...register('assignedProviders')}
              style={styles.select}
            >
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
            <p style={styles.hint}>Hold Ctrl/Cmd to select multiple providers</p>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Variants (Duration & Price)</h3>
          {fields.map((variant, index) => (
            <div key={variant.id} style={styles.variantGroup}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Duration (minutes)</label>
                <input
                  type="number"
                  {...register(`variants.${index}.duration`, { 
                    required: 'Duration is required', 
                    min: { value: 1, message: 'Duration must be at least 1 minute' },
                    valueAsNumber: true
                  })}
                  style={styles.input}
                  placeholder="Duration"
                />
                {errors.variants?.[index]?.duration && <p style={styles.error}>{errors.variants[index].duration.message}</p>}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register(`variants.${index}.price`, { 
                    required: 'Price is required', 
                    min: { value: 0, message: 'Price cannot be negative' },
                    valueAsNumber: true
                  })}
                  style={styles.input}
                  placeholder="Price"
                />
                {errors.variants?.[index]?.price && <p style={styles.error}>{errors.variants[index].price.message}</p>}
              </div>
              <button type="button" onClick={() => handleRemoveVariant(index)} style={styles.deleteButton} className="delete-button">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddVariant} style={styles.addVariantButton} className="add-variant-button">
            Add Variant
          </button>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton} className="submit-button">
            Update Service
          </button>
          <button type="button" onClick={() => navigate('/admin/services')} style={styles.cancelButton} className="cancel-button">
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
  select: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${Colors.lightBg}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    color: Colors.textSecondary,
    backgroundColor: '#fff',
    minHeight: '100px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  hint: {
    fontSize: '12px',
    color: Colors.textSecondary,
    marginTop: '4px',
    fontStyle: 'italic',
  },
  variantGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'flex-end',
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
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    transition: 'background-color 0.3s, transform 0.2s',
  },
  addVariantButton: {
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
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
};

export default ServiceEdit;