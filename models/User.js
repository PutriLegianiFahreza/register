const db = require('../config/db');  // Memperbarui path untuk mengimpor db.js dari folder config

// Fungsi untuk mengambil data pengguna berdasarkan email
exports.getUserByEmail = (email, callback) => {
  const query = 'SELECT name, email, password FROM community WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result[0]);  // Mengembalikan data pengguna pertama yang ditemukan
    }
  });
};

// Fungsi untuk memperbarui profil pengguna
exports.updateUserProfile = (email, userData, callback) => {
  const { name, password, phone, date_of_birth, address, photo } = userData;

  const query = `
    UPDATE community
    SET name = ?, password = ?, phone = ?, date_of_birth = ?, address = ?, photo = ?
    WHERE email = ?
  `;
  const values = [name, password, phone, date_of_birth, address, photo, email];

  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};
