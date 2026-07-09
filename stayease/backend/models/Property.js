const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    images: [{ type: String }],
    rent: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    nearbyColleges: [{ type: String }],
    nearbyMetro: [{ type: String }],
    roomTypes: [
      {
        type: String,
        enum: ["Single", "Double", "Triple", "Dormitory"],
      },
    ],
    occupancy: { type: String, enum: ["Single", "Double", "Triple", "Dormitory"], default: "Single" },
    genderPreference: { type: String, enum: ["Male", "Female", "Unisex"], default: "Unisex" },
    amenities: {
      wifi: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      foodIncluded: { type: Boolean, default: false },
      powerBackup: { type: Boolean, default: false },
      cctv: { type: Boolean, default: false },
      housekeeping: { type: Boolean, default: false },
    },
    totalRooms: { type: Number, default: 1 },
    availableRooms: { type: Number, default: 1 },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isFake: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ "address.city": "text", name: "text", nearbyColleges: "text" });

module.exports = mongoose.model("Property", propertySchema);
