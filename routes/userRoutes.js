const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');  // Add this line to import authController
const authMiddleware = require('../Middleware/authMiddleware');
const multer = require('multer');

// Setup multer untuk menangani upload foto
const upload = multer({ dest: 'uploads/photos/' });

// Rute untuk registrasi
router.post('/register', (req, res) => authController.register(req, res, req.db));

// Profile Route
router.get('/profile', authMiddleware, (req, res) => userController.profile(req, res, req.db));

// Update Profile Route
router.post('/update', authMiddleware, upload.single('photo'), (req, res) => {
    userController.updateProfile(req, res, req.db);
  });

module.exports = router;
