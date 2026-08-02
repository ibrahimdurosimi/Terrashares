import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';

const names = ["Adam", "Chioma", "Oluwaseun", "Fatima", "Emeka", "Aisha", "Tunde", "Zainab", "Chinedu", "Blessing"];
const properties = ["Lekki Gardens", "Eko Atlantic Phase 1", "Victoria Island Heights", "Abuja Central Plaza", "Ikoyi Luxury Villas", "Ikeja Tech Hub", "Banana Island View"];
const actions = ["just invested in", "just bought a share of", "started their portfolio with"];

export function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ name: '', property: '', action: '', time: '' });

  useEffect(() => {
    const showToast = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const property = properties[Math.floor(Math.random() * properties.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const time = Math.floor(Math.random() * 15) + 1 + " min ago";
      
      setData({ name, property, action, time });
      setVisible(true);
      
      setTimeout(() => {
        setVisible(false);
      }, 5000); // Hide after 5 seconds
    };

    // Show initial toast after 3 seconds
    const initialTimer = setTimeout(showToast, 3000);
    
    // Then show a new toast every 15-25 seconds
    const interval = setInterval(() => {
      showToast();
    }, Math.floor(Math.random() * 10000) + 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 left-6 z-50 bg-white dark:bg-[#171717] rounded-2xl p-4 shadow-2xl border border-black/[0.05] flex items-center gap-4 max-w-sm"
        >
          <div className="w-10 h-10 rounded-full bg-[#9ABA1B]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#9ABA1B]" />
          </div>
          <div>
            <p className="text-sm text-[#171717] dark:text-white leading-tight">
              <span className="font-bold">{data.name}</span> {data.action} <span className="font-bold text-[#9ABA1B]">{data.property}</span>
            </p>
            <p className="text-xs text-[#171717]/50 dark:text-white/50 mt-1">{data.time}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
