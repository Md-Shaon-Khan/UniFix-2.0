const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Route (Requires Token)
router.get('/me', auth, authController.me);

module.exports = router;