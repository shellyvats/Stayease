import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, ShieldCheck, MapPinned, Star, Building2, ArrowRight,
  Wifi, Utensils, Car, Wind, Quote, Users, Home as HomeIcon, TrendingUp,
} from "lucide-react";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import FadeIn from "../components/FadeIn";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80";

const cities = [
  {
    name: "Ludhiana",
    img: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=500&q=70",
  },
  {
    name: "Chandigarh",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=70",
  },
  {
    name: "Delhi",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=70",
  },
  {
    name: "Bengaluru",
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=70",
  },
];
const features = [
  { icon: ShieldCheck, title: "Verified Listings", desc: "Every property is checked and approved by our admin team before it goes live." },
  { icon: MapPinned, title: "Smart Search", desc: "Filter by budget, amenities, gender preference, room type & nearby colleges." },
  { icon: Star, title: "Real Reviews", desc: "Ratings and reviews from actual tenants, not marketing copy." },
  { icon: Building2, title: "Direct Booking", desc: "Send booking requests and schedule visits directly with property owners." },
];

const stats = [
  { icon: Building2, value: "1,200+", label: "Verified Properties" },
  { icon: Users, value: "15,000+", label: "Happy Tenants" },
  { icon: MapPinned, value: "40+", label: "Cities Covered" },
  { icon: TrendingUp, value: "4.7/5", label: "Average Rating" },
];

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Student, Delhi University",
    quote: "StayEase made finding a safe, affordable PG near campus incredibly easy. The verified badge gave me real peace of mind.",
  },
  {
    name: "Rohit Verma",
    role: "Software Engineer, Bengaluru",
    quote: "I booked a room within a day of moving cities. Transparent pricing, no brokerage surprises, and a responsive owner.",
  },
  {
    name: "Priya Nair",
    role: "PG Owner, Chandigarh",
    quote: "Listing my property was simple, and the quality of tenant inquiries I get through StayEase is genuinely better.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/properties", { params: { page: 1, limit: 6, sort: "rating" } })
      .then(({ data }) => setPopular(data.properties || []))
      .catch(() => setPopular([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties${city ? `?city=${encodeURIComponent(city)}` : ""}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Modern shared living space" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-32 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              Verified PGs &amp; Hostels, near your college
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your perfect <span className="text-accent-400">PG or Hostel</span>, hassle-free
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              StayEase helps students and working professionals discover, compare, and book
              verified accommodations — with transparent pricing and real reviews.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-9 flex max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-lift sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <Search className="text-secondary-400" size={20} />
                <input
                  className="w-full bg-transparent px-1 py-2.5 text-sm text-secondary-900 outline-none placeholder:text-secondary-400"
                  placeholder="Search by city, e.g. Ludhiana, Chandigarh..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><Wifi size={14} /> Free WiFi</span>
              <span className="flex items-center gap-1.5"><Utensils size={14} /> Food Included</span>
              <span className="flex items-center gap-1.5"><Wind size={14} /> AC Rooms</span>
              <span className="flex items-center gap-1.5"><Car size={14} /> Parking</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 sm:px-6">
        <FadeIn className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-lift sm:grid-cols-4 sm:p-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon size={18} />
              </span>
              <p className="font-display text-xl font-extrabold text-secondary-900 sm:text-2xl">{value}</p>
              <p className="text-xs text-secondary-500 sm:text-sm">{label}</p>
            </div>
          ))}
        </FadeIn>
      </section>

      {/* Popular Properties */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-20 sm:px-6">
        <FadeIn className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="section-heading-eyebrow">Handpicked for you</span>
          <h2 className="font-display text-3xl font-extrabold text-secondary-900">Popular Properties</h2>
          <p className="max-w-xl text-secondary-500">Top-rated PGs and hostels loved by students and professionals alike.</p>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : popular.map((p, i) => (
                <FadeIn key={p._id} delay={i * 0.06}>
                  <PropertyCard property={p} />
                </FadeIn>
              ))}
        </div>

        {!loading && popular.length === 0 && (
          <div className="card p-10 text-center text-secondary-500">
            No properties listed yet — check back soon!
          </div>
        )}

        <FadeIn className="mt-10 flex justify-center">
          <button onClick={() => navigate("/properties")} className="btn-secondary">
            View All Properties <ArrowRight size={16} />
          </button>
        </FadeIn>
      </section>

      {/* Why Choose StayEase */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <FadeIn className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="section-heading-eyebrow">Why StayEase</span>
          <h2 className="font-display text-3xl font-extrabold text-secondary-900">Built for real students &amp; professionals</h2>
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -4 }} className="card h-full p-6 transition-shadow hover:shadow-lift">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={22} />
                </div>
                <h3 className="mb-1 font-display font-semibold text-secondary-900">{title}</h3>
                <p className="text-sm text-secondary-500">{desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Cities */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FadeIn className="mb-10 flex flex-col items-center gap-2 text-center">
            <span className="section-heading-eyebrow">Explore by city</span>
            <h2 className="font-display text-3xl font-extrabold text-secondary-900">Featured Cities</h2>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.08}>
                <button
                  onClick={() => navigate(`/properties?city=${encodeURIComponent(c.name)}`)}
                  className="group relative h-44 w-full overflow-hidden rounded-2xl shadow-card"
                >
                  <img src={c.img} alt={c.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/10 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-display text-lg font-bold text-white">{c.name}</span>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <FadeIn className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="section-heading-eyebrow">Testimonials</span>
          <h2 className="font-display text-3xl font-extrabold text-secondary-900">Loved by our community</h2>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <div className="card h-full p-6">
                <Quote className="mb-3 text-primary-200" size={28} />
                <p className="text-sm text-secondary-600">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white">
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{t.name}</p>
                    <p className="text-xs text-secondary-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-secondary-900 p-10 sm:p-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
            <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-400 sm:mb-3">
                  <HomeIcon size={20} />
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">Are you a property owner?</h2>
                <p className="mt-2 max-w-md text-secondary-300">
                  List your PG or hostel on StayEase and reach thousands of verified students &amp; professionals.
                </p>
              </div>
              <button onClick={() => navigate("/register")} className="btn-accent shrink-0">
                List Your Property <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default Home;
