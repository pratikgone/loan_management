import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function PublicNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home",             path: "/"          },
    { label: "Help & Support",   path: "/support"   },
    { label: "Privacy & Security", path: "/security" },
    // { label: "Settings",         path: "/settings"  },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600
                flex items-center justify-center shadow-md">
                <span style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "14px", fontWeight: 900,
                  color: "white", letterSpacing: "-1px",
                }}>LH</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-white
                rounded-full border-2 border-orange-500" />
            </div>
            <div>
              <p style={{ margin: 0, lineHeight: 1.2 }}>
                <span style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "17px", fontWeight: 900,
                  letterSpacing: "-0.5px",
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Loan</span>
                <span style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "17px", fontWeight: 900,
                  letterSpacing: "-0.5px", color: "#0f172a",
                }}>Hub</span>
              </p>
              <p style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "8px", fontWeight: 600,
                color: "#f97316", letterSpacing: "2.5px",
                margin: 0, opacity: 0.8,
              }}>LENDING PLATFORM</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "text-orange-600 bg-orange-50 font-semibold"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}>
                {link.label}
                {isActive(link.path) && (
                  <div className="h-0.5 bg-orange-500 rounded-full mt-0.5 mx-auto w-4/5" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Login Button ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5
                bg-gradient-to-r from-orange-500 to-orange-600
                hover:from-orange-600 hover:to-orange-700
                text-white text-sm font-bold rounded-xl
                shadow-md hover:shadow-orange-200 transition-all
                cursor-pointer active:scale-95">
              Login
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-600 hover:text-orange-600 transition-colors cursor-pointer">
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "text-orange-600 bg-orange-50 font-semibold"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1 px-2">
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600
                  text-white text-sm font-bold rounded-xl cursor-pointer">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}