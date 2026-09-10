import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Report from './pages/Report';
import Temporal from './pages/Temporal';
import Overview from './pages/Overview';
import Awareness from './pages/Awareness';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import DashboardLayout from './components/DashboardLayout';

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D17] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      {!isDashboard && <Navbar />}
      
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="overview" element={<Overview />} />
            <Route path="temporal" element={<Temporal />} />
            <Route path="history" element={<History />} />
            <Route path="report" element={<Report />} />
            <Route path="awareness" element={<Awareness />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}