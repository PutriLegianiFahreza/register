const userModel = require('../models/User');
const bcrypt = require('bcrypt');

// Fungsi untuk menampilkan profil pengguna
exports.profile = (req, res) => {
  const email = req.user.email; // Mengambil email dari token yang sudah diverifikasi

  // Mengambil data pengguna dari database menggunakan email
  userModel.getUserByEmail(email, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pengguna', error: err });
    }

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Hanya mengembalikan data yang relevan (name, email)
    const { name, email } = user;
    res.status(200).json({ name, email });
  });
};

// Fungsi untuk memperbarui profil pengguna
exports.updateProfile = async (req, res, db) => {
  const { name, password, phone, date_of_birth, address } = req.body;
  const email = req.user.email;  // Ambil email dari token yang sudah terverifikasi
  
  if (!name || !phone || !date_of_birth || !address) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  // Cek apakah ada file foto yang diunggah
  let photoPath = null;
  if (req.file) {
    photoPath = req.file.path; // Path foto yang diunggah
  }

  // Jika password baru, enkripsi password
  let hashedPassword = password;
  if (password) {
    try {
      hashedPassword = await bcrypt.hash(password, 10); // Enkripsi password
    } catch (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan saat mengenkripsi password', error: err });
    }
  }

  const userData = {
    name,
    password: hashedPassword,
    phone,
    date_of_birth,
    address,
    photo: photoPath,
  };

  // Update profil pengguna di database
  db.query('UPDATE community SET name = ?, password = ?, phone = ?, date_of_birth = ?, address = ?, photo = ? WHERE email = ?', 
  [name, hashedPassword, phone, date_of_birth, address, photoPath, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui profil', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json({ message: 'Profil berhasil diperbarui' });
  });
};
