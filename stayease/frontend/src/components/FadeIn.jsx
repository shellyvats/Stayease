import { motion } from "framer-motion";

// Reusable scroll-triggered fade/slide-in wrapper. Wrap any section or card
// with this to get a consistent, subtle entrance animation across the app.
const FadeIn = ({
  children,
  delay = 0,
  y = 24,
  className = "",
  as = "div",
  once = true,
}) => {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
};

export default FadeIn;
