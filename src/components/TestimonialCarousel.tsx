import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const TESTIMONIALS = [
  {
    quote: "Terrashares completely changed how I look at commercial real estate. The transparency and low barrier to entry allowed me to diversify my portfolio securely.",
    author: "Sarah Jenkins",
    role: "Private Investor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The monthly payouts have been incredibly consistent. I appreciate the detailed valuation updates that give me confidence in the asset's performance.",
    author: "Michael Chen",
    role: "Fractional Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "A modern, straightforward platform. The property vetting process is rigorous, which makes all the difference when putting your money to work.",
    author: "David Alston",
    role: "Portfolio Manager",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
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

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="relative rounded-[3rem] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 px-6 py-20 md:py-32 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 text-center border border-white/10">
          <p className="text-xl md:text-3xl font-medium text-white leading-relaxed mb-10 transition-opacity duration-500">
            "{TESTIMONIALS[currentIndex].quote}"
          </p>
          
          <div className="flex flex-col items-center">
            <img 
              src={TESTIMONIALS[currentIndex].avatar} 
              alt={TESTIMONIALS[currentIndex].author} 
              className="w-16 h-16 rounded-full border-2 border-[#9B8924] mb-4 object-cover"
            />
            <h4 className="font-bold text-white text-lg">{TESTIMONIALS[currentIndex].author}</h4>
            <p className="text-white/60 text-sm uppercase tracking-wider">{TESTIMONIALS[currentIndex].role}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-12">
          <button 
            onClick={prev}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? 'bg-[#9B8924] w-8' : 'bg-white/30 hover:bg-white/60'
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={next}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
