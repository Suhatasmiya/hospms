export const mockDoctors = [
  {
    id: 1,
    name: 'Dr. John Smith',
    specialization: 'Cardiologist',
    experience: 10,
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    specialization: 'Pediatrician',
    experience: 8,
  },
  {
    id: 3,
    name: 'Dr. Michael Brown',
    specialization: 'Dermatologist',
    experience: 12,
  },
  {
    id: 4,
    name: 'Dr. Emily Davis',
    specialization: 'Neurologist',
    experience: 15,
  },
  {
    id: 5,
    name: 'Dr. Robert Wilson',
    specialization: 'Orthopedist',
    experience: 9,
  },
];

export const mockAppointments = [
  {
    id: 1,
    doctor_name: 'Dr. John Smith',
    date: '2024-03-15',
    time_slot: 10,
    status: 'upcoming',
    concern: 'Chest pain',
    symptoms: 'Shortness of breath, fatigue',
    diagnosis: 'Pending',
    prescription: null,
  },
  {
    id: 2,
    doctor_name: 'Dr. Sarah Johnson',
    date: '2024-03-16',
    time_slot: 14,
    status: 'completed',
    concern: 'Regular checkup',
    symptoms: 'None',
    diagnosis: 'Healthy condition',
    prescription: 'Vitamin supplements',
  },
];

export const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  gender: 'Male',
  medicalHistory: {
    conditions: ['Hypertension', 'Asthma'],
    surgeries: ['Appendectomy (2018)'],
    medications: ['Blood pressure medication', 'Inhaler'],
  },
};

export const mockMedicalHistory = [
  {
    id: 1,
    date: '2024-02-15',
    doctor_name: 'Dr. Sarah Johnson',
    diagnosis: 'Common cold',
    prescription: 'Antibiotics, Cough syrup',
    notes: 'Rest recommended for 5 days',
  },
  {
    id: 2,
    date: '2023-12-10',
    doctor_name: 'Dr. Michael Brown',
    diagnosis: 'Skin infection',
    prescription: 'Topical cream',
    notes: 'Apply twice daily',
  },
]; 