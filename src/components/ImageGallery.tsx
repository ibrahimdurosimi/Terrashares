import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  badge?: React.ReactNode;
}

export function ImageGallery({ images, title, badge }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentIndex]);

  if (!images || images.length === 0) {
    return <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 dark:bg-gray-700 rounded-3xl mb-8"></div>;
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Inline Slider */}
      <div 
        className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden relative mb-8 shadow-sm group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`} 
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm pointer-events-none z-10">
          <Maximize2 className="w-5 h-5" />
        </div>

        {badge && (
          <div className="absolute bottom-4 right-4 z-10">
            {badge}
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[111]"
            >
              <X className="w-6 h-6" />
            </button>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all z-[111]"
                >
                  <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all z-[111]"
                >
                  <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                </button>
              </>
            )}

            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
              <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={`${title} - Gallery Image ${currentIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                  />
                </AnimatePresence>
                
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute top-6 left-6 text-white/70 font-medium tracking-widest text-sm z-[111]">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
