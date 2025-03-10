const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'hospms'
});

// Get patient profile
router.get('/profile', (req, res) => {
    const patientId = req.query.id;
    const q = "SELECT * FROM Patients WHERE patient_id = ?";
    
    db.query(q, [patientId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("Patient not found!");
        
        const { password, ...other } = data[0];
        return res.status(200).json(other);
    });
});

// Update patient profile
router.put('/profile', (req, res) => {
    const patientId = req.body.patient_id;
    const q = "UPDATE Patients SET `name`=?, `gender`=?, `street`=?, `city`=?, `state`=?, `zip_code`=? WHERE patient_id = ?";
    
    const values = [
        req.body.name,
        req.body.gender,
        req.body.street,
        req.body.city,
        req.body.state,
        req.body.zip_code,
        patientId
    ];
    
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Profile has been updated successfully.");
    });
});

// Get patient medical history
router.get('/medical-history', (req, res) => {
    const patientId = req.query.id;
    const q = `
        SELECT mh.*, a.date as appointment_date, d.name as doctor_name
        FROM Medical_History mh
        LEFT JOIN Appointments a ON mh.appointment_id = a.appointment_id
        LEFT JOIN Doctors d ON a.doctor_id = d.doctor_id
        WHERE mh.patient_id = ?
        ORDER BY mh.date_time DESC
    `;
    
    db.query(q, [patientId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
});

// Update medical history
router.put('/medical-history', (req, res) => {
    const patientId = req.body.patient_id;
    const q = "INSERT INTO Medical_History (patient_id, medication, conditions, surgeries) VALUES (?, ?, ?, ?)";
    
    const values = [
        patientId,
        req.body.medication,
        req.body.conditions,
        req.body.surgeries
    ];
    
    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Medical history has been updated successfully.");
    });
});

module.exports = router; 