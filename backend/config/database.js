const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'hospms',
    port: 3306
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Please check your MySQL username and password');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Please check if MySQL server is running');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database "hospms" does not exist');
        }
        return;
    }
    console.log('Connected to database successfully!');
    
    // Test query to verify table exists
    db.query('SHOW TABLES LIKE "Patients"', (err, results) => {
        if (err) {
            console.error('Error checking tables:', err);
            return;
        }
        if (results.length === 0) {
            console.error('Warning: Patients table does not exist!');
        } else {
            console.log('Patients table exists and is accessible');
        }
    });
});

// Handle database errors
db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed. Reconnecting...');
        handleDisconnect();
    } else {
        console.error('Database error:', err);
    }
});

function handleDisconnect() {
    db.connect((err) => {
        if (err) {
            console.error('Error reconnecting:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
}

module.exports = db; 