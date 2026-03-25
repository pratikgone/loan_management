import { useState } from "react";
import { BsClock } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";
import { FiMail, FiPhone, FiCalendar, FiChevronDown, FiSend } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";
import { BsPlayCircle, BsPeople, BsCollection } from "react-icons/bs";

export function HelpSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const faqItems = [
    {
      q: "How do I reset my password?",
      a: "Go to Settings → Account → Reset Password. You'll receive a verification code on your registered email or mobile. Enter the code and set a new strong password (minimum 8 characters with uppercase, lowercase, number, and special character).",
    },
    {
      q: "How can I contact support?",
      a: "You can reach our support team via:\n• Email: support@loanhub.com\n• In-app chat (available 9AM - 6PM IST)\n• Phone: +91 98765 43210 (Mon-Fri, 9AM-6PM)",
    },
    {
      q: "Is my data safe with LoanHub?",
      a: "Yes, we use bank-grade encryption (AES-256), HTTPS/TLS 1.3, and comply with RBI guidelines. We never sell or share your personal data without consent. All data is stored securely on encrypted servers.",
    },
    {
      q: "How do I update my profile or KYC details?",
      a: "Go to Dashboard → Profile → Edit Profile. You can update name, mobile, address, or upload new documents. For KYC changes, verification takes 24-48 hours.",
    },
    {
      q: "What should I do if my account is locked?",
      a: "If your account gets locked after multiple failed attempts, wait 30 minutes or contact support. You can also reset password using the 'Forgot Password' option on login page.",
    },
  ];

  const quickLinks = [
    { icon: <HiOutlineBookOpen className="w-6 h-6" />, title: "Guides", bg: "bg-blue-50", color: "text-blue-600", iconBg: "bg-blue-100" },
    { icon: <BsPlayCircle className="w-6 h-6" />, title: "Tutorials", bg: "bg-purple-50", color: "text-purple-600", iconBg: "bg-purple-100" },
    { icon: <BsPeople className="w-6 h-6" />, title: "Community", bg: "bg-green-50", color: "text-green-600", iconBg: "bg-green-100" },
    { icon: <BsCollection className="w-6 h-6" />, title: "Resources", bg: "bg-orange-50", color: "text-orange-600", iconBg: "bg-orange-100" },
  ];

  const contactCards = [
    {
      icon: <FiMail className="w-6 h-6 text-orange-500" />,
      title: "Email Us",
      desc: "support@loanhub.com",
      sub: "Reply within 24 hours",
      bg: "bg-orange-50",
      border: "border-orange-100",
    },
    {
      icon: <FiPhone className="w-6 h-6 text-emerald-500" />,
      title: "Call Us",
      desc: "+91 98765 43210",
      sub: "Mon–Fri, 9AM–6PM",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      icon: <FiCalendar className="w-6 h-6 text-blue-500" />,
      title: "Schedule",
      desc: "Book a Meetup",
      sub: "Pick a convenient slot",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

 return (
    <>
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">How can we Help?</h1>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

    
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {quickLinks.map((item, i) => (
            <div
              key={i}
              className={`${item.bg} rounded-2xl border border-orange-100 shadow-sm p-5 md:p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <div className={`${item.iconBg} p-3 rounded-xl mb-3 ${item.color}`}>
                {item.icon}
              </div>
              <p className={`text-sm font-bold ${item.color}`}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      

      {/* Contact Cards */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {contactCards.map((card, i) => (
            <div
              key={i}
              className={`${card.bg} rounded-2xl border ${card.border} shadow-sm p-5 md:p-6 flex items-center gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
            >
              <div className="bg-white p-3 rounded-xl shadow-sm">{card.icon}</div>
              <div>
                <p className="text-sm font-bold text-gray-900">{card.title}</p>
                <p className="text-sm text-gray-700 font-medium">{card.desc}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  expandedFaq === index ? "border-orange-300 bg-orange-50/40" : "border-gray-200 hover:border-orange-200"
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CiCircleInfo className={`w-5 h-5 flex-shrink-0 transition-colors ${expandedFaq === index ? "text-orange-500" : "text-gray-400"}`} />
                    <h3 className="text-sm md:text-base font-semibold text-gray-900">{item.q}</h3>
                  </div>
                  <FiChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${expandedFaq === index ? "rotate-180 text-orange-500" : ""}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedFaq === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-5 pb-5">
                    <div className="border-t border-orange-100 pt-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send Message */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-4">Describe your issue and we'll get back to you shortly.</p>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your issue or question here..."
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none resize-none text-sm transition-all"
          />
          <div className="flex items-center justify-between mt-4">
           
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <BsClock className="w-4 h-4 text-orange-400" />
              <span>We usually reply within 24 hours · 9AM–6PM, Mon–Fri</span>
            </div>
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            >
              {sent ? <><span>Sent!</span><span>✓</span></> : <><span>Send</span><FiSend className="w-4 h-4" /></>}
            </button>
          </div>
        
          {sent && (
            <div className="mt-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium text-center">
              ✅ Message sent! We'll get back to you soon.
            </div>
          )}
        </div>
      </div>
    </>
  );
}