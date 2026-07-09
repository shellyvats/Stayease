import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";

const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center sm:px-6">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
      className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-500"
    >
      <SearchX size={36} />
    </motion.div>
    <h1 className="mt-6 font-display text-6xl font-extrabold text-secondary-900">404</h1>
    <p className="mt-4 text-lg text-secondary-500">Oops, this page doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6">
      <Home size={16} /> Back to Home
    </Link>
  </div>
);

export default NotFound;
