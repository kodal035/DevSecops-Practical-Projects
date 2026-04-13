const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const util = require('util');

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error('JWT_SECRET is not set. Configure it in the environment before starting the API.');
}

// Promisify DB query
const query = util.promisify(db.query).bind(db);

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'viewer']
    );

    res.status(201).json({ message: 'User registered', id: result.insertId });
  } catch (err) {
    console.error('Registration Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists. Please login.' });
    }

    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ message: 'Users table is missing. Run MySQL setup first.' });
    }

    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({ message: 'Database access denied. Check DB_USER/DB_PASSWORD.' });
    }

    if (err.code === 'ER_BAD_DB_ERROR') {
      return res.status(500).json({ message: 'Database not found. Check DB_NAME and create it.' });
    }

    res.status(500).json({ message: `Registration failed (${err.code || 'UNKNOWN_ERROR'})` });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const results = await query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

