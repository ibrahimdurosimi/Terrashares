import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2, Video, Image as ImageIcon, Play } from 'lucide-react';
import { PropertyVideo, MediaTab } from '../types/media';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';

interface ImageGalleryProps {
  images: string[];
  videos?: PropertyVideo[];
  title: string;
  badge?: React.ReactNode;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title?: string;
  videoData?: PropertyVideo;
}

export function ImageGallery({ images = [], videos = [], title, badge }: ImageGalleryProps) {
  const [activeTab, setActiveTab] = useState<MediaTab>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Compile media items according to active tab
  const mediaItems: MediaItem[] = React.useMemo(() => {
    const items: MediaItem[] = [];

    if (activeTab === 'all' || activeTab === 'photos') {
      images.forEach((img, idx) => {
        items.push({
          id: `img-${idx}`,
          type: 'image',
          url: img,
          title: `${title} - Photo ${idx + 1}`,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'videos') {
      videos.forEach((vid, idx) => {
        items.push({
          id: vid.id || `vid-${idx}`,
          type: 'video',
          url: vid.url,
          title: vid.title || `Video Tour ${idx + 1}`,
          videoData: vid,
        });
      });
    }

    return items;
  }, [images, videos, activeTab, title]);

  // Adjust current index if out of bounds on tab switch
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

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
  }, [isLightboxOpen, currentIndex, mediaItems.length]);

  if (mediaItems.length === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 dark:bg-gray-700 rounded-3xl mb-8 flex items-center justify-center text-gray-400">
        No media assets available
      </div>
    );
  }

  const currentItem = mediaItems[currentIndex] || mediaItems[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const switchToVideoTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('videos');
    setCurrentIndex(0);
  };

  return (
    <div className="mb-8">
      {/* Media Type Filter Tabs (Shown if videos exist) */}
      {videos.length > 0 && (
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="inline-flex rounded-full bg-black/5 dark:bg-white/10 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#171717] text-[#171717] dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              All ({images.length + videos.length})
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'photos'
                  ? 'bg-white dark:bg-[#171717] text-[#171717] dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Photos ({images.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'videos'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Videos ({videos.length})
            </button>
          </div>

          {activeTab !== 'videos' && (
            <button
              onClick={switchToVideoTour}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Play className="w-3 h-3 fill-current" /> Watch Video Tour
            </button>
          )}
        </div>
      )}

      {/* Inline Showcase */}
      <div 
        className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-900 rounded-3xl overflow-hidden relative shadow-sm group cursor-pointer"
        onClick={() => {
          if (currentItem.type === 'image') {
            setIsLightboxOpen(true);
          }
        }}
      >
        <AnimatePresence mode="wait">
          {currentItem.type === 'image' ? (
            <motion.img
              key={`img-${currentIndex}`}
              src={currentItem.url}
              alt={currentItem.title || `${title} - Image ${currentIndex + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              key={`vid-${currentIndex}`} 
              className="w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <PropertyVideoPlayer 
                video={currentItem.videoData!} 
                autoPlay={false} 
                className="w-full h-full rounded-none"
              />
            </div>
          )}
        </AnimatePresence>

        {/* Prev / Next buttons */}
        {mediaItems.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20"
              title="Previous item"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20"
              title="Next item"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md">
              {mediaItems.map((item, idx) => (
                <button
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`transition-all rounded-full ${
                    idx === currentIndex 
                      ? 'bg-white w-4 h-2' 
                      : item.type === 'video'
                        ? 'bg-red-400/80 w-2 h-2 hover:bg-white'
                        : 'bg-white/50 w-2 h-2 hover:bg-white'
                  }`}
                  title={item.title || `Item ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Fullscreen icon for images */}
        {currentItem.type === 'image' && (
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm pointer-events-none z-20">
            <Maximize2 className="w-5 h-5" />
          </div>
        )}

        {/* Video tour floating badge on first item if videos exist */}
        {videos.length > 0 && currentItem.type === 'image' && (
          <button
            onClick={switchToVideoTour}
            className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold backdrop-blur-md shadow-lg transition-transform hover:scale-105"
          >
            <Play className="w-3 h-3 fill-current" /> Video Tour ({videos.length})
          </button>
        )}

        {badge && (
          <div className="absolute bottom-4 right-4 z-20">
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
            
            {mediaItems.length > 1 && (
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
                  {currentItem.type === 'image' ? (
                    <motion.img
                      key={`lightbox-img-${currentIndex}`}
                      src={currentItem.url}
                      alt={currentItem.title || `${title} - Gallery Image ${currentIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                    />
                  ) : (
                    <div key={`lightbox-vid-${currentIndex}`} className="max-w-4xl w-full">
                      <PropertyVideoPlayer 
                        video={currentItem.videoData!} 
                        autoPlay={true} 
                      />
                    </div>
                  )}
                </AnimatePresence>
                
                {mediaItems.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md">
                    {mediaItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all rounded-full ${
                          idx === currentIndex 
                            ? 'bg-white scale-125 w-2.5 h-2.5' 
                            : item.type === 'video'
                              ? 'bg-red-400 w-2.5 h-2.5'
                              : 'bg-white/40 hover:bg-white/60 w-2.5 h-2.5'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute top-6 left-6 text-white/70 font-medium tracking-widest text-sm z-[111]">
              {currentIndex + 1} / {mediaItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

