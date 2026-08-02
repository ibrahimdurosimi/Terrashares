import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionButton?: React.ReactNode;
}

export function SuccessModal({ isOpen, onClose, title, message, actionButton }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              className="bg-white dark:bg-[#171717] w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative pointer-events-auto border border-black/5 dark:border-white/10 text-center"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex justify-center relative">
                {/* Celebratory background elements */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="absolute inset-0 bg-[#9ABA1B]/20 rounded-full blur-xl"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="relative w-24 h-24 bg-gradient-to-tr from-[#9ABA1B] to-[#F2E6B6] rounded-full flex items-center justify-center shadow-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                </motion.div>
                
                {/* Confetti particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: 0,
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200 - 50,
                      scale: Math.random() * 0.5 + 0.5,
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                    className={`absolute w-3 h-3 rounded-sm ${i % 2 === 0 ? 'bg-[#9ABA1B]' : 'bg-[#F2E6B6]'} top-1/2 left-1/2 -ml-1.5 -mt-1.5`}
                  />
                ))}
              </div>

              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-black text-[#171717] dark:text-white mb-4" 
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {title}
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
              >
                {message}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {actionButton}
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
