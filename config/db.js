const mysql = require('mysql');

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Sesuaikan dengan username MySQL Anda
  password: '',          // Sesuaikan dengan password MySQL Anda
  database: 'ppl_ewhale' // Sesuaikan dengan nama database Anda
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Jika gagal terhubung, hentikan aplikasi
  }
  console.log('Database connected!');
});

module.exports = db;
