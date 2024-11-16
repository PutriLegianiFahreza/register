const express = require('express');
const mysql = require('mysql');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ppl_ewhale'
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Database connected!');
});

// Middleware untuk menyediakan koneksi database di setiap request
app.use((req, res, next) => {
  req.db = db; // Menyuntikkan koneksi database ke `req`
  next();
});

// Menggunakan rute
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
