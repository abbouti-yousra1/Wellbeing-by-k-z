import React, { useContext, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Dashboard</h2>
        <nav style={styles.nav}>
          <NavLink
            to="/admin/users"
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? '#2563eb' : 'transparent',
            })}
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/services"
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? '#2563eb' : 'transparent',
            })}
          >
            Services
          </NavLink>
          <NavLink
            to="/admin/cabinets"
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? '#2563eb' : 'transparent',
            })}
          >
            Cabinets
          </NavLink>
          <NavLink
            to="/admin/providers"
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? '#2563eb' : 'transparent',
            })}
          >
            Providers
          </NavLink>
          <NavLink
            to="/admin/schedules"
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? '#2563eb' : 'transparent',
            })}
          >
            Schedules
          </NavLink>
          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <h1 style={styles.mainTitle}>Welcome, {user.name}</h1>
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
    backgroundColor: '#f3f4f6',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1e40af',
    color: '#fff',
    padding: '20px',
  },
  sidebarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  navLink: {
    padding: '10px 15px',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  logoutButton: {
    padding: '10px 15px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  main: {
    flex: 1,
    padding: '20px',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

export default AdminDashboard;