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

  const tabImages: Record<string, string> = {
    home: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    fractional: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
  };

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-32 bg-[#FAF8F5] dark:bg-[#111]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl text-center text-[#0A0A0A] dark:text-white mb-12 font-bold" style={{ fontFamily: 'Georgia, serif' }}>
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
                  : 'bg-white dark:bg-[#0a0a0a] border-black/10 text-[#0A0A0A] dark:text-white hover:border-black/30'
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
                            className="flex flex-col"
            >
              <div className="grid md:grid-cols-3 gap-12 mb-16">
                {stepsData[activeTab as keyof typeof stepsData].map((step, idx) => (
                  <div key={idx} className="text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#9B8924] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-[#9B8924]/20">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-[#0A0A0A] dark:text-white mb-4">{step.title}</h3>
                    <p className="text-[#0A0A0A] dark:text-white/70 leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="w-full h-[300px] md:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
                <img 
                  src={tabImages[activeTab]} 
                  alt={activeTab} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
