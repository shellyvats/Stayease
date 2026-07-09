import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { Users, Building2, ClipboardCheck, ShieldAlert, Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("properties");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [s, p, u] = await Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/properties"),
      api.get("/admin/users"),
    ]);
    setStats(s.data);
    setProperties(p.data);
    setUsers(u.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/properties/${id}/approve`);
    loadData();
  };
  const flag = async (id) => {
    await api.put(`/admin/properties/${id}/flag`);
    loadData();
  };
  const toggleBlock = async (id) => {
    await api.put(`/admin/users/${id}/block`);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-primary-600">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: "Total Users", value: stats.totalUsers },
    { icon: Building2, label: "Total Properties", value: stats.totalProperties },
    { icon: ClipboardCheck, label: "Pending Approvals", value: stats.pendingApprovals },
    { icon: ShieldAlert, label: "Flagged Listings", value: stats.fakeListings },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-secondary-500">Moderate listings and manage platform users.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ icon: Icon, label, value }, i) => (
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

      <div className="mt-8 flex gap-2 border-b border-secondary-200">
        {["properties", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition ${
              tab === t ? "border-primary-600 text-primary-700" : "border-transparent text-secondary-500 hover:text-secondary-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "properties" ? (
        <div className="mt-6 flex flex-col gap-3">
          {properties.length === 0 && (
            <EmptyState icon={Building2} title="No properties yet" description="Listings submitted by owners will appear here for review." />
          )}
          {properties.map((p) => (
            <div key={p._id} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-secondary-900">{p.name}</p>
                <p className="text-sm text-secondary-500">
                  {p.address?.city} · Owner: {p.owner?.name} · ₹{p.rent}/mo
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.isFake
                      ? "bg-red-50 text-red-600"
                      : p.isApproved
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {p.isFake ? "Flagged" : p.isApproved ? "Approved" : "Pending"}
                </span>
                {!p.isApproved && !p.isFake && (
                  <button onClick={() => approve(p._id)} className="btn-primary !px-3 !py-1.5 text-xs">
                    Approve
                  </button>
                )}
                {!p.isFake && (
                  <button onClick={() => flag(p._id)} className="btn-secondary !px-3 !py-1.5 text-xs">
                    Flag as Fake
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {users.length === 0 && (
            <EmptyState icon={Users} title="No users yet" description="Registered students and owners will appear here." />
          )}
          {users.map((u) => (
            <div key={u._id} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-secondary-900">{u.name}</p>
                <p className="text-sm capitalize text-secondary-500">{u.email} · {u.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.isBlocked ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>
                {u.role !== "admin" && (
                  <button onClick={() => toggleBlock(u._id)} className="btn-secondary !px-3 !py-1.5 text-xs">
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
