/**
 * Seed script - populates the database with sample users and properties
 * Run with: npm run seed
 */
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Property = require("../models/Property");

const seedData = async () => {
  await connectDB();

  await User.deleteMany();
  await Property.deleteMany();

  const admin = await User.create({
    name: "Admin User",
    email: "admin@stayease.com",
    password: "admin123",
    role: "admin",
    isVerified: true,
  });

  const owner = await User.create({
    name: "Rakesh Sharma",
    email: "owner@stayease.com",
    password: "owner123",
    role: "owner",
    phone: "9876543210",
    isVerified: true,
  });

  const student = await User.create({
    name: "Priya Verma",
    email: "student@stayease.com",
    password: "student123",
    role: "student",
    phone: "9123456780",
    isVerified: true,
  });

  const properties = [
    {
      owner: owner._id,
      name: "Prime Boys PG",
      description: "A comfortable and secure PG for boys, close to major colleges and metro stations.",
      images: [],
      rent: 8000,
      securityDeposit: 8000,
      address: { line1: "12 MG Road", city: "Ludhiana", state: "Punjab", pincode: "141001" },
      location: { lat: 30.901, lng: 75.8573 },
      nearbyColleges: ["Punjab Agricultural University", "GNE College"],
      nearbyMetro: ["Ludhiana Junction"],
      roomTypes: ["Single", "Double"],
      occupancy: "Double",
      genderPreference: "Male",
      amenities: { wifi: true, ac: true, laundry: true, parking: true, foodIncluded: true, powerBackup: true, cctv: true },
      totalRooms: 20,
      availableRooms: 6,
      isApproved: true,
      isVerified: true,
    },
    {
      owner: owner._id,
      name: "Sunshine Girls Hostel",
      description: "Safe and homely hostel for working women and students, with home-cooked food.",
      images: [],
      rent: 7500,
      securityDeposit: 7500,
      address: { line1: "45 Model Town", city: "Ludhiana", state: "Punjab", pincode: "141002" },
      location: { lat: 30.912, lng: 75.85 },
      nearbyColleges: ["DAV College", "Punjab Agricultural University"],
      nearbyMetro: [],
      roomTypes: ["Single", "Triple"],
      occupancy: "Triple",
      genderPreference: "Female",
      amenities: { wifi: true, ac: false, laundry: true, parking: false, foodIncluded: true, housekeeping: true, cctv: true },
      totalRooms: 15,
      availableRooms: 3,
      isApproved: true,
      isVerified: true,
    },
    {
      owner: owner._id,
      name: "Urban Nest Co-living",
      description: "Modern co-living space for working professionals with premium amenities.",
      images: [],
      rent: 12000,
      securityDeposit: 15000,
      address: { line1: "8 Civil Lines", city: "Chandigarh", state: "Punjab", pincode: "160001" },
      location: { lat: 30.7333, lng: 76.7794 },
      nearbyColleges: ["Panjab University"],
      nearbyMetro: [],
      roomTypes: ["Single"],
      occupancy: "Single",
      genderPreference: "Unisex",
      amenities: { wifi: true, ac: true, laundry: true, parking: true, foodIncluded: false, powerBackup: true, cctv: true },
      totalRooms: 10,
      availableRooms: 4,
      isApproved: true,
      isVerified: true,
    },
  ];

  await Property.insertMany(properties);

  console.log("Seed data inserted successfully!");
  console.log("Login credentials:");
  console.log("  Admin:   admin@stayease.com / admin123");
  console.log("  Owner:   owner@stayease.com / owner123");
  console.log("  Student: student@stayease.com / student123");

  mongoose.connection.close();
};

seedData().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
