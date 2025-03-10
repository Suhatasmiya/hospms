import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { mockDoctors } from '../data/mockData';

const StyledPaper = styled(Paper)(({ theme }) => ({
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

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Mock available time slots (9 AM to 5 PM)
  const availableSlots = Array.from({ length: 9 }, (_, i) => i + 9);
  const doctor = mockDoctors.find(d => d.id === parseInt(doctorId));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    // For demo purposes, just show success and navigate back
    setSuccess('Appointment booked successfully!');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Appointment with {doctor?.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledPaper>
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {availableSlots.map((time) => (
                  <TimeSlotButton
                    key={time}
                    variant="outlined"
                    selected={selectedTime === time}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}:00
                  </TimeSlotButton>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBookAppointment}
                sx={{ mt: 3 }}
                disabled={!selectedTime}
              >
                Book Appointment
              </Button>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AppointmentBooking; 