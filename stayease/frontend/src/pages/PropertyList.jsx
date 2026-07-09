import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import FadeIn from "../components/FadeIn";
import { SlidersHorizontal, X, SearchX } from "lucide-react";

const initialFilters = {
  city: "",
  college: "",
  budgetMin: "",
  budgetMax: "",
  roomType: "",
  gender: "",
  ac: false,
  food: false,
  parking: false,
  wifi: false,
  laundry: false,
  sort: "",
};

const amenityOptions = [
  { key: "wifi", label: "WiFi" },
  { key: "ac", label: "AC" },
  { key: "food", label: "Food Included" },
  { key: "parking", label: "Parking" },
  { key: "laundry", label: "Laundry" },
];

const FiltersForm = ({ filters, setFilters, toggleFilter, onSubmit }) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-4">
    <div>
      <label className="label">City</label>
      <input
        className="input-field"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        placeholder="e.g. Ludhiana"
      />
    </div>
    <div>
      <label className="label">Nearby College</label>
      <input
        className="input-field"
        value={filters.college}
        onChange={(e) => setFilters({ ...filters, college: e.target.value })}
        placeholder="College name"
      />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label">Min Budget</label>
        <input
          type="number"
          className="input-field"
          value={filters.budgetMin}
          onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
          placeholder="₹0"
        />
      </div>
      <div>
        <label className="label">Max Budget</label>
        <input
          type="number"
          className="input-field"
          value={filters.budgetMax}
          onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
          placeholder="₹50,000"
        />
      </div>
    </div>
    <div>
      <label className="label">Room Type</label>
      <select
        className="input-field"
        value={filters.roomType}
        onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
      >
        <option value="">Any</option>
        <option value="Single">Single</option>
        <option value="Double">Double</option>
        <option value="Triple">Triple</option>
        <option value="Dormitory">Dormitory</option>
      </select>
    </div>
    <div>
      <label className="label">Gender</label>
      <select
        className="input-field"
        value={filters.gender}
        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
      >
        <option value="">Any</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Unisex">Unisex</option>
      </select>
    </div>

    <div className="flex flex-col gap-2">
      <label className="label mb-0">Amenities</label>
      {amenityOptions.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2 text-sm text-secondary-700">
          <input
            type="checkbox"
            checked={filters[key]}
            onChange={() => toggleFilter(key)}
            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-400"
          />
          {label}
        </label>
      ))}
    </div>

    <div>
      <label className="label">Sort By</label>
      <select
        className="input-field"
        value={filters.sort}
        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
      >
        <option value="">Newest</option>
        <option value="rent_asc">Rent: Low to High</option>
        <option value="rent_desc">Rent: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>

    <button type="submit" className="btn-primary w-full">
      Apply Filters
    </button>
  </form>
);

const PropertyList = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...initialFilters, city: searchParams.get("city") || "" });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async (pageNum = 1) => {
  setLoading(true);

  try {
    const params = {
      page: pageNum,
      limit: 9,
    };

    if (filters.city.trim()) params.city = filters.city;
    if (filters.college.trim()) params.college = filters.college;
    if (filters.roomType) params.roomType = filters.roomType;
    if (filters.gender) params.gender = filters.gender;

    if (filters.budgetMin) params.budgetMin = filters.budgetMin;
    if (filters.budgetMax) params.budgetMax = filters.budgetMax;

    if (filters.ac) params.ac = true;
    if (filters.food) params.food = true;
    if (filters.wifi) params.wifi = true;
    if (filters.parking) params.parking = true;
    if (filters.laundry) params.laundry = true;

    if (filters.sort) params.sort = filters.sort;

    console.log("Sending Params:", params);

    const { data } = await api.get("/properties", {
      params,
    });

    console.log("Received:", data);

    setProperties(data.properties);
    setPages(data.pages);
    setPage(data.page);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowFilters(false);
    fetchProperties(1);
  };

  const toggleFilter = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900 sm:text-3xl">Browse PGs &amp; Hostels</h1>
          <p className="mt-1 text-sm text-secondary-500">
            {loading ? "Searching..." : `${properties.length} propert${properties.length === 1 ? "y" : "ies"} found`}
          </p>
        </div>
        <button onClick={() => setShowFilters(true)} className="btn-secondary md:hidden">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <aside className="card hidden h-fit p-5 md:block">
          <h2 className="mb-4 flex items-center gap-2 font-display font-semibold text-secondary-900">
            <SlidersHorizontal size={16} className="text-primary-600" /> Filters
          </h2>
          <FiltersForm filters={filters} setFilters={setFilters} toggleFilter={toggleFilter} onSubmit={handleSearch} />
        </aside>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex md:hidden"
            >
              <div className="absolute inset-0 bg-secondary-900/50" onClick={() => setShowFilters(false)} />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display font-semibold text-secondary-900">Filters</h2>
                  <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                    <X size={20} />
                  </button>
                </div>
                <FiltersForm filters={filters} setFilters={setFilters} toggleFilter={toggleFilter} onSubmit={handleSearch} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No properties matched your search"
              description="Try widening your budget range, clearing a filter, or searching a nearby city."
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((p, i) => (
                  <FadeIn key={p._id} delay={Math.min(i, 6) * 0.05}>
                    <PropertyCard property={p} />
                  </FadeIn>
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchProperties(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                        p === page ? "bg-primary-600 text-white shadow-soft" : "border border-secondary-200 bg-white text-secondary-600 hover:border-primary-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
