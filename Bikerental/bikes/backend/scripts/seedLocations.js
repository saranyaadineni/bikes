import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Location from '../models/Location.js';
import connectDB from '../config/database.js';

dotenv.config();

const defaultLocations = [
  {
    name: 'Hitech City',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    isActive: true,
  },
  {
    name: 'Ameerpet',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    isActive: true,
  },
  {
    name: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    isActive: true,
  },
  {
    name: 'Kukatpally',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    isActive: true,
  },
  {
    name: 'LB Nagar',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    isActive: true,
  },
];

async function seedLocations() {
  try {
    await connectDB();
    
    // Clear existing locations (optional)
    // await Location.deleteMany({});
    // console.log('Cleared existing locations');

    let seededCount = 0;
    for (const loc of defaultLocations) {
      const existing = await Location.findOne({ name: loc.name });
      if (!existing) {
        await Location.create(loc);
        console.log(`✅ Seeded location: ${loc.name}`);
        seededCount++;
      } else {
        console.log(`ℹ️  Location already exists: ${loc.name}`);
      }
    }

    console.log(`\n✅ Finished seeding locations. Total new: ${seededCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding locations:', error);
    process.exit(1);
  }
}

seedLocations();





