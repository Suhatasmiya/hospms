const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/auth')
const patientRoutes = require('./routes/patients')
const appointmentRoutes = require('./routes/appointments')
const doctorRoutes = require('./routes/doctors')

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'hospms'
})

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database successfully!');
});

// Handle database errors
db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed. Reconnecting...');
        db.connect();
    } else {
        throw err;
    }
});

app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/doctors', doctorRoutes)

app.post('/hospms', (req, res) => {
    const q = "INSERT INTO hospms (`name`, `email`, `phone`, `address`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.address
    ]
    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    })
})

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})