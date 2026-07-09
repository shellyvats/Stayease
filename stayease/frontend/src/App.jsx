import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "./components/Backdrop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import Wishlist from "./pages/Wishlist";
import StudentDashboard from "./pages/StudentDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col">
      <Backdrop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/properties" element={<PageTransition><PropertyList /></PageTransition>} />
            <Route path="/properties/:id" element={<PageTransition><PropertyDetail /></PageTransition>} />

            <Route
              path="/wishlist"
              element={
                <PrivateRoute>
                  <PageTransition><Wishlist /></PageTransition>
                </PrivateRoute>
              }
            />

            <Route
              path="/student"
              element={
                <PrivateRoute roles={["student"]}>
                  <PageTransition><StudentDashboard /></PageTransition>
                </PrivateRoute>
              }
            />

            <Route
              path="/owner"
              element={
                <PrivateRoute roles={["owner"]}>
                  <PageTransition><OwnerDashboard /></PageTransition>
                </PrivateRoute>
              }
            />
            <Route
              path="/owner/add-property"
              element={
                <PrivateRoute roles={["owner"]}>
                  <PageTransition><AddProperty /></PageTransition>
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute roles={["admin"]}>
                  <PageTransition><AdminDashboard /></PageTransition>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
