import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, GraduationCap, Building2 } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form);
      navigate(data.role === "owner" ? "/owner" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full overflow-hidden rounded-3xl shadow-lift lg:grid-cols-2"
      >
        <div className="relative hidden lg:block">
          <img src={HERO_IMAGE} alt="Bright student housing room" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/30 to-secondary-900/10" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="font-display text-2xl font-bold">Join StayEase today</h2>
            <p className="mt-2 text-sm text-white/80">
              Whether you're searching for a room or listing a property, StayEase makes it simple.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <UserPlus size={22} />
            </span>
            <h1 className="font-display text-2xl font-bold text-secondary-900">Create your account</h1>
            <p className="mt-1 text-sm text-secondary-500">Join StayEase in seconds</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: "student", label: "Student / Tenant", icon: GraduationCap },
                  { role: "owner", label: "Property Owner", icon: Building2 },
                ].map(({ role, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setForm({ ...form, role })}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      form.role === role
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-secondary-200 text-secondary-600 hover:border-primary-300"
                    }`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  required
                  className="input-field pl-10"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  className="input-field pl-10"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="input-field pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? "Creating account..." : (
                <>
                  Sign Up <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary-700">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
