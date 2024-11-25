const mysql = require('mysql');

// Database Connection
const db = mysql.createConnection({
  host: '127.0.0.1', // Your database host
  user: 'root',      // Your database username
  password: '',      // Your database password
  database: 'user'   // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = db;
