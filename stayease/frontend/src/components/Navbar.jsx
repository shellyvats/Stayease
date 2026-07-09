import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Menu, X, Heart, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavLink = ({ to, children }) => (
  <Link to={to} className="group relative text-sm font-medium text-secondary-600 transition hover:text-primary-700">
    {children}
    <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-primary-600 transition-all duration-300 group-hover:w-full" />
  </Link>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const dashboardLink =
    user?.role === "admin" ? "/admin" : user?.role === "owner" ? "/owner" : "/student";

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 border-b border-secondary-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-secondary-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-soft">
            <Home size={18} />
          </span>
          <span className="text-lg tracking-tight">
            Stay<span className="text-primary-600">Ease</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/properties">Browse PGs &amp; Hostels</NavLink>
          {user?.role === "owner" && <NavLink to="/owner/add-property">List Your Property</NavLink>}
          {user && (
            <Link
              to="/wishlist"
              className="group relative flex items-center gap-1.5 text-sm font-medium text-secondary-600 transition hover:text-primary-700"
            >
              <Heart size={16} /> Wishlist
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-primary-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to={dashboardLink} className="btn-secondary !px-4 !py-2 text-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                to={dashboardLink}
                title={user.name}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white shadow-soft"
              >
                {initial}
              </Link>
              <button onClick={handleLogout} className="btn-primary !px-4 !py-2 text-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2 text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                <User size={16} /> Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary-700 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-secondary-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              {user && (
                <div className="mb-1 flex items-center gap-3 rounded-xl bg-primary-50 p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-display text-sm font-bold text-white">
                    {initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900">{user.name}</p>
                    <p className="text-xs capitalize text-secondary-500">{user.role}</p>
                  </div>
                </div>
              )}
              <Link to="/properties" onClick={() => setOpen(false)} className="text-sm font-medium text-secondary-700">
                Browse PGs &amp; Hostels
              </Link>
              {user?.role === "owner" && (
                <Link to="/owner/add-property" onClick={() => setOpen(false)} className="text-sm font-medium text-secondary-700">
                  List Your Property
                </Link>
              )}
              {user && (
                <Link to="/wishlist" onClick={() => setOpen(false)} className="text-sm font-medium text-secondary-700">
                  Wishlist
                </Link>
              )}
              {user ? (
                <>
                  <Link to={dashboardLink} onClick={() => setOpen(false)} className="text-sm font-medium text-secondary-700">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-primary w-full">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full text-center">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
