import { useState } from "react";
import { FiLock, FiShield, FiEyeOff, FiCheckCircle, FiChevronDown } from "react-icons/fi";

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing and using the LoanHub application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service." },
  { title: "2. Description of Service", content: "LoanHub provides a platform for managing personal loans between lenders and borrowers. We facilitate loan tracking, payment management, and financial record keeping." },
  { title: "3. User Accounts", content: "To use our services, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials." },
  { title: "4. User Responsibilities", content: "Users agree to use the service only for lawful purposes. You shall not engage in fraudulent, misleading, or illegal activities through the platform." },
  { title: "5. Privacy & Data", content: "Your use is governed by our Privacy Policy. We collect and process personal data as described therein. By using our service, you consent to such processing." },
  { title: "6. Intellectual Property", content: "The service and its content are owned by LoanHub and protected by copyright and trademark laws. You may not copy, modify, or distribute any part without permission." },
  { title: "7. Limitation of Liability", content: "LoanHub shall not be liable for any indirect, incidental, or consequential damages from your use of the service." },
  { title: "8. Termination", content: "We may terminate your account without prior notice for violations of these Terms or conduct harmful to other users or third parties." },
  { title: "9. Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use after modifications constitutes acceptance of updated terms." },
  { title: "10. Contact Information", content: "Questions about these Terms? Contact us at support@loanhub.com or through our in-app support feature." },
];

const highlights = [
  { icon: <FiShield className="w-5 h-5 text-orange-500" />, title: "Data Encryption", desc: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256).", accent: "border-orange-100 bg-orange-50/50" },
  { icon: <FiLock className="w-5 h-5 text-blue-500" />, title: "Two-Factor Auth", desc: "Enable 2FA for an extra layer of protection on your account.", accent: "border-blue-100 bg-blue-50/50" },
  { icon: <FiEyeOff className="w-5 h-5 text-purple-500" />, title: "Privacy First", desc: "We never sell your data. Full control over your personal information.", accent: "border-purple-100 bg-purple-50/50" },
];

export function PrivacySecurity() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Page Hero */}
      <div className="relative overflow-hidden py-20 text-center"
        style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 60%,#f0fdf4 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle,#000 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full shadow-sm mb-6">
            <FiShield className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Privacy & Security</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Your Data is{" "}
            <span style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Safe with Us
            </span>
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto">
            Protected with bank-grade security standards and complete transparency.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 space-y-20">

        {/* Security Highlights */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Security Highlights</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((card, i) => (
              <div key={i}
                className={`rounded-2xl border ${card.accent} p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm flex-shrink-0">{card.icon}</div>
                  <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Accordion */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Privacy Policy & Terms of Service</p>
          <div className="space-y-2.5">
            {sections.map((section, i) => (
              <div key={i}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${expanded === i ? "border-orange-300 bg-orange-50/40" : "border-gray-100 hover:border-orange-200 bg-white shadow-sm"}`}>
                <button onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FiShield className={`w-4 h-4 flex-shrink-0 transition-colors ${expanded === i ? "text-orange-500" : "text-gray-400"}`} />
                    <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${expanded === i ? "rotate-180 text-orange-500" : ""}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${expanded === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-5 border-t border-orange-100">
                    <p className="text-sm text-gray-600 leading-relaxed pt-4">{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <FiCheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">Your security is our priority · Last updated: March 2026</p>
          </div>
          <a href="mailto:privacy@loanhub.com"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
            privacy@loanhub.com
          </a>
        </div>

      </div>
    </div>
  );
}