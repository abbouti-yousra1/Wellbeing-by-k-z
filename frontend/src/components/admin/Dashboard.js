import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Colors } from '../../constants/Colors.ts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBriefcase, faBuilding, faUserMd, faCalendar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface Stats {
  users: number;
  services: number;
  cabinets: number;
  providers: number;
  schedules: number;
  upcomingReservations: number;
}

interface Reservation {
  id: number;
  client: { id: number; name: string };
  service: { id: number; name: string };
  schedule: { date: Date; startTime: Date; provider: { name: string } };
  createdAt: Date;
}

const AdminDashboard = () => {
  const { user, token, logout, authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    cabinets: 0,
    providers: 0,
    schedules: 0,
    upcomingReservations: 0,
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (authError) {
      setError(authError);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user if not set
        let currentUser = user;
        if (!user) {
          try {
            const userRes = await axios.get('http://localhost:5000/admin/me', { headers });
            currentUser = userRes.data;
            console.log('Fetched user in AdminDashboard:', JSON.stringify(currentUser, null, 2));
          } catch (err) {
            setError('Failed to fetch user. Please log in again.');
            navigate('/login', { replace: true });
            return;
          }
        }

        if (currentUser && currentUser.role !== 'ADMIN') {
          setError('Access denied. Admins only.');
          navigate('/login', { replace: true });
          return;
        }

        // Fetch statistics
        const statsRes = await axios.get('http://localhost:5000/admin/statistics', { headers });
        setStats({
          users: statsRes.data.users,
          services: statsRes.data.services,
          cabinets: statsRes.data.cabinets,
          providers: statsRes.data.providers,
          schedules: statsRes.data.schedules,
          upcomingReservations: statsRes.data.upcomingReservations,
        });
        setRecentReservations(statsRes.data.recentReservations);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        console.error('Data error:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
          } : null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, token, authError, navigate]);

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const isMainDashboard = location.pathname === '/admin' || location.pathname === '/admin/';

  const chartData = [
    { name: 'Users', value: stats.users },
    { name: 'Services', value: stats.services },
    { name: 'Cabinets', value: stats.cabinets },
    { name: 'Providers', value: stats.providers },
    { name: 'Schedules', value: stats.schedules },
    { name: 'Upcoming Res.', value: stats.upcomingReservations },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.sidebar}>
        <div style={styles.logoContainer} onClick={() => navigate('/admin')}>
          <img src="/images/logo.png" alt="App Logo" style={styles.logo} />
        </div>
        <nav style={styles.nav}>
          <div style={styles.navLinks}>
            {[
              { path: 'clients', label: 'Clients', icon: faUsers },
              { path: 'services', label: 'Services', icon: faBriefcase },
              { path: 'cabinets', label: 'Cabinets', icon: faBuilding },
              { path: 'providers', label: 'Providers', icon: faUserMd },
              { path: 'schedules', label: 'Schedules', icon: faCalendar },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={`/admin/${item.path}`}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  backgroundColor: isActive ? Colors.vibrantPlum : 'transparent',
                  color: isActive ? '#FFFFFF' : Colors.textSecondary,
                })}
              >
                <FontAwesomeIcon icon={item.icon} style={styles.navIcon} />
                {item.label}
              </NavLink>
            ))}
          </div>
          <button onClick={logout} style={styles.logoutButton}>
            <FontAwesomeIcon icon={faSignOutAlt} style={styles.logoutIcon} />
            Logout
          </button>
        </nav>
      </div>

      <div style={styles.main}>
        {isMainDashboard && (
          <>
            <h1 style={styles.mainTitle}>Welcome, {user.name}</h1>
            {error && <p style={styles.error}>{error}</p>}
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
              <div style={styles.statCard}>
                <h3 style={styles.statTitle}>Upcoming Reservations</h3>
                <p style={styles.statValue}>{stats.upcomingReservations}</p>
              </div>
            </div>

            <div style={styles.chartContainer}>
              <h2 style={styles.sectionTitle}>Statistics Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={Colors.vibrantPlum} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.reservationsContainer}>
              <h2 style={styles.sectionTitle}>Recent Reservations</h2>
              {recentReservations.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Client</th>
                      <th style={styles.th}>Service</th>
                      <th style={styles.th}>Provider</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((res) => (
                      <tr key={res.id}>
                        <td style={styles.td}>{res.client.name}</td>
                        <td style={styles.td}>{res.service.name}</td>
                        <td style={styles.td}>{res.schedule.provider.name}</td>
                        <td style={styles.td}>{new Date(res.schedule.date).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          {new Date(res.schedule.startTime).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent reservations.</p>
              )}
            </div>
          </>
        )}
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
    backgroundColor: Colors.lightBg,
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 0,
  },
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '24px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed', // Fix sidebar to viewport
    top: 0,
    left: 0,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
    cursor: 'pointer',
  },
  logo: {
    maxWidth: '30%',
    height: 'auto',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    flex: 1,
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  navLink: {
    padding: '12px 16px',
    textDecoration: 'none',
    borderRadius: '6px',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s, color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navIcon: {
    fontSize: '18px',
  },
  logoutButton: {
    padding: '12px 16px',
    color: Colors.lightGrey,
    backgroundColor: Colors.textSecondary,
    border: 'none',
    textAlign: 'left',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '90%', // Push to bottom
  },
  logoutIcon: {
    fontSize: '18px',
  },
  main: {
    flex: 1,
    padding: '32px',
    marginLeft: '260px', // Offset for fixed sidebar
    zIndex: 1,
  },
  mainTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '32px',
    fontWeight: '700',
    color: Colors.vibrantPlum,
    marginBottom: '24px',
  },
  error: {
    color: '#dc2626',
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontSize: '16px',
    marginBottom: '20px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s',
  },
  statTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '16px',
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: '8px',
  },
  statValue: {
    fontFamily: "'Inter', -apple-system, Arial, sans-serif",
    fontSize: '24px',
    fontWeight: '700',
    color: Colors.vibrantPlum,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    padding: '24px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: Colors.textSecondary,
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
  },
  reservationsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
  },
  sectionTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: '24px',
    fontWeight: '600',
    color: Colors.vibrantPlum,
    marginBottom: '16px',
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

export default AdminDashboard;