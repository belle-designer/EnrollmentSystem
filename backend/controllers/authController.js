const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
  const { email, password, role } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database query error during registration:', err);
      return res.status(500).json({ error: 'Database error occurred during registration.' });
    }
    if (results.length > 0) {
      console.log('Email already exists:', email); 
      return res.status(400).json({ error: 'Email already registered.' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (email, password, roles) VALUES (?, ?, ?)';
      db.query(query, [email, hashedPassword, role], (err, result) => {
        if (err) {
          console.error('Error inserting user into the database:', err);
          return res.status(500).json({ error: 'Error inserting user into the database.' });
        }
        console.log('User registered successfully:', result);
        res.status(201).json({ message: 'User registered successfully!' });
      });
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ error: 'Error hashing the password.' });
    }
  });  
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database query error during login:', err); 
      return res.status(500).json({ error: 'Database error during login.' });
    }
    if (results.length === 0) {
      console.log('User not found:', email); 
      return res.status(401).json({ error: 'Invalid login credentials.' });
    }
  
    const user = results[0];
    console.log('User found:', user);
  
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch for user:', email);
        return res.status(401).json({ error: 'Invalid login credentials.' });
      }
  
      console.log('Successful login for user:', email);
      res.status(200).json({
        message: 'Login successful!',
        role: user.roles,
        adminum: user.adminum || null,
        officernum: user.officernum || null,
      });
    } catch (compareError) {
      console.error('Error comparing passwords:', compareError);
      res.status(500).json({ error: 'Error during password comparison.' });
    }
  });  
};
