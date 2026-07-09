import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import {
  MapPin, Star, Wifi, Utensils, Car, Wind, WashingMachine,
  ShieldCheck, Heart, Loader2, Send, Zap, Camera, ImageOff, MessageSquare,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70";

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ roomType: "", moveInDate: "", message: "" });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [statusMsg, setStatusMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: prop }, { data: revs }] = await Promise.all([
        api.get(`/properties/${id}`),
        api.get(`/reviews/property/${id}`),
      ]);
      setProperty(prop);
      setReviews(revs);

      if (user) {
        const { data: wishlist } = await api.get("/wishlist");
        setWishlisted(wishlist.properties.some((p) => p._id === id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleWishlist = async () => {
    if (!user) return navigate("/login");
    const { data } = await api.post(`/wishlist/${id}`);
    setWishlisted(data.added);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await api.post("/bookings", { propertyId: id, ...bookingForm });
      setStatusMsg("Booking request sent! Track it from your dashboard.");
      setBookingOpen(false);
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Could not send booking request.");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await api.post("/reviews", { propertyId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: "" });
      loadData();
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Could not submit review.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-primary-600">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!property) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center">Property not found.</div>;
  }

  const amenityIcons = [
    { key: "wifi", label: "WiFi", icon: Wifi },
    { key: "ac", label: "AC", icon: Wind },
    { key: "foodIncluded", label: "Food Included", icon: Utensils },
    { key: "parking", label: "Parking", icon: Car },
    { key: "laundry", label: "Laundry", icon: WashingMachine },
    { key: "powerBackup", label: "Power Backup", icon: Zap },
    { key: "cctv", label: "CCTV", icon: Camera },
  ];

  const gallery = property.images?.length > 0 ? property.images : [FALLBACK_IMAGE];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {statusMsg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700"
        >
          {statusMsg}
        </motion.div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {/* Image gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl bg-primary-100 sm:h-96">
            <div className="relative col-span-4 row-span-2 h-64 overflow-hidden sm:col-span-3 sm:h-auto">
              <img src={gallery[0]} alt={property.name} className="h-full w-full object-cover" />
              {property.images?.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-secondary-900/40 text-white">
                  <ImageOff size={18} /> No image available
                </div>
              )}
            </div>
            <div className="col-span-4 hidden gap-2 sm:col-span-1 sm:grid sm:grid-rows-2">
              {[gallery[1] || gallery[0], gallery[2] || gallery[0]].map((img, i) => (
                <div key={i} className="h-full w-full overflow-hidden">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-secondary-900">{property.name}</h1>
                {property.isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                    <ShieldCheck size={12} /> Verified
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-secondary-500">
                <MapPin size={16} />
                {property.address?.line1}, {property.address?.city}, {property.address?.state}
              </p>
              <div className="mt-2 flex items-center gap-1 text-accent-600">
                <Star size={16} className="fill-accent-500 text-accent-500" />
                {property.averageRating > 0 ? property.averageRating.toFixed(1) : "New"}
                <span className="text-secondary-400">({property.numReviews} reviews)</span>
              </div>
            </div>
            <button
              onClick={handleWishlist}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                wishlisted ? "border-red-200 bg-red-50 text-red-500" : "border-secondary-200 text-secondary-400 hover:text-red-400"
              }`}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="mt-4 leading-relaxed text-secondary-600">{property.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {amenityIcons
              .filter((a) => property.amenities?.[a.key])
              .map(({ key, label, icon: Icon }) => (
                <div key={key} className="card flex items-center gap-2 p-3 text-sm text-secondary-700">
                  <Icon size={16} className="text-primary-600" /> {label}
                </div>
              ))}
          </div>

          {(property.nearbyColleges?.length > 0 || property.nearbyMetro?.length > 0) && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {property.nearbyColleges?.length > 0 && (
                <div className="card p-4">
                  <h4 className="mb-2 text-sm font-semibold text-secondary-900">Nearby Colleges</h4>
                  <ul className="list-disc pl-4 text-sm text-secondary-600">
                    {property.nearbyColleges.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {property.nearbyMetro?.length > 0 && (
                <div className="card p-4">
                  <h4 className="mb-2 text-sm font-semibold text-secondary-900">Nearby Metro / Transit</h4>
                  <ul className="list-disc pl-4 text-sm text-secondary-600">
                    {property.nearbyMetro.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="mb-4 font-display text-xl font-bold text-secondary-900">Reviews &amp; Ratings</h2>

            {user?.role === "student" && (
              <form onSubmit={handleReview} className="card mb-6 p-4">
                <div className="mb-3 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                      <Star
                        size={20}
                        className={n <= reviewForm.rating ? "fill-accent-500 text-accent-500" : "text-secondary-200"}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  className="input-field mb-3"
                  rows={3}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
                <button className="btn-primary" type="submit">
                  Submit Review
                </button>
              </form>
            )}

            <div className="flex flex-col gap-4">
              {reviews.length === 0 && (
                <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to share your experience with this property." />
              )}
              {reviews.map((r) => (
                <div key={r._id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-secondary-900">{r.student?.name}</span>
                    <div className="flex items-center gap-1 text-accent-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-accent-500 text-accent-500" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-secondary-600">{r.comment}</p>
                  {r.ownerReply && (
                    <div className="mt-3 rounded-lg bg-primary-50 p-3 text-sm text-primary-700">
                      <span className="font-semibold">Owner reply: </span>
                      {r.ownerReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="h-fit lg:sticky lg:top-24">
          <div className="card p-6">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-secondary-900">₹{property.rent?.toLocaleString("en-IN")}</span>
                <span className="text-secondary-400">/month</span>
              </div>
              <span className="text-sm text-secondary-500">{property.availableRooms} rooms available</span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-sm text-secondary-600">
              <span>Occupancy: {property.occupancy}</span>
              <span>·</span>
              <span>Deposit: ₹{property.securityDeposit?.toLocaleString("en-IN")}</span>
            </div>

            {!bookingOpen ? (
              <button onClick={() => setBookingOpen(true)} className="btn-primary w-full">
                <Send size={16} /> Request Booking
              </button>
            ) : (
              <form onSubmit={handleBooking} className="flex flex-col gap-3">
                <div>
                  <label className="label">Room Type</label>
                  <select
                    className="input-field"
                    value={bookingForm.roomType}
                    onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}
                    required
                  >
                    <option value="">Select room type</option>
                    {property.roomTypes?.map((rt) => (
                      <option key={rt} value={rt}>
                        {rt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Preferred Move-in Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={bookingForm.moveInDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, moveInDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Message to Owner</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                    placeholder="Any specific requirements..."
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Booking Request
                </button>
              </form>
            )}

            <div className="mt-4 border-t border-secondary-200 pt-4 text-sm text-secondary-600">
              <p className="font-medium text-secondary-900">{property.owner?.name}</p>
              <p>{property.owner?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
