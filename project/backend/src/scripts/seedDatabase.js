import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import RecyclingCenter from '../models/RecyclingCenter.js';
import Activity from '../models/Activity.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ewaste-tracker');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await RecyclingCenter.deleteMany({});
    await Activity.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create demo user (for frontend demo login)
    console.log('Creating demo user...');
    const demoUser = new User({
      name: 'Demo User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await demoUser.save();

    // Create regular users
    console.log('Creating regular users...');
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = new User({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password: 'user123',
        role: 'user'
      });
      await user.save();
      users.push(user);
    }

    // Create recycling centers
    console.log('Creating recycling centers...');
    const centerData = [
      {
        name: 'Green Tech Recycling',
        description: 'Certified e-waste recycling facility specializing in consumer electronics.',
        address: { formatted: '123 Eco Street, San Francisco, CA 94102' },
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749]
        },
        contact: {
          phone: '(555) 123-4567',
          email: 'info@greentechrecycling.com',
          website: 'https://greentechrecycling.com'
        },
        acceptedTypes: ['Smartphones', 'Laptops', 'Tablets', 'Batteries', 'Cables'],
        operatingHours: {
          monday: { open: '09:00', close: '18:00', closed: false },
          tuesday: { open: '09:00', close: '18:00', closed: false },
          wednesday: { open: '09:00', close: '18:00', closed: false },
          thursday: { open: '09:00', close: '18:00', closed: false },
          friday: { open: '09:00', close: '18:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { closed: true }
        },
        services: ['Data Destruction', 'Certificate of Destruction'],
        rating: { average: 4.8, count: 124 },
        isActive: true,
        isVerified: true,
        addedBy: adminUser._id
      },
      {
        name: 'EcoTech Solutions',
        description: 'Full-service electronics recycling with data destruction services.',
        address: { formatted: '456 Green Avenue, San Francisco, CA 94103' },
        location: {
          type: 'Point',
          coordinates: [-122.4094, 37.7849]
        },
        contact: {
          phone: '(555) 234-5678',
          email: 'contact@ecotechsolutions.com',
          website: 'https://ecotechsolutions.com'
        },
        acceptedTypes: ['Laptops', 'Monitors', 'Printers', 'TVs', 'Others'],
        operatingHours: {
          monday: { open: '08:00', close: '19:00', closed: false },
          tuesday: { open: '08:00', close: '19:00', closed: false },
          wednesday: { open: '08:00', close: '19:00', closed: false },
          thursday: { open: '08:00', close: '19:00', closed: false },
          friday: { open: '08:00', close: '19:00', closed: false },
          saturday: { open: '08:00', close: '19:00', closed: false },
          sunday: { closed: true }
        },
        services: ['Data Destruction', 'Pickup Service', 'Bulk Processing'],
        rating: { average: 4.6, count: 89 },
        isActive: true,
        isVerified: true,
        addedBy: adminUser._id
      },
      {
        name: 'Sustainable Electronics',
        description: 'Eco-friendly electronics recycling with pickup services available.',
        address: { formatted: '789 Clean Way, San Francisco, CA 94104' },
        location: {
          type: 'Point',
          coordinates: [-122.4294, 37.7649]
        },
        contact: {
          phone: '(555) 345-6789',
          email: 'hello@sustainableelectronics.com'
        },
        acceptedTypes: ['Smartphones', 'Tablets', 'Batteries', 'Monitors', 'Printers'],
        operatingHours: {
          monday: { open: '10:00', close: '17:00', closed: false },
          tuesday: { open: '10:00', close: '17:00', closed: false },
          wednesday: { open: '10:00', close: '17:00', closed: false },
          thursday: { open: '10:00', close: '17:00', closed: false },
          friday: { open: '10:00', close: '17:00', closed: false },
          saturday: { closed: true },
          sunday: { closed: true }
        },
        services: ['Pickup Service', 'Certificate of Destruction'],
        rating: { average: 4.7, count: 156 },
        isActive: true,
        isVerified: true,
        addedBy: adminUser._id
      },
      {
        name: 'Digital Disposal Hub',
        description: 'Large-scale e-waste processing facility accepting all electronic devices.',
        address: { formatted: '321 Tech Drive, San Francisco, CA 94105' },
        location: {
          type: 'Point',
          coordinates: [-122.3994, 37.7549]
        },
        contact: {
          phone: '(555) 456-7890',
          email: 'info@digitaldisposal.com',
          website: 'https://digitaldisposal.com'
        },
        acceptedTypes: ['All Types'],
        operatingHours: {
          monday: { open: '00:00', close: '23:59', closed: false },
          tuesday: { open: '00:00', close: '23:59', closed: false },
          wednesday: { open: '00:00', close: '23:59', closed: false },
          thursday: { open: '00:00', close: '23:59', closed: false },
          friday: { open: '00:00', close: '23:59', closed: false },
          saturday: { open: '00:00', close: '23:59', closed: false },
          sunday: { open: '00:00', close: '23:59', closed: false }
        },
        services: ['Data Destruction', 'Pickup Service', 'Bulk Processing', 'Certificate of Destruction'],
        rating: { average: 4.5, count: 203 },
        capacity: { maxDaily: 1000, current: 450 },
        pricing: { pricePerKg: 2.50, minimumCharge: 25.00, currency: 'USD' },
        isActive: true,
        isVerified: true,
        addedBy: adminUser._id
      },
      {
        name: 'Circuit Cycle Center',
        description: 'Specialized in small electronics and component recycling.',
        address: { formatted: '654 Recycle Road, San Francisco, CA 94106' },
        location: {
          type: 'Point',
          coordinates: [-122.4394, 37.7449]
        },
        contact: {
          phone: '(555) 567-8901',
          email: 'info@circuitcycle.com'
        },
        acceptedTypes: ['Cables', 'Batteries', 'Others'],
        operatingHours: {
          monday: { closed: true },
          tuesday: { open: '09:00', close: '18:00', closed: false },
          wednesday: { open: '09:00', close: '18:00', closed: false },
          thursday: { open: '09:00', close: '18:00', closed: false },
          friday: { open: '09:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '18:00', closed: false },
          sunday: { open: '09:00', close: '18:00', closed: false }
        },
        services: ['Refurbishment', 'Repair Service'],
        rating: { average: 4.3, count: 67 },
        isActive: true,
        isVerified: false,
        addedBy: adminUser._id
      }
    ];

    const centers = [];
    for (const centerInfo of centerData) {
      const center = new RecyclingCenter(centerInfo);
      await center.save();
      centers.push(center);
    }

    // Create sample activities
    console.log('Creating sample activities...');
    const activities = [
      {
        user: users[0]._id,
        recyclingCenter: centers[0]._id,
        item: {
          name: 'iPhone 12',
          category: 'Smartphones',
          brand: 'Apple',
          condition: 'Not Working',
          estimatedWeight: 0.2,
          quantity: 1
        },
        disposal: {
          method: 'Recycling Center',
          date: new Date('2024-01-15'),
          verified: true
        },
        location: {
          type: 'Point',
          coordinates: [-122.4194, 37.7749],
          address: '123 Eco Street, San Francisco, CA'
        },
        notes: 'Screen was cracked, battery not holding charge',
        status: 'Verified'
      },
      {
        user: users[0]._id,
        recyclingCenter: centers[1]._id,
        item: {
          name: 'MacBook Pro 2018',
          category: 'Laptops',
          brand: 'Apple',
          condition: 'Partially Working',
          estimatedWeight: 2.5,
          quantity: 1
        },
        disposal: {
          method: 'Recycling Center',
          date: new Date('2024-01-10'),
          verified: true
        },
        notes: 'Keyboard issues, but screen and battery working fine',
        status: 'Verified'
      },
      {
        user: users[1]._id,
        recyclingCenter: centers[2]._id,
        item: {
          name: 'Samsung Galaxy Tab',
          category: 'Tablets',
          brand: 'Samsung',
          condition: 'Not Working',
          estimatedWeight: 0.7,
          quantity: 1
        },
        disposal: {
          method: 'Recycling Center',
          date: new Date('2024-01-08'),
          verified: false
        },
        status: 'Completed'
      },
      {
        user: users[2]._id,
        recyclingCenter: centers[0]._id,
        item: {
          name: 'Old CRT Monitor',
          category: 'Monitors',
          condition: 'Not Working',
          estimatedWeight: 18.0,
          quantity: 1
        },
        disposal: {
          method: 'Pickup Service',
          date: new Date('2024-01-12'),
          verified: true
        },
        notes: 'Very heavy, needed pickup service',
        status: 'Verified'
      },
      {
        user: users[3]._id,
        item: {
          name: 'Various USB Cables',
          category: 'Cables',
          condition: 'Working',
          estimatedWeight: 0.5,
          quantity: 10
        },
        disposal: {
          method: 'Drop-off Event',
          date: new Date('2024-01-14'),
          verified: false
        },
        notes: 'Donated working cables, recycled broken ones',
        status: 'Completed'
      }
    ];

    for (const activityData of activities) {
      const activity = new Activity(activityData);
      await activity.save();
    }

    console.log('✅ Database seeded successfully!');
    console.log(`Created:`);
    console.log(`- 1 admin user (admin@example.com / admin123)`);
    console.log(`- 1 demo user (user@example.com / user123)`);
    console.log(`- 5 regular users (user1@example.com / user123, etc.)`);
    console.log(`- ${centers.length} recycling centers`);
    console.log(`- ${activities.length} sample activities`);
    console.log('');
    console.log('You can now start the server and test the application!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();