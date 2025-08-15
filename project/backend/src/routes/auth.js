import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper function to clean up duplicated names
const cleanUserName = (name) => {
  if (!name) return name;
  
  // Split by spaces and remove duplicates
  const nameParts = name.split(' ').filter((part, index, arr) => {
    // Keep the part if it's not a duplicate of the previous part
    return index === 0 || part !== arr[index - 1];
  });
  
  return nameParts.join(' ');
};

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name: cleanUserName(name.trim()),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: cleanUserName(user.name),
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to create account'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: cleanUserName(user.name),
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: {
        id: user._id,
        name: cleanUserName(user.name),
        email: user.email,
        role: user.role,
        stats: user.stats,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user information'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, preferences, location } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = cleanUserName(name.trim());
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.userId }
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: 'Email is already taken'
        });
      }
      
      user.email = email.toLowerCase().trim();
    }
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (location) user.location = location;

    await user.save();

    res.json({
      user: {
        id: user._id,
        name: cleanUserName(user.name),
        email: user.email,
        role: user.role,
        stats: user.stats,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile'
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Failed to change password'
    });
  }
});

// @route   POST /api/auth/fix-names
// @desc    Fix duplicated names for all users (admin only)
// @access  Private (Admin)
router.post('/fix-names', adminAuth, async (req, res) => {
  try {
    const users = await User.find({});
    let fixedCount = 0;
    
    for (const user of users) {
      const originalName = user.name;
      const cleanedName = cleanUserName(user.name);
      
      if (originalName !== cleanedName) {
        user.name = cleanedName;
        await user.save();
        fixedCount++;
        console.log(`Fixed user ${user.email}: "${originalName}" -> "${cleanedName}"`);
      }
    }
    
    res.json({
      message: `Fixed ${fixedCount} users with duplicated names`,
      fixedCount
    });
  } catch (error) {
    console.error('Fix names error:', error);
    res.status(500).json({
      error: 'Failed to fix user names'
    });
  }
});

// @route   POST /api/auth/fix-my-name
// @desc    Fix current user's duplicated name
// @access  Private
router.post('/fix-my-name', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    const originalName = user.name;
    const cleanedName = cleanUserName(user.name);
    
    if (originalName !== cleanedName) {
      user.name = cleanedName;
      await user.save();
      
      res.json({
        message: 'Name fixed successfully',
        user: {
          id: user._id,
          name: cleanedName,
          email: user.email,
          role: user.role,
          stats: user.stats,
          preferences: user.preferences
        }
      });
    } else {
      res.json({
        message: 'No name fix needed',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          stats: user.stats,
          preferences: user.preferences
        }
      });
    }
  } catch (error) {
    console.error('Fix my name error:', error);
    res.status(500).json({
      error: 'Failed to fix name'
    });
  }
});

export default router;