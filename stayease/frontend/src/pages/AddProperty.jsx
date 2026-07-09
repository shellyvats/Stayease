import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { Building2, MapPin, Wallet, BedDouble, Sparkles, Info } from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  rent: "",
  securityDeposit: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  nearbyColleges: "",
  nearbyMetro: "",
  roomTypes: [],
  occupancy: "Single",
  genderPreference: "Unisex",
  totalRooms: "",
  availableRooms: "",
  wifi: false,
  ac: false,
  laundry: false,
  parking: false,
  foodIncluded: false,
  powerBackup: false,
  cctv: false,
};

const FormSection = ({ icon: Icon, title, subtitle, children }) => (
  <div className="border-b border-secondary-100 pb-6 last:border-0 last:pb-0">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        <Icon size={18} />
      </span>
      <div>
        <h2 className="font-display text-sm font-semibold text-secondary-900">{title}</h2>
        {subtitle && <p className="text-xs text-secondary-500">{subtitle}</p>}
      </div>
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const AddProperty = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleRoomType = (type) => {
    setForm((f) => ({
      ...f,
      roomTypes: f.roomTypes.includes(type)
        ? f.roomTypes.filter((t) => t !== type)
        : [...f.roomTypes, type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        rent: Number(form.rent),
        securityDeposit: Number(form.securityDeposit) || 0,
        address: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode },
        nearbyColleges: form.nearbyColleges.split(",").map((s) => s.trim()).filter(Boolean),
        nearbyMetro: form.nearbyMetro.split(",").map((s) => s.trim()).filter(Boolean),
        roomTypes: form.roomTypes,
        occupancy: form.occupancy,
        genderPreference: form.genderPreference,
        totalRooms: Number(form.totalRooms) || 1,
        availableRooms: Number(form.availableRooms) || 1,
        amenities: {
          wifi: form.wifi,
          ac: form.ac,
          laundry: form.laundry,
          parking: form.parking,
          foodIncluded: form.foodIncluded,
          powerBackup: form.powerBackup,
          cctv: form.cctv,
        },
      };
      await api.post("/properties", payload);
      navigate("/owner");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-6 sm:p-8"
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-soft">
            <Building2 size={22} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-secondary-900">List a New Property</h1>
            <p className="text-sm text-secondary-500">Your listing will be reviewed by our admin team before it goes live.</p>
          </div>
        </div>

        {error && <div className="mb-6 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormSection icon={Building2} title="Basic Details" subtitle="Tell tenants what makes this place great">
            <div>
              <label className="label">Property Name</label>
              <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Prime Boys PG" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your property..." />
            </div>
          </FormSection>

          <FormSection icon={Wallet} title="Pricing" subtitle="Monthly rent and refundable deposit">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Monthly Rent (₹)</label>
                <input required type="number" className="input-field" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} placeholder="8000" />
              </div>
              <div>
                <label className="label">Security Deposit (₹)</label>
                <input type="number" className="input-field" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} placeholder="8000" />
              </div>
            </div>
          </FormSection>

          <FormSection icon={MapPin} title="Location" subtitle="Where tenants will find you">
            <div>
              <label className="label">Address Line</label>
              <input required className="input-field" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">City</label>
                <input required className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input-field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input className="input-field" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="000000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nearby Colleges (comma separated)</label>
                <input className="input-field" value={form.nearbyColleges} onChange={(e) => setForm({ ...form, nearbyColleges: e.target.value })} placeholder="ABC College, XYZ University" />
              </div>
              <div>
                <label className="label">Nearby Metro / Transit (comma separated)</label>
                <input className="input-field" value={form.nearbyMetro} onChange={(e) => setForm({ ...form, nearbyMetro: e.target.value })} placeholder="Central Station" />
              </div>
            </div>
          </FormSection>

          <FormSection icon={BedDouble} title="Room Details" subtitle="Types, capacity, and preferences">
            <div>
              <label className="label">Room Types Offered</label>
              <div className="flex flex-wrap gap-2">
                {["Single", "Double", "Triple", "Dormitory"].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleRoomType(type)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      form.roomTypes.includes(type) ? "border-primary-500 bg-primary-50 text-primary-700" : "border-secondary-200 text-secondary-600 hover:border-primary-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Occupancy Type</label>
                <select className="input-field" value={form.occupancy} onChange={(e) => setForm({ ...form, occupancy: e.target.value })}>
                  <option>Single</option>
                  <option>Double</option>
                  <option>Triple</option>
                  <option>Dormitory</option>
                </select>
              </div>
              <div>
                <label className="label">Gender Preference</label>
                <select className="input-field" value={form.genderPreference} onChange={(e) => setForm({ ...form, genderPreference: e.target.value })}>
                  <option>Unisex</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Total Rooms</label>
                <input type="number" className="input-field" value={form.totalRooms} onChange={(e) => setForm({ ...form, totalRooms: e.target.value })} placeholder="20" />
              </div>
              <div>
                <label className="label">Available Rooms</label>
                <input type="number" className="input-field" value={form.availableRooms} onChange={(e) => setForm({ ...form, availableRooms: e.target.value })} placeholder="5" />
              </div>
            </div>
          </FormSection>

          <FormSection icon={Sparkles} title="Amenities" subtitle="What comes included">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { key: "wifi", label: "WiFi" },
                { key: "ac", label: "AC" },
                { key: "laundry", label: "Laundry" },
                { key: "parking", label: "Parking" },
                { key: "foodIncluded", label: "Food Included" },
                { key: "powerBackup", label: "Power Backup" },
                { key: "cctv", label: "CCTV" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-secondary-700">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={() => setForm({ ...form, [key]: !form[key] })}
                    className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-400"
                  />
                  {label}
                </label>
              ))}
            </div>
          </FormSection>

          <p className="flex items-start gap-2 rounded-xl bg-secondary-50 p-3 text-xs text-secondary-500">
            <Info size={14} className="mt-0.5 shrink-0" />
            Image upload via Cloudinary can be added later — see README for integration instructions.
          </p>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Submitting..." : "Submit Property for Review"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProperty;
