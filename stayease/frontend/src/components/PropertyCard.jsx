import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Wifi, Utensils, Car, Wind, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60";

const PropertyCard = ({ property, initialWishlisted = false, onWishlistChange }) => {
  const { _id, name, images, rent, address, amenities, averageRating, numReviews, genderPreference, availableRooms } =
    property;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [busy, setBusy] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate("/login");
    if (busy) return;
    setBusy(true);
    try {
      const { data } = await api.post(`/wishlist/${_id}`);
      setWishlisted(data.added);
      onWishlistChange?.(_id, data.added);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const isAvailable = availableRooms === undefined || availableRooms > 0;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: "easeOut" }} className="h-full">
      <Link
        to={`/properties/${_id}`}
        className="card group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="relative h-48 w-full overflow-hidden bg-primary-100">
          <img
            src={images && images.length > 0 ? images[0] : FALLBACK_IMAGE}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-primary-700 shadow-sm">
            {genderPreference}
          </span>

          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
              isAvailable ? "bg-emerald-500/95 text-white" : "bg-secondary-700/90 text-white"
            }`}
          >
            {isAvailable ? "Available" : "Fully Booked"}
          </span>

          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-md backdrop-blur transition ${
              wishlisted ? "bg-red-500 text-white" : "bg-white/90 text-secondary-600 hover:text-red-500"
            }`}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold leading-snug text-secondary-900 line-clamp-1">{name}</h3>
            <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-accent-600">
              <Star size={14} className="fill-accent-500 text-accent-500" />
              {averageRating > 0 ? averageRating.toFixed(1) : "New"}
              {numReviews > 0 && <span className="text-secondary-400">({numReviews})</span>}
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-secondary-500">
            <MapPin size={14} />
            <span className="truncate">{address?.city}</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {amenities?.wifi && (
              <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                <Wifi size={12} /> WiFi
              </span>
            )}
            {amenities?.ac && (
              <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                <Wind size={12} /> AC
              </span>
            )}
            {amenities?.foodIncluded && (
              <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                <Utensils size={12} /> Food
              </span>
            )}
            {amenities?.parking && (
              <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-1 text-xs text-primary-700">
                <Car size={12} /> Parking
              </span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-3">
            <div>
              <span className="text-lg font-bold text-secondary-900">₹{rent?.toLocaleString("en-IN")}</span>
              <span className="text-sm text-secondary-400">/month</span>
            </div>
            <span className="rounded-lg bg-secondary-900 px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-primary-600">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
