import React from 'react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl shadow-sm border border-black/5 dark:border-white/5">
        <h1 className="text-4xl font-black mb-8 text-[#0A0A0A] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
          Privacy Policy
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p className="font-bold">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            At Terrashare, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, phone number, and location that you voluntarily give to us when you register.</li>
            <li><strong>Financial Data:</strong> Information related to your payment method and investment history.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, browser type, and operating system.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage your account.</li>
            <li>Process your investments and payouts.</li>
            <li>Send you administrative information and email communications.</li>
            <li>Protect our services against fraudulent activities.</li>
            <li>Comply with regulatory requirements (KYC/AML).</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with third-party vendors, service providers, and contractors who perform services for us (such as payment processing, data analysis, and email delivery).
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">4. Data Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at privacy@terrashare.com.
          </p>
        </div>
      </div>
    </div>
  );
}
