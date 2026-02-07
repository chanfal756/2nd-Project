const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, vessel, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Find default organization
    const Organization = require('../models/organization.model');
    const defaultOrg = await Organization.findOne({ slug: 'default' });

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Will be automatically hashed by pre-save middleware
      vessel: vessel || '',
      role: role || 'user', // Default to 'user' if not specified
      orgId: defaultOrg ? defaultOrg._id : undefined
    });

    // Generate token
    const token = generateToken(user._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          vessel: user.vessel,
          profileImage: user.profileImage,
          idNumber: user.idNumber,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('❌ Register error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          vessel: user.vessel,
          profileImage: user.profileImage,
          idNumber: user.idNumber,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private (Protected)
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          vessel: user.vessel,
          profileImage: user.profileImage,
          idNumber: user.idNumber,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user data',
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update
 * @access  Private (Protected)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email, vessel, profileImage, idNumber } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (vessel !== undefined) user.vessel = vessel;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (idNumber !== undefined) user.idNumber = idNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          vessel: user.vessel,
          profileImage: user.profileImage,
          idNumber: user.idNumber,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
