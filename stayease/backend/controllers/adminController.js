const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

// @desc Admin dashboard stats
// @route GET /api/admin/stats
const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const pendingApprovals = await Property.countDocuments({ isApproved: false });
  const fakeListings = await Property.countDocuments({ isFake: true });
  const totalBookings = await Booking.countDocuments();
  const totalReviews = await Review.countDocuments();

  res.json({
    totalUsers,
    totalProperties,
    pendingApprovals,
    fakeListings,
    totalBookings,
    totalReviews,
  });
});

// @desc Get all users
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// @desc Block / unblock a user
// @route PUT /api/admin/users/:id/block
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, isBlocked: user.isBlocked });
});

// @desc Get all properties (including unapproved) for admin review
// @route GET /api/admin/properties
const getAllPropertiesAdmin = asyncHandler(async (req, res) => {
  const properties = await Property.find().populate("owner", "name email").sort({ createdAt: -1 });
  res.json(properties);
});

// @desc Approve / verify a property
// @route PUT /api/admin/properties/:id/approve
const approveProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  property.isApproved = true;
  property.isVerified = true;
  await property.save();
  res.json({ message: "Property approved and verified", property });
});

// @desc Mark property as fake / remove listing
// @route PUT /api/admin/properties/:id/flag
const flagProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  property.isFake = true;
  property.status = "inactive";
  await property.save();
  res.json({ message: "Property flagged as fake and deactivated", property });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleBlockUser,
  getAllPropertiesAdmin,
  approveProperty,
  flagProperty,
};
