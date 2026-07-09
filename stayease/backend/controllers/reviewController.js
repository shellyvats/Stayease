const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Property = require("../models/Property");

const recalculateRatings = async (propertyId) => {
  const reviews = await Review.find({ property: propertyId });
  const numReviews = reviews.length;
  const averageRating = numReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews : 0;
  await Property.findByIdAndUpdate(propertyId, {
    averageRating: Math.round(averageRating * 10) / 10,
    numReviews,
  });
};

// @desc Create review
// @route POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { propertyId, rating, comment } = req.body;

  const existing = await Review.findOne({ student: req.user._id, property: propertyId });
  if (existing) {
    res.status(400);
    throw new Error("You already reviewed this property");
  }

  const review = await Review.create({
    student: req.user._id,
    property: propertyId,
    rating,
    comment,
  });

  await recalculateRatings(propertyId);
  res.status(201).json(review);
});

// @desc Get reviews for a property
// @route GET /api/reviews/property/:propertyId
const getPropertyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ property: req.params.propertyId })
    .populate("student", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc Owner replies to review
// @route PUT /api/reviews/:id/reply
const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate("property");
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  review.ownerReply = req.body.reply;
  await review.save();
  res.json(review);
});

// @desc Delete review
// @route DELETE /api/reviews/:id
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.student.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }
  const propertyId = review.property;
  await review.deleteOne();
  await recalculateRatings(propertyId);
  res.json({ message: "Review removed" });
});

module.exports = { createReview, getPropertyReviews, replyToReview, deleteReview };
