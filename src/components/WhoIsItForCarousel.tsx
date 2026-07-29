import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Home, Globe, Briefcase, Users, Heart } from 'lucide-react';

const items = [
  {
    text: "First-time buyers looking for a safe place to start",
    icon: <Home className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Diaspora Nigerians ready to invest back home",
    icon: <Globe className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Entrepreneurs growing a property portfolio",
    icon: <Briefcase className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Families buying their forever home",
    icon: <Users className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Everyday people tired of waiting for \"someday\"",
    icon: <Heart className="w-8 h-8 text-[#9B8924]" />
  }
];

export function WhoIsItForCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + items.length) % items.length);
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto h-[300px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full px-12"
        >
          <div className="bg-white border border-black/5 shadow-2xl p-10 md:p-16 rounded-[2rem] flex flex-col items-center text-center gap-6 transform transition-transform hover:scale-[1.02]">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-[#9B8924]/10 rounded-full flex items-center justify-center mb-2"
            >
              {items[currentIndex].icon}
            </motion.div>
            <p className="font-black text-[#0A0A0A] text-2xl md:text-3xl leading-tight max-w-2xl">
              {items[currentIndex].text}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-black/5 flex items-center justify-center text-[#0A0A0A] hover:bg-gray-50 z-10 transition-transform hover:scale-110 focus:outline-none"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border border-black/5 flex items-center justify-center text-[#0A0A0A] hover:bg-gray-50 z-10 transition-transform hover:scale-110 focus:outline-none"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex ? "bg-[#9B8924] w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
