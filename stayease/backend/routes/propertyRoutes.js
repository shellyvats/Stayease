const express = require("express");
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getOwnerAnalytics,
} = require("../controllers/propertyController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.get("/owner/mine", protect, authorize("owner", "admin"), getMyProperties);
router.get("/owner/analytics", protect, authorize("owner", "admin"), getOwnerAnalytics);

router.route("/").get(getProperties).post(protect, authorize("owner", "admin"), createProperty);

router
  .route("/:id")
  .get(getPropertyById)
  .put(protect, authorize("owner", "admin"), updateProperty)
  .delete(protect, authorize("owner", "admin"), deleteProperty);

module.exports = router;
