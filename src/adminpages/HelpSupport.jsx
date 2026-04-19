import { useState } from "react";
import { BsClock } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";
import { FiMail, FiPhone, FiCalendar, FiChevronDown, FiSend, FiSearch } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";
import { BsPlayCircle, BsPeople, BsCollection } from "react-icons/bs";

const faqItems = [
  { q: "How do I reset my password?", a: "Go to Settings → Account → Reset Password. You'll receive a verification code on your registered email or mobile. Enter the code and set a new strong password." },
  { q: "How can I contact support?", a: "Email: support@loanhub.com · In-app chat (9AM–6PM IST) · Phone: +91 98765 43210 (Mon–Fri, 9AM–6PM)" },
  { q: "Is my data safe with LoanHub?", a: "Yes. We use bank-grade AES-256 encryption and HTTPS/TLS 1.3. We comply with RBI guidelines and never sell or share your personal data." },
  { q: "How do I update my profile or KYC details?", a: "Go to Dashboard → Profile → Edit Profile. KYC changes take 24–48 hours to verify." },
  { q: "What should I do if my account is locked?", a: "Wait 30 minutes or use 'Forgot Password' on the login page. You can also contact support directly." },
];

const quickLinks = [
  { icon: <HiOutlineBookOpen className="w-5 h-5" />, title: "Guides", color: "text-blue-600", bg: "bg-blue-50", iconBg: "bg-blue-100 text-blue-600" },
  { icon: <BsPlayCircle className="w-5 h-5" />, title: "Tutorials", color: "text-purple-600", bg: "bg-purple-50", iconBg: "bg-purple-100 text-purple-600" },
  { icon: <BsPeople className="w-5 h-5" />, title: "Community", color: "text-green-600", bg: "bg-green-50", iconBg: "bg-green-100 text-green-600" },
  { icon: <BsCollection className="w-5 h-5" />, title: "Resources", color: "text-orange-600", bg: "bg-orange-50", iconBg: "bg-orange-100 text-orange-600" },
];

const contactCards = [
  { icon: <FiMail className="w-5 h-5 text-orange-500" />, title: "Email Us", desc: "support@loanhub.com", sub: "Reply within 24 hours", accent: "border-orange-200 bg-orange-50/50" },
  { icon: <FiPhone className="w-5 h-5 text-emerald-500" />, title: "Call Us", desc: "+91 98765 43210", sub: "Mon–Fri, 9AM–6PM IST", accent: "border-emerald-200 bg-emerald-50/50" },
  { icon: <FiCalendar className="w-5 h-5 text-blue-500" />, title: "Schedule", desc: "Book a Meetup", sub: "Pick a convenient slot", accent: "border-blue-200 bg-blue-50/50" },
];

export function HelpSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Page Hero */}
      <div className="relative overflow-hidden py-20 text-center"
        style={{ background: "linear-gradient(160deg,#fff7ed 0%,#ffffff 60%,#f0fdf4 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle,#000 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full shadow-sm mb-6">
            <MdOutlineSupportAgent className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest">Support Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            How can we <span style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Help?</span>
          </h1>
          <p className="text-gray-400 text-base max-w-md mx-auto mb-8">
            Find answers to common questions or get in touch with our support team.
          </p>
          {/* Search bar */}
          {/* <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl shadow-md px-5 py-4 max-w-md mx-auto">
            <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input placeholder="Search for help..." className="flex-1 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400" />
          </div> */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 space-y-20">

        {/* Quick Access */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Quick Access</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((item, i) => (
              <div key={i}
                className={`${item.bg} rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
                <div className={`${item.iconBg} p-3 rounded-xl mb-3`}>{item.icon}</div>
                <p className={`text-sm font-semibold ${item.color}`}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Contact Us</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactCards.map((card, i) => (
              <div key={i}
                className={`rounded-2xl border ${card.accent} p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}>
                <div className="bg-white p-3 rounded-xl shadow-sm flex-shrink-0">{card.icon}</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{card.title}</p>
                  <p className="text-sm font-medium text-gray-700">{card.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Frequently Asked Questions</p>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${expandedFaq === i ? "border-orange-300 bg-orange-50/40" : "border-gray-100 hover:border-orange-200 bg-white shadow-sm"}`}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CiCircleInfo className={`w-4 h-4 flex-shrink-0 transition-colors ${expandedFaq === i ? "text-orange-500" : "text-gray-400"}`} />
                    <h3 className="text-sm font-semibold text-gray-900">{item.q}</h3>
                  </div>
                  <FiChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${expandedFaq === i ? "rotate-180 text-orange-500" : ""}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${expandedFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-5 border-t border-orange-100">
                    <p className="text-sm text-gray-600 leading-relaxed pt-4 whitespace-pre-line">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Send a Message</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Describe your issue</h3>
              <p className="text-xs text-gray-400 mt-0.5">We'll get back to you within 24 hours.</p>
            </div>
            <div className="p-6">
              <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Type your issue or question here..."
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 hover:border-orange-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 rounded-2xl outline-none resize-none text-sm transition-all text-gray-700 placeholder-gray-400" />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <BsClock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Replies within 24 hrs · Mon–Fri, 9AM–6PM</span>
                </div>
                <button onClick={handleSend}
                  className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95">
                  {sent ? <><span>Sent!</span><span>✓</span></> : <><span>Send</span><FiSend className="w-3.5 h-3.5" /></>}
                </button>
              </div>

              {sent && (
                <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium text-center">
                  ✅ Message sent! We'll get back to you soon.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}