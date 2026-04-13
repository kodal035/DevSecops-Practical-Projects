require('dotenv').config();
const mysql = require('mysql2');

const requiredDbEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingDbEnv = requiredDbEnv.filter((key) => !process.env[key]);

if (missingDbEnv.length > 0) {
  throw new Error(`Missing required DB environment variables: ${missingDbEnv.join(', ')}`);
}

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});

module.exports = db;
