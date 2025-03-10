import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Components
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './components/Layout';
import PatientDashboard from './pages/PatientDashboard';
import MedicalHistory from './pages/MedicalHistory';
import Appointments from './pages/Appointments';
import ScheduleAppointment from './pages/ScheduleAppointment';
import DoctorList from './pages/DoctorList';
import PrivateRoute from './components/PrivateRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#ffffff', // White
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes with layout */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <PatientDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/medical-history"
              element={
                <PrivateRoute>
                  <Layout>
                    <MedicalHistory />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <PrivateRoute>
                  <Layout>
                    <Appointments />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule-appointment"
              element={
                <PrivateRoute>
                  <Layout>
                    <ScheduleAppointment />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PrivateRoute>
                  <Layout>
                    <DoctorList />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
