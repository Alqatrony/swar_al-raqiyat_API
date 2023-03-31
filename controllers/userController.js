const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.register({ name, email, password });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// User login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create and sign JWT token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token in response
    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // Get the user from the request (the user should be attached by the authentication middleware)
    const user = req.user;

    // Check if user exists
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Send success response with user profile data
    res.status(200).json({
      message: 'User profile fetched successfully',
      userProfile: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // Add any other fields you would like to include in the user profile
      },
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    // Get the user from the request (the user should be attached by the authentication middleware)
    const user = req.user;

    // Check if user exists
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update user's profile with the provided data
    Object.assign(user, req.body);
    await user.save();

    // Send success response with updated user profile data
    res.status(200).json({
      message: 'User profile updated successfully',
      userProfile: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // Add any other fields you would like to include in the user profile
      },
    });
  } catch (error) {
    // Send error response
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

// Delete user profile (requires authentication)
exports.deleteUserProfile = async (req, res) => {
  try {
    // Remove user profile
    await User.findOneAndRemove({ _id: req.user.id });

    // Return success message
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error deleting user profile', error });
  }
};

module.exports = exports;