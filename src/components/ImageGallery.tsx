import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2, Video, Image as ImageIcon, Play, Film } from 'lucide-react';
import { PropertyVideo, MediaTab } from '../types/media';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';
import { isDirectVideoUrl, detectVideoType, getYouTubeVideoId, getYouTubeThumbnail } from '../utils/mediaUtils';

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
  thumbnailUrl?: string;
}

export function ImageGallery({ images = [], videos = [], title, badge }: ImageGalleryProps) {
  const [activeTab, setActiveTab] = useState<MediaTab>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Clean images and extract any video URLs that were inadvertently included in images array
  const { cleanImages, allVideos } = React.useMemo(() => {
    const cleanImgs: string[] = [];
    const extractedVids: PropertyVideo[] = [];

    (images || []).forEach((img, idx) => {
      if (typeof img === 'string') {
        const trimmed = img.trim();
        if (isDirectVideoUrl(trimmed) || getYouTubeVideoId(trimmed)) {
          extractedVids.push({
            id: `extracted-${idx}`,
            url: trimmed,
            type: detectVideoType(trimmed),
            title: `Property Video Tour ${idx + 1}`
          });
        } else {
          cleanImgs.push(trimmed);
        }
      }
    });

    // Merge provided videos with extracted videos, deduplicating by URL
    const mergedVideos: PropertyVideo[] = [...(videos || [])];
    const seenUrls = new Set(mergedVideos.map(v => (v.url || '').toLowerCase()));

    extractedVids.forEach(v => {
      if (!seenUrls.has(v.url.toLowerCase())) {
        seenUrls.add(v.url.toLowerCase());
        mergedVideos.push(v);
      }
    });

    return {
      cleanImages: cleanImgs,
      allVideos: mergedVideos,
    };
  }, [images, videos]);

  // Compile media items according to active tab
  const mediaItems: MediaItem[] = React.useMemo(() => {
    const items: MediaItem[] = [];

    if (activeTab === 'all' || activeTab === 'photos') {
      cleanImages.forEach((img, idx) => {
        items.push({
          id: `img-${idx}`,
          type: 'image',
          url: img,
          title: `${title} - Photo ${idx + 1}`,
          thumbnailUrl: img,
        });
      });
    }

    if (activeTab === 'all' || activeTab === 'videos') {
      allVideos.forEach((vid, idx) => {
        const ytId = vid.type === 'youtube' ? getYouTubeVideoId(vid.url) : null;
        const thumb = vid.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : (cleanImages[0] || ''));
        items.push({
          id: vid.id || `vid-${idx}`,
          type: 'video',
          url: vid.url,
          title: vid.title || `Video Tour ${idx + 1}`,
          videoData: vid,
          thumbnailUrl: thumb,
        });
      });
    }

    return items;
  }, [cleanImages, allVideos, activeTab, title]);

  // Reset index when changing tab
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeEl = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

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
    <div className="mb-10">
      {/* Media Type Filter Tabs & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Media Segment Controls */}
        <div className="inline-flex rounded-full bg-black/5 dark:bg-white/10 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#171717] text-[#171717] dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            All Media ({cleanImages.length + allVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'bg-white dark:bg-[#171717] text-[#171717] dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Photos ({cleanImages.length})
          </button>
          {allVideos.length > 0 && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'videos'
                  ? 'bg-red-600 text-white shadow-sm font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Videos ({allVideos.length})
            </button>
          )}
        </div>

        {/* Action button to immediately jump to or watch videos */}
        {allVideos.length > 0 && (
          <div className="flex items-center gap-2">
            {activeTab !== 'videos' ? (
              <button
                onClick={switchToVideoTour}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" /> Watch Video Tour ({allVideos.length})
              </button>
            ) : (
              <a
                href="#video-tour"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors"
              >
                <Film className="w-3 h-3" /> Full Video Showcase ↓
              </a>
            )}
          </div>
        )}
      </div>

      {/* Main Display Stage */}
      <div 
        className="w-full aspect-[16/9] md:aspect-[21/9] bg-black rounded-3xl overflow-hidden relative shadow-md group select-none"
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
              className="w-full h-full object-cover cursor-pointer"
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

        {/* Prev / Next navigation buttons on main display */}
        {mediaItems.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20 shadow-lg hover:scale-105"
              title="Previous media asset"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-20 shadow-lg hover:scale-105"
              title="Next media asset"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Floating Quick Play Badge if viewing image and videos exist */}
        {allVideos.length > 0 && currentItem.type === 'image' && (
          <button
            onClick={switchToVideoTour}
            className="absolute top-4 left-4 z-20 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold backdrop-blur-md shadow-xl transition-all hover:scale-105"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
            </div>
            <span>Watch Video Tour ({allVideos.length})</span>
          </button>
        )}

        {/* Media counter & type tag */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {currentItem.type === 'video' && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Video Tour
            </span>
          )}
          {currentItem.type === 'image' && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all backdrop-blur-sm shadow-md"
              title="Open full screen lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white">
            {currentIndex + 1} / {mediaItems.length}
          </span>
        </div>

        {badge && (
          <div className="absolute bottom-4 right-4 z-20">
            {badge}
          </div>
        )}
      </div>

      {/* Interactive Thumbnail Carousel Strip */}
      {mediaItems.length > 1 && (
        <div className="mt-3 relative">
          <div 
            ref={thumbnailsRef}
            className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
          >
            {mediaItems.map((item, idx) => {
              const isSelected = idx === currentIndex;
              const isVid = item.type === 'video';

              return (
                <button
                  key={item.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden transition-all duration-200 ${
                    isSelected
                      ? 'ring-2 ring-[#9ABA1B] ring-offset-2 dark:ring-offset-black scale-105 shadow-md'
                      : 'opacity-70 hover:opacity-100 hover:scale-102 border border-black/10 dark:border-white/10'
                  }`}
                  title={item.title || `Media ${idx + 1}`}
                >
                  {item.thumbnailUrl ? (
                    <img 
                      src={item.thumbnailUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white/50">
                      {isVid ? <Video className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                  )}

                  {/* Distinct Video Indicator Overlay */}
                  {isVid && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                        <Play className="w-3 h-3 fill-current translate-x-0.5" />
                      </div>
                      <span className="text-[9px] font-bold text-white tracking-wider uppercase mt-0.5 drop-shadow">
                        Video
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
            
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[111] hover:scale-110"
                  title="Previous"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-[111] hover:scale-110"
                  title="Next"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
              <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
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
                      className="max-w-full max-h-[75vh] object-contain drop-shadow-2xl rounded-xl"
                    />
                  ) : (
                    <div key={`lightbox-vid-${currentIndex}`} className="w-full max-w-4xl">
                      <PropertyVideoPlayer 
                        video={currentItem.videoData!} 
                        autoPlay={true} 
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lightbox thumbnail row */}
              {mediaItems.length > 1 && (
                <div 
                  className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-3 px-4 z-[111]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {mediaItems.map((item, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all ${
                        idx === currentIndex
                          ? 'ring-2 ring-white scale-110 opacity-100'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800" />
                      )}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-3 h-3 fill-red-500 text-red-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="absolute top-6 left-6 text-white/80 font-medium text-sm z-[111] flex items-center gap-2">
              <span>{currentIndex + 1} / {mediaItems.length}</span>
              {currentItem.type === 'video' && (
                <span className="px-2 py-0.5 rounded text-xs bg-red-600 text-white font-bold">
                  Video Tour
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


