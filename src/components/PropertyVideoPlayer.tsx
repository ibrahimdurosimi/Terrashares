import React, { useState } from 'react';
import { Play, Video, ExternalLink, AlertCircle, Volume2 } from 'lucide-react';
import { PropertyVideo } from '../types/media';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/mediaUtils';

interface PropertyVideoPlayerProps {
  video: PropertyVideo;
  autoPlay?: boolean;
  className?: string;
  poster?: string;
}

export function PropertyVideoPlayer({
  video,
  autoPlay = false,
  className = '',
  poster,
}: PropertyVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);

  const isYouTube = video.type === 'youtube';
  const effectivePoster = poster || video.thumbnail || (isYouTube ? getYouTubeThumbnail(video.url) : '');

  if (hasError) {
    return (
      <div className={`w-full aspect-[16/9] bg-gray-900 text-white flex flex-col items-center justify-center p-6 rounded-2xl text-center ${className}`}>
        <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
        <p className="font-semibold text-sm">Unable to load video</p>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">The video source may be restricted or unavailable.</p>
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
        >
          Open Link Directly <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  // YouTube Embed
  if (isYouTube) {
    if (!isPlaying) {
      return (
        <div 
          className={`relative w-full aspect-[16/9] bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shadow-lg ${className}`}
          onClick={() => setIsPlaying(true)}
        >
          {effectivePoster ? (
            <img 
              src={effectivePoster} 
              alt={video.title || 'Video preview'} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-gray-800 flex items-center justify-center">
              <Video className="w-16 h-16 text-white/30" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
            </div>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600/90 backdrop-blur-md text-white shadow-sm flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> YouTube
            </span>
          </div>

          {video.title && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl text-white">
              <p className="font-semibold text-sm truncate">{video.title}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`relative w-full aspect-[16/9] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl ${className}`}>
        <iframe
          src={getYouTubeEmbedUrl(video.url, true)}
          title={video.title || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Raw Video File (.mp4, .webm, .mov, etc.)
  return (
    <div className={`relative w-full aspect-[16/9] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group ${className}`}>
      <video
        src={video.url}
        controls
        playsInline
        autoPlay={autoPlay}
        poster={effectivePoster}
        className="w-full h-full object-contain bg-black"
        onError={() => setHasError(true)}
      >
        Your browser does not support HTML5 video playback.
      </video>

      <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#171717]/80 backdrop-blur-md text-white shadow-sm flex items-center gap-1.5 border border-white/10">
          <Video className="w-3.5 h-3.5 text-[#9ABA1B]" /> Video File
        </span>
      </div>
    </div>
  );
}
