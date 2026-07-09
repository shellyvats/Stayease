import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { Building2, DoorOpen, Wallet, PieChart, Plus, Loader2, ClipboardList } from "lucide-react";

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  visit_scheduled: "bg-primary-50 text-primary-700",
  cancelled: "bg-secondary-100 text-secondary-500",
  completed: "bg-primary-50 text-primary-700",
};

const OwnerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [a, p, b] = await Promise.all([
      api.get("/properties/owner/analytics"),
      api.get("/properties/owner/mine"),
      api.get("/bookings/owner"),
    ]);
    setAnalytics(a.data);
    setProperties(p.data);
    setBookings(b.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const respond = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    loadData();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-primary-600">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  const stats = [
    { icon: Building2, label: "Total Properties", value: analytics.totalProperties },
    { icon: DoorOpen, label: "Available Rooms", value: analytics.availableRooms },
    { icon: PieChart, label: "Occupancy Rate", value: `${analytics.occupancyRate}%` },
    { icon: Wallet, label: "Monthly Earnings", value: `₹${analytics.monthlyEarnings?.toLocaleString("en-IN")}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-secondary-900">Owner Dashboard</h1>
          <p className="mt-1 text-sm text-secondary-500">A snapshot of your properties and booking activity.</p>
        </div>
        <Link to="/owner/add-property" className="btn-primary">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="card flex items-center gap-3 p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Icon size={20} />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-secondary-900">{value}</p>
              <p className="text-sm text-secondary-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-secondary-900">My Properties</h2>
          <div className="flex flex-col gap-3">
            {properties.length === 0 && (
              <EmptyState icon={Building2} title="No properties listed yet" description="Add your first PG or hostel to start receiving booking requests." />
            )}
            {properties.map((p) => (
              <div key={p._id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-secondary-900">{p.name}</p>
                  <p className="text-sm text-secondary-500">
                    {p.address?.city} · {p.availableRooms}/{p.totalRooms} rooms available
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.isApproved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {p.isApproved ? "Approved" : "Pending Review"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-secondary-900">Booking Requests</h2>
          <div className="flex flex-col gap-3">
            {bookings.length === 0 && (
              <EmptyState icon={ClipboardList} title="No booking requests yet" description="Requests from interested tenants will appear here." />
            )}
            {bookings.map((b) => (
              <div key={b._id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-secondary-900">{b.property?.name}</p>
                    <p className="text-sm text-secondary-500">{b.student?.name} · {b.student?.phone}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[b.status]}`}>
                    {b.status.replace("_", " ")}
                  </span>
                </div>
                {b.message && <p className="mt-2 text-sm text-secondary-600">"{b.message}"</p>}
                {b.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => respond(b._id, "accepted")} className="btn-primary !px-3 !py-1.5 text-xs">
                      Accept
                    </button>
                    <button onClick={() => respond(b._id, "rejected")} className="btn-secondary !px-3 !py-1.5 text-xs">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
