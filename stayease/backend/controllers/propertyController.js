const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");

// ==========================
// Create Property
// ==========================
const createProperty = asyncHandler(async (req, res) => {
  const property = new Property({
    ...req.body,
    owner: req.user._id,
  });

  const created = await property.save();
  res.status(201).json(created);
});

// ==========================
// Get All Properties
// ==========================
const getProperties = asyncHandler(async (req, res) => {
  const {
    city,
    college,
    budgetMin,
    budgetMax,
    roomType,
    gender,
    ac,
    food,
    parking,
    wifi,
    laundry,
    keyword,
    page = 1,
    limit = 12,
    sort,
  } = req.query;

  const query = {};

  // Only active properties (or documents without status field)
  query.$or = [
    { status: "active" },
    { status: { $exists: false } },
  ];

  if (city) {
    query["address.city"] = new RegExp(city, "i");
  }

  if (college) {
    query.nearbyColleges = {
      $elemMatch: {
        $regex: college,
        $options: "i",
      },
    };
  }

  if (roomType) query.roomTypes = roomType;
  if (gender) query.genderPreference = gender;

  if (ac === "true") query["amenities.ac"] = true;
  if (food === "true") query["amenities.foodIncluded"] = true;
  if (parking === "true") query["amenities.parking"] = true;
  if (wifi === "true") query["amenities.wifi"] = true;
  if (laundry === "true") query["amenities.laundry"] = true;

  if (budgetMin || budgetMax) {
    query.rent = {};

    if (budgetMin) query.rent.$gte = Number(budgetMin);
    if (budgetMax) query.rent.$lte = Number(budgetMax);
  }

  if (keyword) {
    query.$or = [
      { name: new RegExp(keyword, "i") },
      { "address.city": new RegExp(keyword, "i") },
      {
        nearbyColleges: {
          $elemMatch: {
            $regex: keyword,
            $options: "i",
          },
        },
      },
    ];
  }

  let sortOption = { createdAt: -1 };

  if (sort === "rent_asc") sortOption = { rent: 1 };
  if (sort === "rent_desc") sortOption = { rent: -1 };
  if (sort === "rating") sortOption = { averageRating: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const total = await Property.countDocuments(query);

  const properties = await Property.find(query)
    .populate("owner", "name email phone avatar")
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  console.log("Properties Found:", properties.length);

  res.json({
    properties,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

// ==========================
// Get Property By ID
// ==========================
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "owner",
    "name email phone avatar"
  );

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  property.views += 1;
  await property.save();

  res.json(property);
});

// ==========================
// Update Property
// ==========================
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  Object.assign(property, req.body);

  const updated = await property.save();

  res.json(updated);
});

// ==========================
// Delete Property
// ==========================
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (
    property.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await property.deleteOne();

  res.json({
    message: "Property removed",
  });
});

// ==========================
// My Properties
// ==========================
const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({
    owner: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.json(properties);
});

// ==========================
// Owner Analytics
// ==========================
const getOwnerAnalytics = asyncHandler(async (req, res) => {
  const properties = await Property.find({
    owner: req.user._id,
  });

  const totalProperties = properties.length;

  const totalRooms = properties.reduce(
    (sum, p) => sum + (p.totalRooms || 0),
    0
  );

  const availableRooms = properties.reduce(
    (sum, p) => sum + (p.availableRooms || 0),
    0
  );

  const occupiedRooms = totalRooms - availableRooms;

  const occupancyRate =
    totalRooms > 0
      ? Math.round((occupiedRooms / totalRooms) * 100)
      : 0;

  const monthlyEarnings = properties.reduce(
    (sum, p) =>
      sum + (p.rent * ((p.totalRooms || 0) - (p.availableRooms || 0))),
    0
  );

  res.json({
    totalProperties,
    totalRooms,
    availableRooms,
    occupiedRooms,
    occupancyRate,
    monthlyEarnings,
  });
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getOwnerAnalytics,
};