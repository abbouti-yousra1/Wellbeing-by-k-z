import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    cabinets: 0,
    providers: 0,
    schedules: 0,
    upcomingBookings: 0,
  });
  const [error, setError] = useState('');

  // Fetch statistics
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      console.log('Redirecting to /login: user=', user); // Debug
      navigate('/login', { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, servicesRes, cabinetsRes, providersRes, schedulesRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/users', { headers }),
          axios.get('http://localhost:5000/admin/services', { headers }),
          axios.get('http://localhost:5000/admin/cabinets', { headers }),
          axios.get('http://localhost:5000/admin/providers', { headers }),
          axios.get('http://localhost:5000/admin/schedules', { headers }),
        ]);
        setStats({
          users: usersRes.data.length,
          services: servicesRes.data.length,
          cabinets: cabinetsRes.data.length,
          providers: providersRes.data.length,
          schedules: schedulesRes.data.length,
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch statistics');
        console.error('Stats error:', {
          message: err.message,
          response: err.response?.data,
        });
      }
    };

    fetchStats();
  }, [user, token, navigate]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Dashboard</h2>
        <nav style={styles.nav}>
          {['users', 'services', 'cabinets', 'providers', 'schedules'].map((item) => (
            <NavLink
              key={item}
              to={`/admin/${item}`}
              style={({ isActive }) => ({
                ...styles.navLink,
                backgroundColor: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#fff' : '#d1d5db',
              })}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </NavLink>
          ))}
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.mainTitle}>Welcome, {user.name}</h1>
        {error && <p style={styles.error}>{error}</p>}
        {/* Statistics Section */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Users</h3>
            <p style={styles.statValue}>{stats.users}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Services</h3>
            <p style={styles.statValue}>{stats.services}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Cabinets</h3>
            <p style={styles.statValue}>{stats.cabinets}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Providers</h3>
            <p style={styles.statValue}>{stats.providers}</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Schedules</h3>
            <p style={styles.statValue}>{stats.schedules}</p>
          </div>

          
        </div>
        {/* Outlet for Child Routes */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: "'Inter', Arial, sans-serif",
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1e3a8a',
    color: '#fff',
    padding: '24px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  sidebarTitle: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '32px',
    letterSpacing: '0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  navLink: {
    padding: '12px 16px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s, color 0.3s',
  },
  logoutButton: {
    padding: '12px 16px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'background-color 0.3s',
  },
  main: {
    flex: 1,
    padding: '32px',
    backgroundColor: '#f1f5f9',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '24px',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '16px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  statTitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e3a8a',
  },
  content: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};

export default AdminDashboard;