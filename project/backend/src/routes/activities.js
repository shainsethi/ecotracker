import express from 'express';
import Activity from '../models/Activity.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/activities
// @desc    Get user activities or all activities (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      category,
      status,
      limit = 50,
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Base query - regular users see only their activities, admins see all
    let baseQuery = req.userRole === 'admin' ? {} : { user: req.userId };

    // Apply filters
    if (startDate || endDate) {
      baseQuery['disposal.date'] = {};
      if (startDate) baseQuery['disposal.date'].$gte = new Date(startDate);
      if (endDate) baseQuery['disposal.date'].$lte = new Date(endDate);
    }

    if (category) {
      baseQuery['item.category'] = category;
    }

    if (status) {
      baseQuery.status = status;
    }

    // Create query
    const query = Activity.find(baseQuery);

    // Populate related data
    query.populate('user', 'name email')
         .populate('recyclingCenter', 'name address.formatted contact.phone');

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    query.sort(sortOptions);

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query.limit(parseInt(limit)).skip(skip);

    const activities = await query.exec();

    // Get total count for pagination
    const totalCount = await Activity.countDocuments(baseQuery);

    res.json({
      activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + activities.length < totalCount,
        hasPreviousPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      error: 'Failed to fetch activities'
    });
  }
});

// @route   GET /api/activities/:id
// @desc    Get single activity
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Regular users can only see their own activities
    if (req.userRole !== 'admin') {
      query.user = req.userId;
    }

    const activity = await Activity.findOne(query)
      .populate('user', 'name email')
      .populate('recyclingCenter', 'name address.formatted contact.phone contact.email');

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({ activity });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      error: 'Failed to fetch activity'
    });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      item,
      recyclingCenter,
      disposal,
      location,
      photos,
      notes
    } = req.body;

    // Validation
    if (!item || !item.name || !item.category || !disposal || !disposal.date || !disposal.method) {
      return res.status(400).json({
        error: 'Please provide required fields: item (name, category), disposal (date, method)'
      });
    }

    // Validate disposal date
    const disposalDate = new Date(disposal.date);
    if (disposalDate > new Date()) {
      return res.status(400).json({
        error: 'Disposal date cannot be in the future'
      });
    }

    // Create new activity
    const activity = new Activity({
      user: req.userId,
      item,
      recyclingCenter: recyclingCenter || null,
      disposal,
      location,
      photos,
      notes
    });

    await activity.save();

    // Populate related data
    await activity.populate([
      { path: 'user', select: 'name email' },
      { path: 'recyclingCenter', select: 'name address.formatted contact.phone' }
    ]);

    res.status(201).json({
      message: 'Activity logged successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      error: 'Failed to create activity'
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Regular users can only update their own activities
    if (req.userRole !== 'admin') {
      query.user = req.userId;
    }

    const activity = await Activity.findOne(query);

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    const {
      item,
      recyclingCenter,
      disposal,
      location,
      photos,
      notes,
      status
    } = req.body;

    // Update fields if provided
    if (item) activity.item = { ...activity.item, ...item };
    if (recyclingCenter !== undefined) activity.recyclingCenter = recyclingCenter;
    if (disposal) activity.disposal = { ...activity.disposal, ...disposal };
    if (location) activity.location = location;
    if (photos) activity.photos = photos;
    if (notes !== undefined) activity.notes = notes;
    if (status && req.userRole === 'admin') activity.status = status;

    // Validate disposal date if being updated
    if (disposal && disposal.date) {
      const disposalDate = new Date(disposal.date);
      if (disposalDate > new Date()) {
        return res.status(400).json({
          error: 'Disposal date cannot be in the future'
        });
      }
    }

    await activity.save();

    // Populate related data
    await activity.populate([
      { path: 'user', select: 'name email' },
      { path: 'recyclingCenter', select: 'name address.formatted contact.phone' }
    ]);

    res.json({
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      error: 'Failed to update activity'
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    // Regular users can only delete their own activities
    if (req.userRole !== 'admin') {
      query.user = req.userId;
    }

    const activity = await Activity.findOne(query);

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      error: 'Failed to delete activity'
    });
  }
});

// @route   GET /api/activities/summary/stats
// @desc    Get user activity statistics
// @access  Private
router.get('/summary/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const userId = req.userRole === 'admin' && req.query.userId 
      ? req.query.userId 
      : req.userId;

    const summary = await Activity.getUserSummary(
      userId,
      startDate ? new Date(startDate) : null,
      endDate ? new Date(endDate) : null
    );

    if (!summary.length) {
      return res.json({
        categories: [],
        totalItems: 0,
        totalWeight: 0,
        totalCO2Saved: 0,
        totalEnergySaved: 0
      });
    }

    res.json(summary[0]);
  } catch (error) {
    console.error('Get activity stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch activity statistics'
    });
  }
});

// @route   POST /api/activities/:id/verify
// @desc    Verify an activity (admin only)
// @access  Private (Admin)
router.post('/:id/verify', auth, adminAuth, async (req, res) => {
  try {
    const { verificationNotes } = req.body;

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    activity.status = 'Verified';
    activity.disposal.verified = true;
    activity.verification = {
      verifiedBy: req.userId,
      verifiedAt: new Date(),
      verificationNotes
    };

    await activity.save();

    await activity.populate([
      { path: 'user', select: 'name email' },
      { path: 'recyclingCenter', select: 'name address.formatted' },
      { path: 'verification.verifiedBy', select: 'name email' }
    ]);

    res.json({
      message: 'Activity verified successfully',
      activity
    });
  } catch (error) {
    console.error('Verify activity error:', error);
    res.status(500).json({
      error: 'Failed to verify activity'
    });
  }
});

// @route   GET /api/activities/export/csv
// @desc    Export activities to CSV
// @access  Private
router.get('/export/csv', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let baseQuery = req.userRole === 'admin' ? {} : { user: req.userId };

    if (startDate || endDate) {
      baseQuery['disposal.date'] = {};
      if (startDate) baseQuery['disposal.date'].$gte = new Date(startDate);
      if (endDate) baseQuery['disposal.date'].$lte = new Date(endDate);
    }

    const activities = await Activity.find(baseQuery)
      .populate('user', 'name email')
      .populate('recyclingCenter', 'name address.formatted')
      .sort({ 'disposal.date': -1 });

    // Create CSV content
    const headers = [
      'Date', 'User', 'Item', 'Category', 'Quantity', 'Weight (kg)', 
      'CO2 Saved (kg)', 'Recycling Center', 'Status'
    ];

    const csvRows = [
      headers.join(','),
      ...activities.map(activity => [
        new Date(activity.disposal.date).toLocaleDateString(),
        activity.user.name,
        activity.item.name,
        activity.item.category,
        activity.item.quantity,
        activity.item.estimatedWeight,
        activity.environmental.co2Saved,
        activity.recyclingCenter?.name || 'N/A',
        activity.status
      ].join(','))
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=activities.csv');
    res.send(csvRows.join('\n'));
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      error: 'Failed to export activities'
    });
  }
});

export default router;