const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleBlockUser,
  getAllPropertiesAdmin,
  approveProperty,
  flagProperty,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);
router.get("/properties", getAllPropertiesAdmin);
router.put("/properties/:id/approve", approveProperty);
router.put("/properties/:id/flag", flagProperty);

module.exports = router;
