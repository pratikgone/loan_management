import { useState } from 'react';
import { FiLock, FiShield, FiEyeOff, FiCheckCircle, FiChevronDown } from 'react-icons/fi';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing and using the LoanHub application, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: '2. Description of Service',
    content:
      'LoanHub provides a platform for managing personal loans between lenders and borrowers. Our service facilitates loan tracking, payment management, and financial record keeping. We do not provide financial advice or act as a financial institution.',
  },
  {
    title: '3. User Accounts',
    content:
      'To use our services, you must create an account with accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.',
  },
  {
    title: '4. User Responsibilities',
    content:
      'Users agree to use the service only for lawful purposes and in accordance with these terms. You shall not use the service to engage in any fraudulent, misleading, or illegal activities. All loan agreements made through the platform are between the respective parties.',
  },
  {
    title: '5. Privacy & Data',
    content:
      'Your use of the service is also governed by our Privacy Policy. We collect and process personal data as described in our Privacy Policy. By using our service, you consent to such processing and warrant that all data provided by you is accurate.',
  },
  {
    title: '6. Intellectual Property',
    content:
      'The service and its original content, features, and functionality are owned by LoanHub and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of our service without permission.',
  },
  {
    title: '7. Limitation of Liability',
    content:
      'LoanHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. We do not guarantee the accuracy of loan calculations or the reliability of user-provided information.',
  },
  {
    title: '8. Termination',
    content:
      'We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.',
  },
  {
    title: '9. Changes to Terms',
    content:
      'We reserve the right to modify these terms at any time. We will notify users of any material changes via the app or email. Your continued use of the service after such modifications constitutes acceptance of the updated terms.',
  },
  {
    title: '10. Contact Information',
    content:
      'If you have any questions about these Terms of Service, please contact us at support@loanhub.com or through our in-app support feature.',
  },
];

export function PrivacySecurity() {
  const [expanded, setExpanded] = useState(null);

  return (
    <>
      {/* Heading */}
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Privacy & Security</h1>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Your personal and financial information is protected with bank-grade security standards.
        </p>
      </div>

      {/* Security Highlight Cards */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Security Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              icon: <FiShield className="w-5 h-5 text-orange-500" />,
              title: 'Data Encryption',
              desc: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256).',
              bg: 'bg-orange-50',
              border: 'border-orange-100',
              iconBg: 'bg-white',
            },
            {
              icon: <FiLock className="w-5 h-5 text-orange-500" />,
              title: 'Two-Factor Auth',
              desc: 'Enable 2FA for an extra layer of protection on your account.',
              bg: 'bg-orange-50',
              border: 'border-orange-100',
              iconBg: 'bg-white',
            },
            {
              icon: <FiEyeOff className="w-5 h-5 text-orange-500" />,
              title: 'Privacy First',
              desc: 'We never sell your data. Full control over your personal information.',
              bg: 'bg-orange-50',
              border: 'border-orange-100',
              iconBg: 'bg-white',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`${card.bg} rounded-2xl border ${card.border} shadow-sm p-5 md:p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`${card.iconBg} p-3 rounded-xl shadow-sm`}>
                  {card.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion — Privacy Policy & Terms */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Privacy Policy & Security Guidelines
        </h2>
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  expanded === index
                    ? 'border-orange-300 bg-orange-50/40'
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                <button
                  onClick={() => setExpanded(expanded === index ? null : index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FiShield
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${
                        expanded === index ? 'text-orange-500' : 'text-gray-400'
                      }`}
                    />
                    <h3 className="text-sm md:text-base font-semibold text-gray-900">
                      {section.title}
                    </h3>
                  </div>
                  <FiChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      expanded === index ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expanded === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5">
                    <div className="border-t border-orange-100 pt-4">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mb-10">
        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-gray-700">
              Your security is our priority · Last updated: March 2026
            </p>
          </div>
          <a
            href="mailto:privacy@loanhub.com"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            privacy@loanhub.com
          </a>
        </div>
      </div>
    </>
  );
}