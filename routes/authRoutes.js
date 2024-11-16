const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login endpoint
router.post('/login', (req, res) => {
  console.log('Login route hit');
  authController.login(req, res); // Tidak perlu meneruskan `db` karena sudah tersedia di `req.db`
});

// Tambahkan route lainnya seperti verify-otp, forgot-password, dll.
// Contoh:
router.post('/verify-otp', (req, res) => {
  console.log('Verify-otp route hit');
  authController.verifyOtp(req, res);
});

router.post('/forgot-password', (req, res) => {
  console.log('Forgot-password route hit');
  authController.forgotPassword(req, res);
});

router.put('/reset-password/:email', (req, res) => {
  console.log('Reset-password route hit');
  authController.resetPassword(req, res);
});

router.post('/logout', (req, res) => {
  console.log('Logout route hit');
  authController.logout(req, res);
});

module.exports = router;
