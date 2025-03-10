import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const patientAPI = {
  getMedicalHistory: () => api.get('/patients/medical-history'),
  updateMedicalHistory: (data) => api.put('/patients/medical-history', data),
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
};

export const appointmentAPI = {
  getAppointments: () => api.get('/appointments'),
  createAppointment: (data) => api.post('/appointments', data),
  cancelAppointment: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  getDoctorAvailability: (doctorId, date) => 
    api.get(`/appointments/availability/${doctorId}`, { params: { date } }),
};

export const doctorAPI = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorSchedule: (doctorId) => api.get(`/doctors/${doctorId}/schedule`),
};

export default api; 