import { Link } from "react-router-dom";
import { Home, Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Browse PGs & Hostels", to: "/properties" },
  { label: "List Your Property", to: "/register" },
  { label: "My Wishlist", to: "/wishlist" },
  { label: "Login", to: "/login" },
];

const socials = [
  { icon: Facebook, label: "Facebook" },
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "Twitter" },
  { icon: Linkedin, label: "LinkedIn" },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-secondary-800 bg-secondary-900 text-secondary-200">
    <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary-600/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
              <Home size={18} />
            </span>
            Stay<span className="text-primary-400">Ease</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-secondary-400">
            Helping students &amp; working professionals find verified, comfortable PGs and
            hostels — with transparent pricing and real reviews.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-secondary-300 transition hover:bg-primary-600 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h4>
          <ul className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-secondary-400 transition hover:text-primary-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-secondary-400">
            <li>About StayEase</li>
            <li>Verified Listings Policy</li>
            <li>Trust &amp; Safety</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Contact</h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-secondary-400">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-primary-400" /> support@stayease.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-primary-400" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="text-primary-400" /> Ludhiana, Punjab, India
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-xs text-secondary-500">
          © {new Date().getFullYear()} StayEase. All rights reserved.
        </p>
        <p className="text-xs text-secondary-500">Made for students &amp; professionals, everywhere.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
