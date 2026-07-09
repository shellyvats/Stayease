# StayEase – Smart PG & Hostel Finder Platform

A full-stack **MERN** application (MongoDB, Express, React, Node.js) that helps students
and working professionals discover, compare, and book verified PGs, hostels, and rental
accommodations.

---

## ✨ Features implemented in this build

- JWT authentication (register/login) with 3 roles: **student**, **owner**, **admin**
- Advanced property search & filters (city, college, budget, room type, gender, amenities)
- Property listing CRUD for owners, with admin approval workflow
- Booking request system (student sends request → owner accepts/rejects)
- Reviews & ratings with owner replies
- Wishlist (save favorite properties)
- In-app notifications (booking accepted/rejected, etc.)
- Role-based dashboards:
  - **Student**: bookings, saved properties, notifications
  - **Owner**: properties, monthly earnings, occupancy rate, booking requests
  - **Admin**: user management, property approval, fake-listing flagging, platform stats
- Professional, subtle UI theme (muted teal/slate palette) with a soft gradient + grid backdrop
- Seed script with demo accounts and sample properties

### Not included yet (see "Future Enhancements" in the brief)
Real-time chat, Google Maps/Leaflet integration, Cloudinary image upload wiring, online
payments, 360° tours, AI recommendations, QR check-in, roommate matching. The codebase is
structured so these can be added incrementally — see notes at the bottom.

---

## 🗂 Project Structure

```
stayease/
├── backend/              Node.js + Express + MongoDB API
│   ├── config/db.js
│   ├── models/            User, Property, Booking, Review, Wishlist, Notification
│   ├── controllers/
│   ├── routes/
│   ├── middleware/         auth (JWT) + role-based access
│   ├── seed/seed.js        sample data
│   └── server.js
└── frontend/              React (Vite) + Tailwind CSS
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/     Navbar, Footer, PropertyCard, Backdrop, PrivateRoute
        └── pages/           Home, Login, Register, PropertyList, PropertyDetail,
                             AddProperty, Wishlist, Student/Owner/Admin Dashboards
```

---

## 🚀 Running locally

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally OR a free MongoDB Atlas cluster

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set at minimum:
```
MONGO_URI=mongodb://127.0.0.1:27017/stayease
JWT_SECRET=some_long_random_string
```

(If you don't have MongoDB installed locally, create a free cluster at
https://www.mongodb.com/cloud/atlas and paste the connection string instead.)

Seed the database with demo accounts and sample properties:
```bash
npm run seed
```

Start the API server (runs on http://localhost:5000):
```bash
npm run dev
```

### 2. Frontend setup

In a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (Vite proxies `/api` calls to the
backend automatically, configured in `vite.config.js`).

### 3. Demo accounts (after running `npm run seed`)

| Role    | Email                | Password    |
|---------|-----------------------|-------------|
| Admin   | admin@stayease.com    | admin123    |
| Owner   | owner@stayease.com    | owner123    |
| Student | student@stayease.com  | student123  |

---

## 📦 Pushing to GitHub

```bash
cd stayease
git init
git add .
git commit -m "Initial commit: StayEase MERN platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` files are already excluded via `.gitignore` — never commit real secrets.

---

## 🎨 Design notes

- Color theme: a **muted teal/slate palette** (`primary-*` and `surface-*` in
  `frontend/tailwind.config.js`) — intentionally not stark white/black, and not a dark theme.
- A subtle **backdrop** (`.app-backdrop` in `src/index.css`) sits behind the whole app: soft
  radial gradients plus a faint grid, masked so it fades toward the edges. It's rendered once
  in `App.jsx` via the `<Backdrop />` component (fixed position, `z-index: -1`), so every page
  gets it automatically without needing to repeat the styling.
- Cards use a light translucent white background with `backdrop-blur-sm` so the backdrop is
  visible through the UI without hurting readability.

---

## 🔌 Wiring up optional integrations later

- **Image uploads (Cloudinary)**: `cloudinary` and `multer-storage-cloudinary` are already in
  `backend/package.json`. Add a `backend/middleware/upload.js` using
  `CloudinaryStorage`, then an endpoint like `POST /api/properties/:id/images` that uses
  `upload.array("images")` and pushes the resulting URLs into `property.images`.
- **Maps (Google Maps or Leaflet + OpenStreetMap)**: `Property.location.lat/lng` is already
  stored in the schema. On the frontend, install `react-leaflet` (free, no API key) or
  `@react-google-maps/api` and render a `<Map>` component on `PropertyDetail.jsx` using those
  coordinates.
- **Real-time chat**: add `socket.io` to `backend/server.js` and a `Message` model
  (sender, receiver, propertyId, text, timestamp), then a simple chat widget on
  `PropertyDetail.jsx`.
- **Online rent payment**: integrate Razorpay/Stripe in a new `paymentController.js` tied to
  the `Booking` model.

---

## 🧾 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, lucide-react
**Backend:** Node.js, Express.js
**Database:** MongoDB (Mongoose)
**Auth:** JWT + bcrypt
**Planned storage/maps:** Cloudinary, Google Maps API / Leaflet
