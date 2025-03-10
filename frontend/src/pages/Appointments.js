import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';
import { appointmentAPI } from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await appointmentAPI.getAppointments();
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (selectedAppointment) {
      try {
        setLoading(true);
        setError('');
        await appointmentAPI.cancelAppointment(selectedAppointment.appointment_id, cancelReason);
        await fetchAppointments();
        setOpenCancelDialog(false);
        setCancelReason('');
        setSelectedAppointment(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel appointment');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Upcoming Appointments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              <List>
                {appointments
                  .filter(apt => apt.status === 'Pending')
                  .map((appointment) => (
                    <ListItem key={appointment.appointment_id}>
                      <ListItemText
                        primary={`Dr. ${appointment.doctor_name}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {new Date(appointment.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                              {new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {' - '}
                              {new Date(`2000-01-01T${appointment.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelClick(appointment)}
                        >
                          Cancel
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                {appointments.filter(apt => apt.status === 'Pending').length === 0 && (
                  <ListItem>
                    <ListItemText primary="No upcoming appointments" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Past Appointments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Past Appointments
              </Typography>
              <List>
                {appointments
                  .filter(apt => apt.status === 'Completed')
                  .map((appointment) => (
                    <ListItem key={appointment.appointment_id}>
                      <ListItemText
                        primary={`Dr. ${appointment.doctor_name}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {new Date(appointment.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                              {new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {' - '}
                              {new Date(`2000-01-01T${appointment.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                {appointments.filter(apt => apt.status === 'Completed').length === 0 && (
                  <ListItem>
                    <ListItemText primary="No past appointments" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Cancelled Appointments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cancelled Appointments
              </Typography>
              <List>
                {appointments
                  .filter(apt => apt.status === 'Cancelled')
                  .map((appointment) => (
                    <ListItem key={appointment.appointment_id}>
                      <ListItemText
                        primary={`Dr. ${appointment.doctor_name}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {new Date(appointment.date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                              {new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {' - '}
                              {new Date(`2000-01-01T${appointment.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </ListItem>
                  ))}
                {appointments.filter(apt => apt.status === 'Cancelled').length === 0 && (
                  <ListItem>
                    <ListItemText primary="No cancelled appointments" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Cancel Appointment Dialog */}
      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel your appointment with Dr. {selectedAppointment?.doctor_name}?
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Cancellation"
            fullWidth
            multiline
            rows={4}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No, Keep It</Button>
          <Button onClick={handleCancelConfirm} color="error">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments; 