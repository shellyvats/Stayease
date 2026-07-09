const express = require("express");
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
  replyToReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.post("/", protect, authorize("student"), createReview);
router.get("/property/:propertyId", getPropertyReviews);
router.put("/:id/reply", protect, authorize("owner"), replyToReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
