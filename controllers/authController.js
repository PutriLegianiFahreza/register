const nodemailer = require('nodemailer'); // Pastikan nodemailer sudah terinstall
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { sendOtpEmail } = require('../utils/email');

const SECRET_KEY = process.env.SECRET_KEY;

// Konfigurasi nodemailer untuk mengirim email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Pastikan sudah set di .env
        pass: process.env.EMAIL_PASS  // Pastikan sudah set di .env
    }
});

// Endpoint register
exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Cek apakah email sudah terdaftar
    db.query('SELECT * FROM community WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        const otp = crypto.randomInt(100000, 999999).toString();

        db.query(
            'INSERT INTO community (name, email, password, phone, otp_code, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, otp, 0],
            async (err) => {
                if (err) return res.status(500).json({ error: err.message });

                await sendOtpEmail(email, otp);
                res.status(201).json({ message: 'Registrasi berhasil! OTP telah dikirim ke email.' });
            }
        );
    });
};

// Login endpoint
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const db = req.db; // Akses koneksi database dari `req`
  db.query('SELECT * FROM community WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(400).json({ message: 'Email belum terdaftar' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Buat token
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login berhasil!', token });
  });
};

// Endpoint verifikasi OTP
exports.verifyOtp = (req, res) => {
    const { email, otp_code } = req.body;

    // Cek apakah email dan otp_code ada di database
    db.query('SELECT * FROM community WHERE email = ? AND otp_code = ?', [email, otp_code], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Jika tidak ditemukan data dengan email dan otp_code yang cocok
        if (results.length === 0) {
            return res.status(400).json({ message: 'OTP tidak valid' });
        }

        // Update status pengguna menjadi terverifikasi
        db.query('UPDATE community SET is_verified = 1 WHERE email = ?', [email], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Akun berhasil diverifikasi' });
        });
    });
};

// Endpoint lupa password
// authController.js
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log('Forgot password request received for email:', email);
  
    db.query('SELECT * FROM community WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ message: 'Email tidak ditemukan' });
      }
  
      console.log('Email found in database:', email);
  
      const resetUrl = `http://localhost:3000/reset-password/${email}`;
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        text: `Anda telah meminta untuk mengatur ulang password. Klik link ini untuk mengatur ulang password Anda: ${resetUrl}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: 'Error saat mengirim email', error: error.message });
        }
        res.status(200).json({ message: 'Email reset password telah dikirim' });
      });
    });
  };  



// Endpoint reset password
exports.resetPassword = async (req, res) => {
    const email = req.params.email;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: 'Password baru harus diisi' });
    }

    // Enkripsi password baru
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update password di database
    db.query('UPDATE community SET password = ? WHERE email = ?', [hashedPassword, email], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Password berhasil diperbarui' });
    });
};

//endpoint logout

// authController.js
exports.logout = (req, res) => {
    console.log('Logout function called');
    
    res.status(200).json({ message: 'You have been logged out successfully' });
  };
  