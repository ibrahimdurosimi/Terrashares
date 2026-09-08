import React, { useState, useRef } from 'react';
import { 
  Video, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Play, 
  UploadCloud, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  MoveUp, 
  MoveDown,
  X,
  FileVideo
} from 'lucide-react';
import { PropertyVideo } from '../../types/media';
import { 
  getYouTubeVideoId, 
  getYouTubeThumbnail, 
  detectVideoType 
} from '../../utils/mediaUtils';
import { uploadVideoToCloudinary, getCloudinaryConfig } from '../../lib/cloudinary';
import { PropertyVideoPlayer } from '../PropertyVideoPlayer';

interface PropertyVideoManagerProps {
  videos: PropertyVideo[];
  onChange: (videos: PropertyVideo[]) => void;
}

export function PropertyVideoManager({ videos, onChange }: PropertyVideoManagerProps) {
  const [activeInputType, setActiveInputType] = useState<'youtube' | 'url' | 'upload'>('youtube');
  
  // YouTube / URL Form states
  const [inputUrl, setInputUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview modal state
  const [previewVideo, setPreviewVideo] = useState<PropertyVideo | null>(null);

  // YouTube live detection
  const detectedYouTubeId = inputUrl ? getYouTubeVideoId(inputUrl) : null;
  const detectedThumbnail = detectedYouTubeId ? getYouTubeThumbnail(detectedYouTubeId) : '';

  const handleAddVideo = () => {
    setInputError(null);
    const trimmedUrl = inputUrl.trim();

    if (!trimmedUrl) {
      setInputError('Please enter a valid video link or URL.');
      return;
    }

    const type = detectVideoType(trimmedUrl);

    if (activeInputType === 'youtube' && type !== 'youtube') {
      setInputError('The URL entered does not appear to be a valid YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).');
      return;
    }

    const newVideo: PropertyVideo = {
      id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      url: trimmedUrl,
      type,
      title: videoTitle.trim() || (type === 'youtube' ? 'YouTube Video Tour' : 'Property Video Asset'),
      thumbnail: type === 'youtube' && detectedYouTubeId ? detectedThumbnail : undefined,
    };

    onChange([...videos, newVideo]);
    setInputUrl('');
    setVideoTitle('');
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);

    // Validate video file
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v|ogg)$/i)) {
      setUploadError('Please select a valid video file (.mp4, .webm, .mov).');
      return;
    }

    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      setUploadError('Cloudinary is not configured. Please enter your Cloud Name and Upload Preset in the Image Settings first, or use a direct video URL/YouTube link.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgressText(`Uploading ${file.name}...`);
      const secureUrl = await uploadVideoToCloudinary(file);

      const newVideo: PropertyVideo = {
        id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        url: secureUrl,
        type: 'file',
        title: videoTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
      };

      onChange([...videos, newVideo]);
      setVideoTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Error uploading video:', err);
      setUploadError(err.message || 'Failed to upload video file.');
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...videos];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === videos.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...videos];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleTitleChange = (index: number, newTitle: string) => {
    const updated = [...videos];
    updated[index] = { ...updated[index], title: newTitle };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-bold text-[#171717]">
            Video Media Assets
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Attach YouTube walkthroughs or raw video files (.mp4, .webm, .mov)
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
          {videos.length} {videos.length === 1 ? 'Video' : 'Videos'} Added
        </span>
      </div>

      {/* Input Selector Tabs */}
      <div className="flex rounded-xl bg-[#171717]/5 p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => { setActiveInputType('youtube'); setInputError(null); }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeInputType === 'youtube'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-[#171717]'
          }`}
        >
          <Video className="w-3.5 h-3.5" /> YouTube Link
        </button>
        <button
          type="button"
          onClick={() => { setActiveInputType('url'); setInputError(null); }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeInputType === 'url'
              ? 'bg-white text-[#171717] shadow-sm'
              : 'text-gray-600 hover:text-[#171717]'
          }`}
        >
          <FileVideo className="w-3.5 h-3.5" /> Raw Video URL (.mp4)
        </button>
        <button
          type="button"
          onClick={() => { setActiveInputType('upload'); setInputError(null); }}
          className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeInputType === 'upload'
              ? 'bg-white text-[#9ABA1B] shadow-sm'
              : 'text-gray-600 hover:text-[#171717]'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" /> Upload File
        </button>
      </div>

      {/* Input Form based on mode */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
        {activeInputType === 'youtube' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              YouTube Video URL
            </label>
            <input
              type="url"
              placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setInputError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
            />
            {detectedYouTubeId && (
              <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-red-100 flex items-center gap-3">
                <img 
                  src={detectedThumbnail} 
                  alt="YouTube thumbnail preview" 
                  className="w-20 h-12 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    YouTube Video Detected
                  </span>
                  <p className="text-xs text-gray-500 truncate mt-0.5">ID: {detectedYouTubeId}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeInputType === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Direct Video File URL (.mp4, .webm, .mov)
            </label>
            <input
              type="url"
              placeholder="e.g. https://res.cloudinary.com/.../video.mp4 or https://mysite.com/tour.mp4"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setInputError(null);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#9ABA1B] focus:outline-none transition-all"
            />
          </div>
        )}

        {activeInputType === 'upload' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Upload Raw Video File (.mp4, .webm, .mov)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-gray-300 hover:border-[#9ABA1B] rounded-xl p-5 text-center cursor-pointer transition-colors bg-white ${
                isUploading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#9ABA1B] mb-2" />
                  <p className="text-xs font-semibold text-gray-700">{uploadProgressText}</p>
                  <p className="text-[11px] text-gray-400 mt-1">Please wait while the video uploads...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-1.5" />
                  <p className="text-xs font-semibold text-gray-700">Click to browse and upload video</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">MP4, WebM, MOV supported (up to 100MB)</p>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {uploadError}
              </p>
            )}
          </div>
        )}

        {/* Video Title Input for URL / YouTube modes */}
        {activeInputType !== 'upload' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Video Title / Caption (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Walkthrough Tour, Drone Aerial View"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#9ABA1B] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-4 py-2 bg-[#171717] hover:bg-black text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Video
              </button>
            </div>
          </div>
        )}

        {inputError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {inputError}
          </p>
        )}
      </div>

      {/* List of Configured Videos */}
      {videos.length > 0 ? (
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-gray-600">Attached Videos:</p>
          <div className="space-y-2">
            {videos.map((vid, idx) => (
              <div 
                key={vid.id || idx}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors"
              >
                {/* Thumbnail or Icon */}
                <div 
                  className="w-16 h-11 rounded-lg bg-gray-900 overflow-hidden relative shrink-0 cursor-pointer group"
                  onClick={() => setPreviewVideo(vid)}
                  title="Click to preview video"
                >
                  {vid.thumbnail ? (
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/50">
                      <Video className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>

                {/* Title and details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={vid.title || ''}
                      onChange={(e) => handleTitleChange(idx, e.target.value)}
                      placeholder="Enter video title"
                      className="text-xs font-semibold text-gray-900 bg-transparent hover:bg-gray-50 focus:bg-white px-1.5 py-0.5 rounded border border-transparent focus:border-gray-300 focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 px-1.5">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      vid.type === 'youtube' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {vid.type === 'youtube' ? 'YouTube' : 'Video File'}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate max-w-[240px]">
                      {vid.url}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100 transition-colors"
                    title="Move up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === videos.length - 1}
                    className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded hover:bg-gray-100 transition-colors"
                    title="Move down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewVideo(vid)}
                    className="p-1.5 text-gray-500 hover:text-[#9ABA1B] rounded hover:bg-gray-100 transition-colors"
                    title="Preview video"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    title="Delete video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
          No video media assets added yet. Add a YouTube link or video file above.
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-3xl overflow-hidden max-w-3xl w-full border border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <Video className="w-4 h-4 text-[#9ABA1B]" />
                <h3 className="font-bold text-sm truncate">{previewVideo.title || 'Video Preview'}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <PropertyVideoPlayer video={previewVideo} autoPlay={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
