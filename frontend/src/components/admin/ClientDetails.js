import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Colors } from '../../constants/Colors.ts';

const ClientDetails = () => {
  const { token } = useContext(AuthContext);
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch client and their reservations
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, reservationsRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/users', { headers }),
          axios.get('http://localhost:5000/admin/reservations', {
            headers,
            params: { clientId },
          }),
        ]);

        const clientData = userRes.data.find((user) => user.id === parseInt(clientId));
        if (!clientData || clientData.role !== 'CLIENT') {
          throw new Error('Client not found');
        }

        const reservations = reservationsRes.data;
        const upcomingReservations = reservations.filter(
          (res) => new Date(res.schedule.date) >= new Date()
        );

        setClient(clientData);
        setClientDetails({
          reservations,
          totalReservations: reservations.length,
          upcomingReservations: upcomingReservations.length,
          joinedDate: clientData.createdAt
            ? new Date(clientData.createdAt).toLocaleDateString()
            : 'Unknown',
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch client details');
        console.error('Data error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, [token, clientId]);

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!client) {
    return (
      <div style={styles.container}>
        <h1 style={styles.mainTitle}>Client Not Found</h1>
        <p style={styles.error}>{error}</p>
        <button style={styles.backButton} onClick={() => navigate('/admin/clients')}>
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>{client.name || 'Client'} Details</h1>
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.backButton} onClick={() => navigate('/admin/clients')}>
        Back to Clients
      </button>

      <div style={styles.detailsContainer}>
        <p>
          <strong>Email:</strong> {client.email}
        </p>
        <p>
          <strong>Phone:</strong> {client.phone || '-'}
        </p>
        <p>
          <strong>Joined Date:</strong> {clientDetails.joinedDate}
        </p>
        <p>
          <strong>Total Reservations:</strong> {clientDetails.totalReservations}
        </p>
        <p>
          <strong>Upcoming Reservations:</strong> {clientDetails.upcomingReservations}
        </p>

        <h2 style={styles.sectionTitle}>Reservations</h2>
        {clientDetails.reservations.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Service</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {clientDetails.reservations.map((res) => (
                <tr key={res.id}>
                  <td style={styles.td}>{res.service.name}</td>
                  <td style={styles.td}>
                    {new Date(res.schedule.date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>
                    {new Date(res.schedule.startTime).toLocaleTimeString()} -{' '}
                    {new Date(res.schedule.endTime).toLocaleTimeString()}
                  </td>
                  <td style={styles.td}>
                    {new Date(res.schedule.date) >= new Date() ? 'Upcoming' : 'Past'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
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
  },
  mainTitle: {
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
    margin: '16px 0',
  },
  error: {
    color: '#dc2626',
    fontSize: '16px',
    marginBottom: '20px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: Colors.textSecondary,
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: Colors.deepPurple,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontSize: '14px',
    marginBottom: '16px',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: Colors.lightBg,
    padding: '12px',
    textAlign: 'left',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontWeight: '600',
    color: Colors.textSecondary,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    color: Colors.textSecondary,
  },
};

export default ClientDetails;