const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.post("/", protect, authorize("student"), createBooking);
router.get("/mine", protect, authorize("student"), getMyBookings);
router.get("/owner", protect, authorize("owner", "admin"), getOwnerBookings);
router.put("/:id/status", protect, authorize("owner", "admin"), updateBookingStatus);
router.put("/:id/cancel", protect, authorize("student"), cancelBooking);

module.exports = router;
