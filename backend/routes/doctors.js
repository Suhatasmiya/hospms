const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'hospms'
});

// Get all doctors
router.get('/', (req, res) => {
    const q = "SELECT doctor_id, name, gender FROM Doctors";
    
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Get doctor's schedule
router.get('/:id/schedule', (req, res) => {
    const doctorId = req.params.id;
    const q = "SELECT * FROM Schedules WHERE doctor_id = ?";
    
    db.query(q, [doctorId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Update doctor's schedule
router.post('/:id/schedule', (req, res) => {
    const doctorId = req.params.id;
    const schedules = req.body.schedules; // Array of schedules
    
    // First delete existing schedules
    const deleteQ = "DELETE FROM Schedules WHERE doctor_id = ?";
    db.query(deleteQ, [doctorId], (err) => {
        if (err) return res.status(500).json(err);
        
        // Then insert new schedules
        const insertQ = "INSERT INTO Schedules (doctor_id, day, start_time, end_time, breaks) VALUES ?";
        const values = schedules.map(schedule => [
            doctorId,
            schedule.day,
            schedule.start_time,
            schedule.end_time,
            schedule.breaks || '00:30:00'
        ]);
        
        db.query(insertQ, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Schedule has been updated successfully.");
        });
    });
});

module.exports = router; 