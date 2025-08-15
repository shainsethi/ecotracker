import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recyclingCenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecyclingCenter',
    default: null
  },
  item: {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Smartphones', 'Laptops', 'Tablets', 'Batteries', 'Cables',
        'Printers', 'Monitors', 'TVs', 'Others'
      ],
      required: true
    },
    brand: String,
    condition: { type: String, enum: ['Working', 'Partially Working', 'Not Working'] },
    estimatedWeight: { type: Number, default: 0 }, // in kg
    quantity: { type: Number, default: 1, min: 1 }
  },
  disposal: {
    method: { type: String, required: true },
    date: { type: Date, required: true },
    verified: { type: Boolean, default: false }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    address: String
  },
  photos: [String],
  notes: String,
  environmental: {
    co2Saved: { type: Number, default: 0 }, // kg
    energySaved: { type: Number, default: 0 } // kWh
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Verified'],
    default: 'Completed'
  },
  verification: {
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    verificationNotes: { type: String }
  }
}, {
  timestamps: true
});

activitySchema.index({ user: 1, 'disposal.date': -1 });
activitySchema.index({ 'item.category': 1 });

// Static: summary aggregation
activitySchema.statics.getUserSummary = function(userId, startDate, endDate) {
  const match = { user: new mongoose.Types.ObjectId(userId) };
  if (startDate || endDate) {
    match['disposal.date'] = {};
    if (startDate) match['disposal.date'].$gte = startDate;
    if (endDate) match['disposal.date'].$lte = endDate;
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$item.category',
        totalItems: { $sum: '$item.quantity' },
        totalWeight: { $sum: '$item.estimatedWeight' },
        totalCO2Saved: { $sum: '$environmental.co2Saved' }
      }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: '$totalItems',
        weight: '$totalWeight',
        co2: '$totalCO2Saved'
      }
    },
    {
      $group: {
        _id: null,
        categories: { $push: '$$ROOT' },
        totalItems: { $sum: '$count' },
        totalWeight: { $sum: '$weight' },
        totalCO2Saved: { $sum: '$co2' }
      }
    },
    { $project: { _id: 0 } }
  ]);
};

export default mongoose.model('Activity', activitySchema);