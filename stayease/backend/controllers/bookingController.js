const asyncHandler = require("express-async-handler");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Notification = require("../models/Notification");

// @desc Create booking request (student)
// @route POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, roomType, moveInDate, message } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const booking = await Booking.create({
    student: req.user._id,
    property: property._id,
    owner: property.owner,
    roomType,
    moveInDate,
    message,
  });

  await Notification.create({
    user: property.owner,
    type: "general",
    title: "New Booking Request",
    message: `You have a new booking request for ${property.name}`,
    link: `/owner/bookings`,
  });

  res.status(201).json(booking);
});

// @desc Get bookings for logged-in student
// @route GET /api/bookings/mine
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user._id })
    .populate("property", "name images address rent")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc Get bookings for owner's properties
// @route GET /api/bookings/owner
const getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ owner: req.user._id })
    .populate("property", "name images address rent")
    .populate("student", "name email phone")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc Update booking status (owner: accept/reject/schedule visit)
// @route PUT /api/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, visitDate, ownerResponse } = req.body;
  const booking = await Booking.findById(req.params.id).populate("property");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  booking.status = status || booking.status;
  if (visitDate) booking.visitDate = visitDate;
  if (ownerResponse) booking.ownerResponse = ownerResponse;
  await booking.save();

  if (status === "accepted" || status === "rejected") {
    await Notification.create({
      user: booking.student,
      type: status === "accepted" ? "booking_accepted" : "booking_rejected",
      title: `Booking ${status === "accepted" ? "Accepted" : "Rejected"}`,
      message: `Your booking request for ${booking.property.name} was ${status}.`,
      link: `/student/bookings`,
    });

    if (status === "accepted") {
      const property = await Property.findById(booking.property._id);
      if (property.availableRooms > 0) {
        property.availableRooms -= 1;
        await property.save();
      }
    }
  }

  res.json(booking);
});

// @desc Cancel booking (student)
// @route PUT /api/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  booking.status = "cancelled";
  await booking.save();
  res.json(booking);
});

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
};
