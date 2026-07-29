import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const tabs = [
  { id: 'home', label: 'Home Ownership' },
  { id: 'fractional', label: 'Fractional Ownership' },
  { id: 'land', label: 'Land Ownership' }
];

const stepsData = {
  home: [
    {
      step: 1,
      title: "Browse Curated Properties",
      description: "Take virtual tours and explore a wide range of homes that match your taste, lifestyle, and budget"
    },
    {
      step: 2,
      title: "Fund your wallet",
      description: "Pay flexibly over time through our wallet, making home ownership easier than ever"
    },
    {
      step: 3,
      title: "Buy your Dream",
      description: "Buy your dream home, move in when ready, or enjoy rental income and vacation period"
    }
  ],
  fractional: [
    {
      step: 1,
      title: "Browse Curated Properties",
      description: "Explore curated options in Nigeria, UK, Dubai, and the US"
    },
    {
      step: 2,
      title: "Fund your wallet",
      description: "Top up your Terrashare wallet in NGN, USD, or GBP using multiple payment options"
    },
    {
      step: 3,
      title: "Start Investing",
      description: "Buy fractional shares, earn rental income, and watch your wealth grow"
    }
  ],
  land: [
    {
      step: 1,
      title: "Browse Curated Properties",
      description: "Select from high-growth, government-backed plots with verified titles and strong future value"
    },
    {
      step: 2,
      title: "Fund your wallet",
      description: "Start small with affordable monthly payments from as low as ₦50,000"
    },
    {
      step: 3,
      title: "Buy your Land",
      description: "Lock down your land, hold for appreciation, resell when the value rises, or develop at your pace"
    }
  ]
};

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-32 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-center text-[#0A0A0A] mb-12 font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          How It Works
        </h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded border transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#9B8924] border-[#9B8924] text-white shadow-md' 
                  : 'bg-white border-black/10 text-[#0A0A0A] hover:border-black/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-12"
            >
              {stepsData[activeTab as keyof typeof stepsData].map((step, idx) => (
                <div key={idx} className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#9B8924] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-4">{step.title}</h3>
                  <p className="text-[#0A0A0A]/70 leading-relaxed max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
