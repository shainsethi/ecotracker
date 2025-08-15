import express from 'express';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const {
      limit = 50,
      page = 1,
      search,
      role,
      isActive
    } = req.query;

    let query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalCount = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + users.length < totalCount,
        hasPreviousPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private (Admin or own profile)
router.get('/:id', auth, async (req, res) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.params.id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or own profile)
router.put('/:id', auth, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.params.id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const {
      name,
      email,
      role,
      isActive,
      preferences,
      location
    } = req.body;

    // Update fields if provided
    if (name) user.name = name.trim();
    
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.params.id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          error: 'Email is already taken'
        });
      }
      
      user.email = email.toLowerCase().trim();
    }

    // Only admins can change role and active status
    if (req.userRole === 'admin') {
      if (role !== undefined) user.role = role;
      if (isActive !== undefined) user.isActive = isActive;
    }

    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    if (location) user.location = location;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete/deactivate user
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Don't allow deletion of the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'Cannot delete the last admin user'
        });
      }
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    res.json({
      message: 'User deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user'
    });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user statistics
// @access  Private (Admin or own profile)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    // Users can only view their own stats unless they're admin
    if (req.params.id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    const user = await User.findById(req.params.id).select('stats');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Get additional stats from Activity model
    const Activity = (await import('../models/Activity.js')).default;
    
    const additionalStats = await Activity.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: '$item.quantity' },
          totalWeight: { $sum: { $multiply: ['$item.estimatedWeight', '$item.quantity'] } },
          totalCO2Saved: { $sum: '$environmental.co2Saved' },
          totalEnergySaved: { $sum: '$environmental.energySaved' },
          categoryBreakdown: {
            $push: {
              category: '$item.category',
              count: '$item.quantity',
              weight: { $multiply: ['$item.estimatedWeight', '$item.quantity'] },
              co2: '$environmental.co2Saved'
            }
          }
        }
      }
    ]);

    const stats = {
      ...user.stats.toObject(),
      ...(additionalStats[0] || {
        totalItems: 0,
        totalWeight: 0,
        totalCO2Saved: 0,
        totalEnergySaved: 0,
        categoryBreakdown: []
      })
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch user statistics'
    });
  }
});

// @route   POST /api/users/:id/promote
// @desc    Promote user to admin
// @access  Private (Admin only)
router.post('/:id/promote', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        error: 'User is already an admin'
      });
    }

    user.role = 'admin';
    await user.save();

    res.json({
      message: 'User promoted to admin successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({
      error: 'Failed to promote user'
    });
  }
});

// @route   POST /api/users/:id/demote
// @desc    Demote admin to regular user
// @access  Private (Admin only)
router.post('/:id/demote', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'User is not an admin'
      });
    }

    // Don't allow demotion of the last admin
    const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
    if (adminCount <= 1) {
      return res.status(400).json({
        error: 'Cannot demote the last admin user'
      });
    }

    user.role = 'user';
    await user.save();

    res.json({
      message: 'Admin demoted to user successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Demote user error:', error);
    res.status(500).json({
      error: 'Failed to demote user'
    });
  }
});

export default router;