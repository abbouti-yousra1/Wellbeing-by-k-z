import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ClientDashboard from './components/client/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import Users from './components/admin/Users';
import Services from './components/admin/Services';
import Cabinets from './components/admin/Cabinets';
import Providers from './components/admin/Providers';
import Schedules from './components/admin/Schedules';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="users" element={<Users />} />
            <Route path="services" element={<Services />} />
            <Route path="cabinets" element={<Cabinets />} />
            <Route path="providers" element={<Providers />} />
            <Route path="schedules" element={<Schedules />} />
          </Route>
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;