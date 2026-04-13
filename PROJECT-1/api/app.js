const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('./models/db'); // MySQL connection

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);    // 🔐 Login/Register
app.use('/api/users', userRoutes);   // 👤 User management

// Auto-create or reset admin user
const initAdminUser = async () => {
  if (process.env.SEED_ADMIN_USER !== 'true') {
    console.log('ℹ️ Admin seed skipped (set SEED_ADMIN_USER=true to enable).');
    return;
  }

  const name = process.env.DEFAULT_ADMIN_NAME || 'Admin User';
  const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  const role = process.env.DEFAULT_ADMIN_ROLE || 'admin';
  const saltRounds = 10;

  if (!password) {
    console.warn('⚠️ DEFAULT_ADMIN_PASSWORD is missing. Admin seed skipped for security.');
    return;
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('❌ Error checking admin existence:', err);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (results.length === 0) {
      // Insert new admin
      db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role],
        (err, result) => {
          if (err) return console.error('❌ Failed to insert admin:', err);
          console.log(`✅ Admin user created: ${email}`);
        }
      );
    } else {
      // Optionally reset password if RESET_ADMIN_PASS=true
      if (process.env.RESET_ADMIN_PASS === 'true') {
        db.query(
          'UPDATE users SET password = ?, name = ?, role = ? WHERE email = ?',
          [hashedPassword, name, role, email],
          (err, result) => {
            if (err) return console.error('❌ Failed to reset admin password:', err);
            console.log(`🔁 Admin password reset for: ${email}`);
          }
        );
      } else {
        console.log('✅ Admin user already exists.');
      }
    }
  });
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  initAdminUser(); // 👤 Ensure admin exists on boot
});

