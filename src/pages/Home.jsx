import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "💰",
    title: "Smart Loan Management",
    desc: "Manage all your loan subscriptions, plans, and lenders from one centralized intelligent platform.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: "📊",
    title: "Real-Time Revenue Insights",
    desc: "Track revenue by plan, month, and year. Export reports as PDF with one click.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "👥",
    title: "Lender Management",
    desc: "View, manage and monitor all lenders with their subscription status and plan details.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    desc: "Enterprise-grade security with JWT authentication, OTP verification, and encrypted data.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: "📋",
    title: "Flexible Plan System",
    desc: "Create, edit, and manage subscription plans with custom features, pricing, and duration.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: "⚡",
    title: "Activity Tracking",
    desc: "Stay on top of every action — plan creation, updates, purchases — all logged in real-time.",
    color: "bg-amber-50 text-amber-600",
  },
];

const stats = [
  { value: "500+", label: "Active Lenders" },
  { value: "₹2Cr+", label: "Revenue Managed" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 min-h-[90vh] flex items-center">
        {/* Dot grid background */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />

        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-orange-300 rounded-full opacity-15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white
            border border-orange-200 rounded-full shadow-sm mb-8">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-orange-600">
              LoanHub Admin Panel — Now Live
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900
            tracking-tight leading-tight mb-6">
            Manage Loans.{" "}
            <span style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Track Revenue.
            </span>
            <br />
            Lead With Confidence.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
            LoanHub — The Smart Way to Manage Lending Operations
          </p>
          <p className="text-base text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Complete subscription management, real-time revenue tracking, lender monitoring,
            and activity logs — all from one intelligent admin platform.
          </p>

          <p className="text-gray-500 mb-10 text-sm">
            No assumptions. No blind spots. Just{" "}
            <span className="italic font-semibold text-orange-500">clarity.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r
                from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                text-white text-base font-bold rounded-2xl shadow-lg
                hover:shadow-orange-200 transition-all cursor-pointer active:scale-95">
              Get Started →
            </button>
            <button
              onClick={() => navigate("/support")}
              className="flex items-center gap-2 px-8 py-4 bg-white
                border-2 border-gray-200 hover:border-orange-300
                text-gray-700 hover:text-orange-600
                text-base font-bold rounded-2xl shadow-sm
                transition-all cursor-pointer active:scale-95">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm font-medium text-orange-100 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center px-4 py-2 bg-white border
            border-gray-200 rounded-full shadow-sm mb-6">
            <span className="text-sm font-semibold text-gray-600">Who It's For</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Built for Businesses That{" "}
            <span style={{
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Manage Lending
            </span>
          </h2>

          <p className="text-gray-500 max-w-xl mx-auto mb-10">
            Whether you manage 10 lenders or 1,000 — LoanHub scales with your operations.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "💼 NBFCs & Microfinance",
              "🏦 Loan Agencies",
              "📱 Fintech Startups",
              "🤝 Collection Agents",
              "📊 Revenue Analysts",
              "🔐 Admin Teams",
            ].map((item, i) => (
              <div key={i}
                className="px-5 py-2.5 bg-white border border-gray-200
                  rounded-full text-sm font-semibold text-gray-700
                  shadow-sm hover:border-orange-300 hover:text-orange-600
                  transition-all cursor-default">
                {item}
              </div>
            ))}
          </div>

          <p className="mt-10 text-gray-500 text-base">
            If your business involves lending,{" "}
            <span className="font-bold text-orange-500">LoanHub manages smarter.</span>
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50
              border border-orange-100 rounded-full shadow-sm mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-sm font-semibold text-orange-600">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Powerful Features.{" "}
              <span style={{
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Zero Complexity.
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Built for lending admins — clear, fast, and simple to use every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-2xl p-7
                  shadow-sm hover:shadow-md hover:border-orange-200
                  transition-all duration-300 group">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center
                  justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="w-8 h-0.5 bg-orange-300 rounded-full mt-5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">
            Join lending businesses already managing their operations smarter with LoanHub.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-white text-orange-600
              text-base font-black rounded-2xl shadow-lg
              hover:shadow-xl hover:scale-[1.02]
              transition-all cursor-pointer active:scale-95">
            Login to Admin Panel →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400
                  to-orange-600 flex items-center justify-center shadow-md">
                  <span style={{
                    fontFamily: "system-ui", fontSize: "14px",
                    fontWeight: 900, color: "white", letterSpacing: "-1px",
                  }}>LH</span>
                </div>
                <span style={{
                  fontFamily: "system-ui", fontSize: "18px",
                  fontWeight: 900, color: "white",
                }}>LoanHub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Advanced loan subscription management and revenue tracking solution
                for modern lending businesses.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {["LinkedIn", "Twitter", "Facebook"].map((s) => (
                  <div key={s}
                    className="w-9 h-9 bg-white/10 hover:bg-orange-500
                      rounded-lg flex items-center justify-center
                      cursor-pointer transition-colors text-xs font-bold text-gray-300">
                    {s[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Product
              </h4>
              <div className="h-0.5 bg-orange-500 w-8 rounded-full mb-4" />
              <ul className="space-y-3 text-sm text-gray-400">
                {[
                  { label: "Home", path: "/" },
                  { label: "Login", path: "/login" },
                ].map((l) => (
                  <li key={l.path}>
                    <a href={l.path}
                      className="hover:text-orange-400 transition-colors cursor-pointer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Support
              </h4>
              <div className="h-0.5 bg-orange-500 w-8 rounded-full mb-4" />
              <ul className="space-y-3 text-sm text-gray-400">
                {[
                  { label: "Help & Support", path: "/support" },
                  { label: "Privacy & Security", path: "/security" },
                  { label: "Settings", path: "/settings" },
                ].map((l) => (
                  <li key={l.path}>
                    <a href={l.path}
                      className="hover:text-orange-400 transition-colors cursor-pointer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row
            items-center justify-between gap-3">
            <p className="text-gray-500 text-xs">
              © {new Date().getFullYear()} LoanHub. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Built with ❤️ for lending businesses
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}