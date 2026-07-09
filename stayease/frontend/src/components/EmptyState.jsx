import { motion } from "framer-motion";

// Consistent empty-state block: icon, message, and optional CTA button.
// Used across dashboards, wishlist, and lists whenever there's no data yet.
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card flex flex-col items-center gap-3 px-6 py-14 text-center"
  >
    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
      {Icon && <Icon size={28} />}
    </span>
    <h3 className="text-base font-semibold text-secondary-900">{title}</h3>
    {description && (
      <p className="max-w-sm text-sm text-secondary-500">{description}</p>
    )}
    {action}
  </motion.div>
);

export default EmptyState;
