import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const words = ["property", "real estate", "lands", "apartments", "houses", "malls"];

export function AnimatedHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative min-w-[200px] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0, position: 'absolute' }}
          animate={{ y: 0, opacity: 1, position: 'relative' }}
          exit={{ y: -20, opacity: 0, position: 'absolute' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-[#9ABA1B] italic inline-block w-full"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {words[index]},
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
