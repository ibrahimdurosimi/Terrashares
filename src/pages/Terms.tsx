import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl shadow-sm border border-black/5 dark:border-white/5">
        <h1 className="text-4xl font-black mb-8 text-[#0A0A0A] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
          Terms of Service
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
          <p className="font-bold">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Terrashare ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">2. Investment Risks</h2>
          <p>
            Real estate investments carry inherent risks. Past performance does not guarantee future results. The value of investments can go down as well as up, and you may not get back the original amount invested. You should carefully consider your financial situation and consult with a financial advisor before making any investment decisions.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">3. User Accounts</h2>
          <p>
            To use certain features of the Platform, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must be at least 18 years old to create an account and invest.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">4. Property Shares</h2>
          <p>
            When you invest through Terrashare, you are purchasing fractional ownership in specific properties. These shares are subject to holding periods and may not be immediately liquid. Secondary market trading is subject to platform availability and regulatory requirements.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">5. Platform Fees</h2>
          <p>
            Terrashare charges transparent fees for property management and platform operations. These fees are detailed in the specific property offering documents. We reserve the right to modify our fee structure with appropriate notice to users.
          </p>

          <h2 className="text-2xl font-bold text-[#0A0A0A] dark:text-white mt-8 mb-4">6. Limitation of Liability</h2>
          <p>
            Terrashare and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>
        </div>
      </div>
    </div>
  );
}
