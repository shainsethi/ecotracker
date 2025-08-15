import express from 'express';
import RecyclingCenter from '../models/RecyclingCenter.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/centers
// @desc    Get all recycling centers with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 10000, // Default 10km radius
      acceptedType,
      isActive = true,
      limit = 50,
      page = 1
    } = req.query;

    let query = RecyclingCenter.find({ isActive });

    // Location-based search
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const maxDistance = parseInt(radius);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          error: 'Invalid latitude or longitude'
        });
      }

      query = RecyclingCenter.findNearby(longitude, latitude, maxDistance);
    }

    // Filter by accepted type
    if (acceptedType) {
      query = query.find({
        $or: [
          { acceptedTypes: acceptedType },
          { acceptedTypes: 'All Types' }
        ]
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).skip(skip);

    // Populate added by user
    query = query.populate('addedBy', 'name email');

    const centers = await query.exec();

    // Get total count for pagination
    const totalCount = await RecyclingCenter.countDocuments(
      lat && lng ? { isActive } : { isActive }
    );

    res.json({
      centers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + centers.length < totalCount,
        hasPreviousPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get centers error:', error);
    res.status(500).json({
      error: 'Failed to fetch recycling centers'
    });
  }
});

// @route   GET /api/centers/:id
// @desc    Get single recycling center
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!center) {
      return res.status(404).json({
        error: 'Recycling center not found'
      });
    }

    res.json({ center });
  } catch (error) {
    console.error('Get center error:', error);
    res.status(500).json({
      error: 'Failed to fetch recycling center'
    });
  }
});

// @route   POST /api/centers
// @desc    Create a new recycling center
// @access  Private (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      location,
      contact,
      acceptedTypes,
      operatingHours,
      services,
      certifications,
      capacity,
      pricing
    } = req.body;

    // Validation
    if (!name || !address || !location || !acceptedTypes || acceptedTypes.length === 0) {
      return res.status(400).json({
        error: 'Please provide required fields: name, address, location, and accepted types'
      });
    }

    // Validate coordinates
    if (!location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        error: 'Please provide valid coordinates [longitude, latitude]'
      });
    }

    const [lng, lat] = location.coordinates;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({
        error: 'Invalid coordinates range'
      });
    }

    // Create new center
    const center = new RecyclingCenter({
      name: name.trim(),
      description: description?.trim(),
      address: typeof address === 'string' ? { formatted: address.trim() } : address,
      location,
      contact,
      acceptedTypes,
      operatingHours,
      services,
      certifications,
      capacity,
      pricing,
      addedBy: req.userId
    });

    await center.save();

    // Populate the addedBy field
    await center.populate('addedBy', 'name email');

    res.status(201).json({
      message: 'Recycling center created successfully',
      center
    });
  } catch (error) {
    console.error('Create center error:', error);
    res.status(500).json({
      error: 'Failed to create recycling center'
    });
  }
});

// @route   PUT /api/centers/:id
// @desc    Update recycling center
// @access  Private (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        error: 'Recycling center not found'
      });
    }

    const {
      name,
      description,
      address,
      location,
      contact,
      acceptedTypes,
      operatingHours,
      services,
      certifications,
      capacity,
      pricing,
      isActive,
      isVerified
    } = req.body;

    // Validate coordinates if location is being updated
    if (location && location.coordinates) {
      if (location.coordinates.length !== 2) {
        return res.status(400).json({
          error: 'Please provide valid coordinates [longitude, latitude]'
        });
      }

      const [lng, lat] = location.coordinates;
      if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        return res.status(400).json({
          error: 'Invalid coordinates range'
        });
      }
    }

    // Update fields if provided
    if (name) center.name = name.trim();
    if (description !== undefined) center.description = description?.trim();
    if (address) center.address = typeof address === 'string' ? { formatted: address.trim() } : address;
    if (location) center.location = location;
    if (contact) center.contact = { ...center.contact, ...contact };
    if (acceptedTypes) center.acceptedTypes = acceptedTypes;
    if (operatingHours) center.operatingHours = { ...center.operatingHours, ...operatingHours };
    if (services) center.services = services;
    if (certifications) center.certifications = certifications;
    if (capacity) center.capacity = { ...center.capacity, ...capacity };
    if (pricing) center.pricing = { ...center.pricing, ...pricing };
    if (isActive !== undefined) center.isActive = isActive;
    if (isVerified !== undefined) center.isVerified = isVerified;

    await center.save();

    // Populate the addedBy field
    await center.populate('addedBy', 'name email');

    res.json({
      message: 'Recycling center updated successfully',
      center
    });
  } catch (error) {
    console.error('Update center error:', error);
    res.status(500).json({
      error: 'Failed to update recycling center'
    });
  }
});

// @route   DELETE /api/centers/:id
// @desc    Delete recycling center
// @access  Private (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        error: 'Recycling center not found'
      });
    }

    await RecyclingCenter.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Recycling center deleted successfully'
    });
  } catch (error) {
    console.error('Delete center error:', error);
    res.status(500).json({
      error: 'Failed to delete recycling center'
    });
  }
});

// @route   GET /api/centers/search/nearby
// @desc    Search for nearby recycling centers
// @access  Public
router.get('/search/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDistance = parseInt(radius);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude'
      });
    }

    const centers = await RecyclingCenter.findNearby(longitude, latitude, maxDistance, {
      isActive: true
    });

    res.json({
      centers,
      searchParams: {
        latitude,
        longitude,
        radius: maxDistance
      }
    });
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({
      error: 'Failed to search nearby centers'
    });
  }
});

export default router;