import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      const from =
        location.state?.from ||
        (data.role === "admin" ? "/admin" : data.role === "owner" ? "/owner" : "/student");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full overflow-hidden rounded-3xl shadow-lift lg:grid-cols-2"
      >
        <div className="relative hidden lg:block">
          <img src={HERO_IMAGE} alt="Cozy shared living room" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/30 to-secondary-900/10" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="font-display text-2xl font-bold">Welcome back to StayEase</h2>
            <p className="mt-2 text-sm text-white/80">
              Pick up right where you left off — track bookings, save favorites, and find your next stay.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <LogIn size={22} />
            </span>
            <h1 className="font-display text-2xl font-bold text-secondary-900">Welcome back</h1>
            <p className="mt-1 text-sm text-secondary-500">Log in to continue to StayEase</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field pl-10 pr-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
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
              {loading ? "Logging in..." : (
                <>
                  Log In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary-700">
              Sign up
            </Link>
          </p>

          <div className="mt-6 rounded-xl bg-primary-50/60 p-3 text-xs text-secondary-500">
            <p className="font-semibold text-primary-700">Demo accounts (after running seed):</p>
            <p>Admin: admin@stayease.com / admin123</p>
            <p>Owner: owner@stayease.com / owner123</p>
            <p>Student: student@stayease.com / student123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
