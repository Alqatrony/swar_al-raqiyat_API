const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

// Get user profile (requires authentication)
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getUserProfile);

// Update user profile (requires authentication)
router.put('/profile', passport.authenticate('jwt', { session: false }), userController.updateUserProfile);

// Delete user profile (requires authentication)
router.delete('/profile', passport.authenticate('jwt', { session: false }), userController.deleteUserProfile);

module.exports = router;