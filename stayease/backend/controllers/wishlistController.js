const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/Wishlist");

// @desc Get logged-in user's wishlist
// @route GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("properties");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, properties: [] });
  }
  res.json(wishlist);
});

// @desc Toggle property in wishlist
// @route POST /api/wishlist/:propertyId
const toggleWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, properties: [] });
  }

  const propertyId = req.params.propertyId;
  const exists = wishlist.properties.some((p) => p.toString() === propertyId);

  if (exists) {
    wishlist.properties = wishlist.properties.filter((p) => p.toString() !== propertyId);
  } else {
    wishlist.properties.push(propertyId);
  }

  await wishlist.save();
  res.json({ added: !exists, wishlist });
});

module.exports = { getWishlist, toggleWishlist };
