const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Register route
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        // Validate required fields
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.gender) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'All fields are required: name, email, password, gender' });
        }

        const q = "INSERT INTO Patients (`name`, `email`, `password`, `gender`, `street`, `city`, `state`, `zip_code`) VALUES (?)";
        const values = [
            req.body.name,
            req.body.email,
            req.body.password,
            req.body.gender,
            req.body.street || '',
            req.body.city || '',
            req.body.state || '',
            req.body.zip_code || ''
        ];

        console.log('Executing SQL Query:', q);
        console.log('With values:', values);

        db.query(q, [values], (err, data) => {
            if (err) {
                console.error('MySQL Error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ 
                    error: 'Registration failed',
                    details: err.message,
                    code: err.code
                });
            }
            console.log('Registration successful:', data);
            return res.status(200).json({
                message: "User has been created successfully",
                userId: data.insertId
            });
        });
    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Login route
router.post('/login', (req, res) => {
    console.log('Login attempt for email:', req.body.email);
    
    const q = "SELECT * FROM Patients WHERE email = ? AND password = ?";
    
    db.query(q, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            console.log('No user found with these credentials');
            return res.status(404).json("User not found!");
        }
        
        const { password, ...userWithoutPassword } = data[0];
        console.log('Login successful for user:', userWithoutPassword);
        return res.status(200).json(userWithoutPassword);
    });
});

module.exports = router; 