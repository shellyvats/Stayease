import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import { ClipboardList, Heart, Search, Bell, Loader2, ArrowRight, CalendarClock } from "lucide-react";

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  visit_scheduled: "bg-primary-50 text-primary-700",
  cancelled: "bg-secondary-100 text-secondary-500",
  completed: "bg-primary-50 text-primary-700",
};

const StatCard = ({ icon: Icon, value, label, to }) => {
  const content = (
    <div className="card flex items-center gap-3 p-5 transition hover:shadow-lift">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={20} />
      </span>
      <div>
        {value !== undefined ? (
          <p className="font-display text-xl font-bold text-secondary-900">{value}</p>
        ) : (
          <p className="font-semibold text-secondary-900">{label}</p>
        )}
        {value !== undefined && <p className="text-sm text-secondary-500">{label}</p>}
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/bookings/mine"),
      api.get("/notifications"),
      api.get("/wishlist"),
    ])
      .then(([b, n, w]) => {
        setBookings(b.data);
        setNotifications(n.data);
        setWishlistCount(w.data.properties?.length || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-2xl font-bold text-secondary-900">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-secondary-500">Here's what's happening with your stay search.</p>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={ClipboardList} value={bookings.length} label="Total Bookings" />
        <StatCard icon={Heart} value={wishlistCount} label="Saved Properties" />
        <Link to="/properties" className="card flex items-center gap-3 p-5 transition hover:shadow-lift">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Search size={20} />
          </span>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <p className="font-semibold text-secondary-900">Find a new place</p>
              <p className="text-sm text-secondary-500">Browse listings</p>
            </div>
            <ArrowRight size={16} className="text-secondary-300" />
          </div>
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-secondary-900">My Bookings</h2>
          {loading ? (
            <div className="flex h-32 items-center justify-center text-primary-600">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No bookings yet" description="Start by browsing properties and sending a booking request." />
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.map((b) => (
                <div key={b._id} className="card flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold text-secondary-900">{b.property?.name}</p>
                    <p className="text-sm text-secondary-500">
                      {b.property?.address?.city} · Room: {b.roomType} · ₹{b.property?.rent}/mo
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[b.status]}`}>
                      {b.status.replace("_", " ")}
                    </span>
                    {b.status === "pending" && (
                      <button onClick={() => cancelBooking(b._id)} className="text-xs font-medium text-red-500 hover:underline">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-secondary-900">
            <Bell size={18} /> Notifications
          </h2>
          <div className="flex flex-col gap-3">
            {notifications.length === 0 && (
              <EmptyState icon={Bell} title="No notifications yet" description="Updates about your bookings will show up here." />
            )}
            {notifications.slice(0, 6).map((n) => (
              <div key={n._id} className="card p-4">
                <p className="text-sm font-semibold text-secondary-900">{n.title}</p>
                <p className="text-sm text-secondary-500">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
