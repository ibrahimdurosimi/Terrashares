import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: "I am Nigerian but I don't reside in Nigeria; Can I still invest through Terrashare?",
    answer: "Yes, you can. Terrashare is open to both resident and non-resident Nigerians looking to invest in local real estate."
  },
  {
    question: "How do I know Real Estate Investing is for me?",
    answer: "Real estate is a stable, tangible asset class that historically appreciates over time. It's ideal for investors looking for long-term wealth preservation and steady returns."
  },
  {
    question: "What am I investing in?",
    answer: "You are investing directly into vetted, high-yield commercial and residential real estate projects, earning returns through capital appreciation or rental income."
  },
  {
    question: "Why should I invest through Terrashare?",
    answer: "Terrashare provides fractional ownership and low minimum entry points, allowing you to diversify your portfolio without needing the huge capital typically required for real estate."
  },
  {
    question: "What valid ID is acceptable on the platform?",
    answer: "We accept valid government-issued IDs including International Passport, Driver's License, or National Identity Card (NIN)."
  },
  {
    question: "Is Terrashare safe?",
    answer: "Yes, all our properties are thoroughly vetted and legally secured. We employ strict compliance and security measures to ensure your investment is protected."
  },
  {
    question: "Who can use Terrashare?",
    answer: "Anyone aged 18 and above who meets our KYC requirements can use Terrashare to build their real estate portfolio."
  },
  {
    question: "How long does it take for my investment to mature?",
    answer: "Maturity periods vary depending on the specific property asset. You can view the specific duration (typically 12-24 months) on each property's detail page."
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50 focus:outline-none"
          >
            <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
            <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-90 bg-gray-100' : ''}`}>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </div>
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
