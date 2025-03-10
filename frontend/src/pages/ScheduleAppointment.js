import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { doctorAPI, appointmentAPI } from '../services/api';

const StyledPaper = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
}));

const TimeSlotButton = styled(Button)(({ theme, selected }) => ({
  margin: theme.spacing(1),
  minWidth: '100px',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.primary.light,
  },
}));

const ScheduleAppointment = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [concern, setConcern] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getDoctorAvailability(
        selectedDoctor,
        selectedDate.toISOString().split('T')[0]
      );
      setAvailableSlots(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleDoctorSelect = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedTime(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !concern || !symptoms) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await appointmentAPI.createAppointment({
        doctor_id: selectedDoctor,
        date: selectedDate.toISOString().split('T')[0],
        start_time: selectedTime.start_time,
        end_time: selectedTime.end_time,
        concern,
        symptoms,
      });

      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading && doctors.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Schedule New Appointment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Select Doctor
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Choose Doctor</InputLabel>
              <Select
                value={selectedDoctor}
                label="Choose Doctor"
                onChange={handleDoctorSelect}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>
              Select Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
              />
            </LocalizationProvider>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Appointment Details
            </Typography>
            <TextField
              fullWidth
              label="What is your concern?"
              multiline
              rows={3}
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Describe your symptoms"
              multiline
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom>
              Select Time
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Available time slots for {selectedDate.toLocaleDateString()}
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                {success}
              </Alert>
            )}
            {loading && selectedDoctor ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
                {availableSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.start_time}
                    variant="outlined"
                    selected={selectedTime?.start_time === slot.start_time}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TimeSlotButton>
                ))}
                {availableSlots.length === 0 && selectedDoctor && (
                  <Typography color="textSecondary">
                    No available slots for this date
                  </Typography>
                )}
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBookAppointment}
              disabled={loading || !selectedTime || !selectedDoctor || !concern || !symptoms}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ScheduleAppointment; 