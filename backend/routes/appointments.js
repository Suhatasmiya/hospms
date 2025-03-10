const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'hospms'
});

// Get all appointments for a patient
router.get('/', (req, res) => {
    const patientId = req.query.patientId;
    const q = `
        SELECT a.*, d.name as doctor_name 
        FROM Appointments a 
        JOIN Doctors d ON a.doctor_id = d.doctor_id 
        WHERE a.patient_id = ?
        ORDER BY a.date DESC, a.start_time ASC
    `;
    
    db.query(q, [patientId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Create new appointment
router.post('/', (req, res) => {
    const q = "INSERT INTO Appointments (`patient_id`, `doctor_id`, `date`, `start_time`, `end_time`) VALUES (?)";
    const values = [
        req.body.patient_id,
        req.body.doctor_id,
        req.body.date,
        req.body.start_time,
        req.body.end_time
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        
        // Create medical history entry if concerns/symptoms are provided
        if (req.body.concerns || req.body.symptoms) {
            const historyQ = "INSERT INTO Medical_History (patient_id, appointment_id, conditions) VALUES (?, ?, ?)";
            const concerns = `Concerns: ${req.body.concerns || ''}\nSymptoms: ${req.body.symptoms || ''}`;
            
            db.query(historyQ, [req.body.patient_id, data.insertId, concerns], (historyErr) => {
                if (historyErr) console.error('Error creating medical history:', historyErr);
            });
        }
        
        return res.status(200).json("Appointment has been created successfully.");
    });
});

// Cancel appointment
router.put('/:id/cancel', (req, res) => {
    const q = "UPDATE Appointments SET `status`='Cancelled' WHERE appointment_id = ?";
    
    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Appointment has been cancelled successfully.");
    });
});

// Get available slots for a doctor
router.get('/availability/:doctorId', (req, res) => {
    const doctorId = req.params.doctorId;
    const date = req.query.date;
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    
    // First get doctor's schedule for that day
    const scheduleQ = "SELECT * FROM Schedules WHERE doctor_id = ? AND day = ?";
    
    db.query(scheduleQ, [doctorId, dayOfWeek], (err, scheduleData) => {
        if (err) return res.status(500).json(err);
        if (scheduleData.length === 0) return res.json([]);
        
        // Then get existing appointments
        const appointmentsQ = `
            SELECT start_time, end_time 
            FROM Appointments 
            WHERE doctor_id = ? 
            AND date = ? 
            AND status != 'Cancelled'
        `;
        
        db.query(appointmentsQ, [doctorId, date], (err, appointmentsData) => {
            if (err) return res.status(500).json(err);
            
            // Calculate available slots
            const schedule = scheduleData[0];
            const bookedSlots = appointmentsData;
            const availableSlots = calculateAvailableSlots(schedule, bookedSlots);
            
            return res.json(availableSlots);
        });
    });
});

function calculateAvailableSlots(schedule, bookedSlots) {
    // Implementation of slot calculation logic
    // This is a simplified version - you might want to enhance it
    const slots = [];
    let currentTime = new Date(`2000-01-01T${schedule.start_time}`);
    const endTime = new Date(`2000-01-01T${schedule.end_time}`);
    
    while (currentTime < endTime) {
        const slotStart = currentTime.toTimeString().slice(0, 8);
        currentTime.setMinutes(currentTime.getMinutes() + 30);
        const slotEnd = currentTime.toTimeString().slice(0, 8);
        
        // Check if slot is available
        const isBooked = bookedSlots.some(booking => 
            booking.start_time <= slotStart && booking.end_time > slotStart
        );
        
        if (!isBooked) {
            slots.push({
                start_time: slotStart,
                end_time: slotEnd
            });
        }
    }
    
    return slots;
}

module.exports = router; 