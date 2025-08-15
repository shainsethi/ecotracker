import mongoose from 'mongoose';

const recyclingCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Center name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    },
    formatted: {
      type: String,
      required: [true, 'Address is required']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;    // latitude
        },
        message: 'Invalid coordinates'
      }
    }
  },
  contact: {
    phone: {
      type: String,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please provide a valid website URL']
    }
  },
  acceptedTypes: [{
    type: String,
    enum: [
      'Smartphones', 'Laptops', 'Tablets', 'Batteries', 
      'Cables', 'Printers', 'Monitors', 'TVs', 
      'Gaming Consoles', 'Audio Equipment', 'Others', 'All Types'
    ],
    required: true
  }],
  operatingHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  services: [{
    type: String,
    enum: [
      'Data Destruction', 'Pickup Service', 'Bulk Processing',
      'Certificate of Destruction', 'Refurbishment', 'Repair Service'
    ]
  }],
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date,
    certificateUrl: String
  }],
  rating: {
    average: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [String],
  capacity: {
    maxDaily: Number, // kg per day
    current: {
      type: Number,
      default: 0
    }
  },
  pricing: {
    pricePerKg: Number,
    minimumCharge: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  stats: {
    totalProcessed: {
      type: Number,
      default: 0
    },
    co2Saved: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
recyclingCenterSchema.index({ location: '2dsphere' });
recyclingCenterSchema.index({ acceptedTypes: 1 });
recyclingCenterSchema.index({ isActive: 1 });
recyclingCenterSchema.index({ 'rating.average': -1 });

// Virtual for checking if center is currently open
recyclingCenterSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const todayHours = this.operatingHours?.[day];
  if (!todayHours || todayHours.closed) {
    return false;
  }
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
});

// Static method to find centers by location and filters
recyclingCenterSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000, filters = {}) {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true,
    ...filters
  };
  
  return this.find(query).populate('addedBy', 'name email');
};

// Method to update stats
recyclingCenterSchema.methods.updateStats = function(weightProcessed, co2Saved) {
  this.stats.totalProcessed += weightProcessed;
  this.stats.co2Saved += co2Saved;
  this.stats.lastUpdated = new Date();
  
  // Update current capacity
  if (this.capacity.current + weightProcessed <= this.capacity.maxDaily) {
    this.capacity.current += weightProcessed;
  }
  
  return this.save();
};

// Reset daily capacity (should be called daily via cron job)
recyclingCenterSchema.methods.resetDailyCapacity = function() {
  this.capacity.current = 0;
  return this.save();
};

export default mongoose.model('RecyclingCenter', recyclingCenterSchema);