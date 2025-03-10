import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { mockDoctors, mockAppointments, mockUser } from '../data/mockData';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [doctors] = useState(mockDoctors);
  const [appointments] = useState(mockAppointments);
  const user = mockUser;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hospital Management System
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                Available Doctors
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/doctors')}
              >
                View All Doctors
              </Button>
            </Box>
            <Grid container spacing={3}>
              {doctors.slice(0, 4).map((doctor) => (
                <Grid item xs={12} sm={6} key={doctor.id}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {doctor.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {doctor.specialization}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Experience: {doctor.experience} years
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookAppointment(doctor.id)}
                      >
                        Book Appointment
                      </Button>
                    </Box>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Your Appointments
            </Typography>
            <Card>
              <List>
                {appointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={appointment.doctor_name}
                        secondary={`${new Date(appointment.date).toLocaleDateString()} at ${appointment.time_slot}:00`}
                      />
                    </ListItem>
                    {index < appointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {appointments.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No appointments scheduled" />
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PatientDashboard; 