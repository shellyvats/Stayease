import { useEffect, useState } from "react";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import FadeIn from "../components/FadeIn";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/wishlist")
      .then(({ data }) => setProperties(data.properties))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <Heart size={18} fill="currentColor" />
        </span>
        <h1 className="font-display text-2xl font-bold text-secondary-900">My Wishlist</h1>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Browse listings and tap the heart icon to save your favorite PGs and hostels here."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((p, i) => (
            <FadeIn key={p._id} delay={Math.min(i, 6) * 0.05}>
              <PropertyCard property={p} initialWishlisted />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
