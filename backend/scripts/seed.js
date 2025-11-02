import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Application from '../models/Application.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobtrackr');
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Application.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create a test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('👤 Created test user:', testUser.email);

    // Generate sample applications
    const companies = [
      'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix',
      'Tesla', 'Airbnb', 'Uber', 'Salesforce', 'Oracle', 'IBM'
    ];
    
    const roles = [
      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'SDE Intern', 'Software Engineer', 'DevOps Engineer',
      'Data Scientist', 'Product Manager', 'UX Designer'
    ];
    
    const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
    const locations = ['San Francisco, CA', 'Seattle, WA', 'New York, NY', 'Austin, TX'];

    const applications = [];
    
    for (let i = 0; i < 12; i++) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60));
      
      applications.push({
        company: companies[Math.floor(Math.random() * companies.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        appliedDate: randomDate,
        location: locations[Math.floor(Math.random() * locations.length)],
        salary: Math.floor(Math.random() * 100000) + 80000,
        notes: Math.random() > 0.5 ? 'Interview scheduled for next week' : '',
        tags: ['Remote', 'On-site', 'Hybrid'][Math.floor(Math.random() * 3)],
        userId: testUser._id
      });
    }

    await Application.insertMany(applications);
    console.log(`✅ Created ${applications.length} sample applications`);

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();

