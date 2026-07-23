import { useState, useEffect } from 'react';

const TESTIMONIALS = [
  {
    quote: "Terrashares completely changed how I look at commercial real estate. The transparency and low barrier to entry allowed me to diversify my portfolio securely.",
    author: "Sarah Jenkins",
    role: "Private Investor",
  },
  {
    quote: "The monthly payouts have been incredibly consistent. I appreciate the detailed valuation updates that give me confidence in the asset's performance.",
    author: "Michael Chen",
    role: "Fractional Owner",
  },
  {
    quote: "A modern, straightforward platform. The property vetting process is rigorous, which makes all the difference when putting your money to work.",
    author: "David Alston",
    role: "Portfolio Manager",
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0A0A0A] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden text-center">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#9B8924] rounded-full blur-[100px] opacity-20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#F7D0BC] mb-12">What our investors say</h2>
        
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="text-2xl md:text-4xl font-medium text-white leading-tight transition-opacity duration-500">
            "{TESTIMONIALS[currentIndex].quote}"
          </p>
        </div>
        
        <div className="mt-12 flex flex-col items-center">
          <p className="font-bold text-lg text-white">{TESTIMONIALS[currentIndex].author}</p>
          <p className="text-gray-400">{TESTIMONIALS[currentIndex].role}</p>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#F7D0BC] w-8' : 'bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
