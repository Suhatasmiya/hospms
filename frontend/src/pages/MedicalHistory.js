import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { patientAPI } from '../services/api';

const MedicalHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    conditions: '',
    surgeries: '',
    medication: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [profileRes, historyRes] = await Promise.all([
        patientAPI.getProfile(),
        patientAPI.getMedicalHistory(),
      ]);

      setProfile(profileRes.data);
      setMedicalHistory(historyRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load medical history');
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = () => {
    if (medicalHistory) {
      setEditData({
        conditions: medicalHistory.conditions || '',
        surgeries: medicalHistory.surgeries || '',
        medication: medicalHistory.medication || '',
      });
    }
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEditSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      await patientAPI.updateMedicalHistory(editData);
      await fetchData();
      handleEditClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update medical history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Medical History
        </Typography>
        <Button variant="contained" color="primary" onClick={handleEditOpen}>
          Update Medical History
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={profile?.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Gender"
                    secondary={profile?.gender}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={profile?.email}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Medical Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Medical Conditions
                </Typography>
                <Typography>
                  {medicalHistory?.conditions || 'No conditions recorded'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Surgeries
                </Typography>
                <Typography>
                  {medicalHistory?.surgeries || 'No surgeries recorded'}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Current Medications
                </Typography>
                <Typography>
                  {medicalHistory?.medication || 'No medications recorded'}
                </Typography>
              </Box>
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
              {medicalHistory?.appointments?.map((appointment) => (
                <Box key={appointment.appointment_id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" color="primary">
                    {new Date(appointment.date).toLocaleDateString()} - Dr. {appointment.doctor_name}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2">Time</Typography>
                      <Typography>
                        {new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(`2000-01-01T${appointment.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="subtitle2">Status</Typography>
                      <Chip
                        label={appointment.status}
                        color={appointment.status === 'Completed' ? 'success' : 'default'}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))}
              {(!medicalHistory?.appointments || medicalHistory.appointments.length === 0) && (
                <Typography>No past appointments</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Medical History Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Update Medical History</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Medical Conditions"
              multiline
              rows={3}
              value={editData.conditions}
              onChange={(e) => setEditData({ ...editData, conditions: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Surgeries"
              multiline
              rows={3}
              value={editData.surgeries}
              onChange={(e) => setEditData({ ...editData, surgeries: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Current Medications"
              multiline
              rows={3}
              value={editData.medication}
              onChange={(e) => setEditData({ ...editData, medication: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicalHistory; 