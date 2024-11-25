const mysql = require('mysql');

const db = mysql.createConnection({
  host: '127.0.0.1', 
  user: 'root',     
  password: '',    
  database: 'user'  
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = db;
