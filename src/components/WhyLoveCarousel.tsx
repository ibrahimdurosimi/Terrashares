import { ShieldCheck, CheckCircle2, Users, Percent, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

const advantages = [
  { icon: <ShieldCheck className="text-[#9ABA1B] w-6 h-6" />, title: 'Flexible Options', desc: 'Buy full properties or just a share. Build your portfolio your way.' },
  { icon: <CheckCircle2 className="text-[#9ABA1B] w-6 h-6" />, title: 'Fully Verified & Secure', desc: 'We work with trusted partners and government officials to make sure every deal is safe and legit.' },
  { icon: <Users className="text-[#9ABA1B] w-6 h-6" />, title: 'Built for Everyday Nigerians', desc: 'Whether you’re a student in Enugu or a business owner in Toronto, you can access real estate from anywhere.' },
  { icon: <Percent className="text-[#9ABA1B] w-6 h-6" />, title: 'No Hidden Fees', desc: 'Transparent pricing. No surprises. What you see is what you get.' },
  { icon: <Clock className="text-[#9ABA1B] w-6 h-6" />, title: 'Total Control, 100% Online', desc: 'Use your phone to explore land, homes, and buildings. Invest at your pace, with real-time updates.' }
];

export function WhyLoveCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {advantages.map((adv, idx) => (
          <div 
            key={idx} 
            className="snap-start shrink-0 w-[280px] md:w-[320px] bg-white dark:bg-[#171717] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6">
              {adv.icon}
            </div>
            <h3 className="text-xl text-[#171717] dark:text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>{adv.title}</h3>
            <p className="text-[#171717]/60 dark:text-white/60 leading-relaxed">{adv.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-3 mt-4 pr-4">
        <button 
          onClick={scrollLeft}
          className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#171717] dark:text-white hover:bg-gray-50 dark:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={scrollRight}
          className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-[#171717] dark:text-white hover:bg-gray-50 dark:bg-white/5 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
