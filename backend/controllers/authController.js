const db = require('../config/db');
const bcrypt = require('bcrypt');

// Register a new user
exports.register = (req, res) => {
  const { email, password, role } = req.body;

  // Check if email is already registered
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database query error during registration:', err); // Log the error
      return res.status(500).json({ error: 'Database error occurred during registration.' });
    }
    if (results.length > 0) {
      console.log('Email already exists:', email); // Debug
      return res.status(400).json({ error: 'Email already registered.' });
    }
  
    // Hash the password
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (email, password, roles) VALUES (?, ?, ?)';
      db.query(query, [email, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Error inserting user into the database:', err); // Log
          return res.status(500).json({ error: 'Error inserting user into the database.' });
        }
        console.log('User registered successfully:', result); // Debug
        res.status(201).json({ message: 'User registered successfully!' });
      });
    } catch (hashError) {
      console.error('Error hashing password:', hashError); // Debug
      return res.status(500).json({ error: 'Error hashing the password.' });
    }
  });  
};

// Login a user
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database query error during login:', err); // Debug
      return res.status(500).json({ error: 'Database error during login.' });
    }
    if (results.length === 0) {
      console.log('User not found:', email); // Debug
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }
  
    const user = results[0];
    console.log('User found:', user); // Debug
  
    // Compare passwords
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', email); // Debug
        return res.status(401).json({ error: 'Invalid login credentials.' });
      }
  
      console.log('Successful login for user:', email); // Debug
      res.status(200).json({
        message: 'Login successful!',
        role: user.roles,
        adminum: user.adminum || null,
        officernum: user.officernum || null,
      });
    } catch (compareError) {
      console.error('Error comparing passwords:', compareError); // Debug
      res.status(500).json({ error: 'Error during password comparison.' });
    }
  });  
};
