import { useNavigate } from "react-router-dom";

const features = [
  { icon: "💰", title: "Smart Loan Management", desc: "Manage all your loan subscriptions, plans, and lenders from one centralized intelligent platform.", color: "bg-orange-50 text-orange-600" },
  { icon: "📊", title: "Real-Time Revenue Insights", desc: "Track revenue by plan, month, and year. Export reports as PDF with one click.", color: "bg-blue-50 text-blue-600" },
  { icon: "👥", title: "Lender Management", desc: "View, manage and monitor all lenders with their subscription status and plan details.", color: "bg-green-50 text-green-600" },
  { icon: "🔒", title: "Secure & Reliable", desc: "Enterprise-grade security with JWT authentication, OTP verification, and encrypted data.", color: "bg-purple-50 text-purple-600" },
  { icon: "📋", title: "Flexible Plan System", desc: "Create, edit, and manage subscription plans with custom features, pricing, and duration.", color: "bg-rose-50 text-rose-600" },
  { icon: "⚡", title: "Activity Tracking", desc: "Stay on top of every action — plan creation, updates, purchases — all logged in real-time.", color: "bg-amber-50 text-amber-600" },
];

const stats = [
  { value: "500+", label: "Active Lenders" },
  { value: "₹2Cr+", label: "Revenue Managed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const audiences = [
  "💼 NBFCs & Microfinance", "🏦 Loan Agencies", "📱 Fintech Startups",
  "🤝 Collection Agents", "📊 Revenue Analysts", "🔐 Admin Teams",
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #fff7ed 0%, #ffffff 50%, #f0fdf4 100%)" }}>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Blur blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #fb923c, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #fdba74, transparent 70%)" }} />

        <div className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full shadow-sm mb-10">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">LoanHub Admin Panel · Now Live</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.05] mb-8">
            Manage Loans.{" "}
            <span style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Track Revenue.
            </span>
            <br />
            <span className="text-gray-600 font-light">Lead With Confidence.</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-3 leading-relaxed">
            LoanHub — The Smart Way to Manage Lending Operations
          </p>
          <p className="text-sm text-gray-400 max-w-lg mx-auto mb-12 leading-relaxed">
            Complete subscription management, real-time revenue tracking, lender monitoring,
            and activity logs — all from one intelligent admin platform.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-200/50 transition-all cursor-pointer active:scale-95">
              Get Started →
            </button>
            <button onClick={() => navigate("/support")}
              className="flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-600 text-sm font-semibold rounded-2xl shadow-sm transition-all cursor-pointer">
              Learn More
            </button>
          </div>

          {/* Mini stats preview */}
          <div className="inline-flex flex-wrap justify-center gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl px-6 py-4 shadow-sm min-w-[100px]">
                <p className="text-2xl font-black text-orange-600">{s.value}</p>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }} className="py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-xs font-medium text-orange-100 mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm mb-8">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Who It's For</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Built for Businesses That{" "}
            <span style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Manage Lending
            </span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-12 text-sm">
            Whether you manage 10 lenders or 1,000 — LoanHub scales with your operations.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {audiences.map((item, i) => (
              <div key={i} className="px-5 py-2.5 bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600 text-gray-600 rounded-full text-sm font-medium shadow-sm transition-all cursor-default">
                {item}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            If your business involves lending,{" "}
            <span className="font-bold text-orange-500">LoanHub manages smarter.</span>
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Powerful Features.{" "}
              <span style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Zero Complexity.
              </span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Built for lending admins — clear, fast, and simple to use every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300">
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                <div className="w-6 h-0.5 bg-orange-300 rounded-full mt-5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: "white" }} />
        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">Ready to Take Control?</h2>
          <p className="text-orange-100 text-base mb-12 max-w-lg mx-auto">
            Join lending businesses already managing their operations smarter with LoanHub.
          </p>
          <button onClick={() => navigate("/login")}
            className="px-10 py-4 bg-white text-orange-600 text-sm font-black rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer active:scale-95">
            Login to Admin Panel →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                  <span style={{ fontFamily: "system-ui", fontSize: "13px", fontWeight: 900, color: "white", letterSpacing: "-1px" }}>LH</span>
                </div>
                <span className="text-lg font-black">LoanHub</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Advanced loan subscription management and revenue tracking for modern lending businesses.
              </p>
              <div className="flex gap-3 mt-6">
                {["L", "T", "F"].map(s => (
                  <div key={s} className="w-8 h-8 bg-white/10 hover:bg-orange-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-xs font-bold text-gray-400 hover:text-white">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Product</h4>
              <div className="w-5 h-0.5 bg-orange-500 rounded mb-5" />
              <ul className="space-y-3">
                {[{ label: "Home", path: "/" }, { label: "Login", path: "/login" }].map(l => (
                  <li key={l.path}>
                    <a href={l.path} className="text-sm text-gray-500 hover:text-orange-400 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Support</h4>
              <div className="w-5 h-0.5 bg-orange-500 rounded mb-5" />
              <ul className="space-y-3">
                {[{ label: "Help & Support", path: "/support" }, { label: "Privacy & Security", path: "/security" }].map(l => (
                  <li key={l.path}>
                    <a href={l.path} className="text-sm text-gray-500 hover:text-orange-400 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} LoanHub. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Built with ❤️ for lending businesses</p>
          </div>
        </div>
      </footer>
    </div>
  );
}