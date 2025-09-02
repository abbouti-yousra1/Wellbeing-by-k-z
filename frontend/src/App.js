import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/public/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ClientDashboard from './components/client/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import Clients from './components/admin/Clients';
import Services from './components/admin/Services';
import ServiceCreate from './components/admin/ServiceCreate';
import ServiceEdit from './components/admin/ServiceEdit';
import Cabinets from './components/admin/Cabinets';
import Providers from './components/admin/Providers';
import Schedules from './components/admin/Schedules';
import ClientDetails from './components/admin/ClientDetails';
import CabinetCreate from './components/admin/CabinetCreate';
import CabinetEdit from './components/admin/CabinetEdit';
import ProviderCreate from './components/admin/ProviderCreate';
import ProviderEdit from './components/admin/ProviderEdit';
import ScheduleCreate from './components/admin/ScheduleCreate';
import ScheduleEdit from './components/admin/ScheduleEdit';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:clientId" element={<ClientDetails />} />
            <Route path="services" element={<Services />} />
            <Route path="services/create" element={<ServiceCreate />} />
            <Route path="services/:id/edit" element={<ServiceEdit />} />
            <Route path="cabinets" element={<Cabinets />} />
            <Route path="cabinets/create" element={<CabinetCreate />} />
      <Route path="cabinets/:id/edit" element={<CabinetEdit />} />
            <Route path="providers" element={<Providers />} />
            <Route path="providers/:id/edit" element={<ProviderEdit />} />
            <Route path="providers/create" element={<ProviderCreate />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="schedules/:id/edit" element={<ScheduleEdit />} />
            <Route path="schedules/create" element={<ScheduleCreate />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;