import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import ClientDashboard from './components/client/Dashboard';
import AdminDashboard from './components/admin/Dashboard';

const App = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  useEffect(() => {
    // Allow /login and /register for unauthenticated users
    if (!user && !['/login', '/register'].includes(location.pathname)) {
      navigate('/');
    } else if (user) {
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'CLIENT') navigate('/client/dashboard');
    }
  }, [user, navigate, location.pathname]);

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | 
        {!user && <Link to="/register">Register</Link>} | 
        {!user && <Link to="/login">Login</Link>} | 
        {user && <button onClick={logout}>Logout</button>}
      </nav>
      <h1>Wellbeing Reservations</h1>
      {user && <p>Welcome, {user.name} ({user.role})</p>}
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;