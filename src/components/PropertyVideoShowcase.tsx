import React, { useState } from 'react';
import { Video, Play, ExternalLink, Sparkles, Film } from 'lucide-react';
import { PropertyVideo } from '../types/media';
import { PropertyVideoPlayer } from './PropertyVideoPlayer';

interface PropertyVideoShowcaseProps {
  videos: PropertyVideo[];
  propertyTitle: string;
}

export function PropertyVideoShowcase({ videos, propertyTitle }: PropertyVideoShowcaseProps) {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (!videos || videos.length === 0) return null;

  const currentVideo = videos[selectedVideoIndex] || videos[0];

  return (
    <div id="video-tour" className="my-12 p-6 sm:p-8 bg-[#F5F8E8] dark:bg-[#1f2416] rounded-3xl border border-[#9ABA1B]/20 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#9ABA1B] text-white">
              <Film className="w-3.5 h-3.5" /> Video Media Assets
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {videos.length} {videos.length === 1 ? 'Tour Available' : 'Tours Available'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Video Tour & Virtual Walkthrough
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            Explore {propertyTitle} through verified walkthrough and media assets.
          </p>
        </div>

        {/* Video selector pills if multiple videos exist */}
        {videos.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {videos.map((vid, idx) => (
              <button
                key={vid.id || idx}
                onClick={() => setSelectedVideoIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedVideoIndex === idx
                    ? 'bg-[#171717] text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-white/80 dark:bg-black/40 text-gray-700 dark:text-gray-300 hover:bg-white border border-black/5'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{vid.title || `Video ${idx + 1}`}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Video Player */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-black">
        <PropertyVideoPlayer 
          key={currentVideo.id || currentVideo.url} 
          video={currentVideo} 
          autoPlay={false}
        />
      </div>

      {/* Video Details & Playlist Strip if > 1 video */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#171717] dark:text-white">
            {currentVideo.title || 'Property Video Walkthrough'}
          </span>
          <span>•</span>
          <span className="capitalize">{currentVideo.type === 'youtube' ? 'YouTube HD Stream' : 'Raw Video Asset'}</span>
        </div>

        {currentVideo.type === 'youtube' && (
          <a
            href={currentVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-red-600 hover:underline font-semibold"
          >
            Watch on YouTube <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
