import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  Loader2, 
  Settings, 
  Plus, 
  Link as LinkIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { 
  getCloudinaryConfig, 
  saveCloudinaryConfig, 
  uploadToCloudinary 
} from '../lib/cloudinary';

interface ImageUploadDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
}

export function ImageUploadDropzone({
  images,
  onChange,
  folder = 'terrashare/properties'
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ id: string; name: string; progress: string; error?: string }[]>([]);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Cloudinary settings state
  const [cloudName, setCloudName] = useState('');
  const [uploadPreset, setUploadPreset] = useState('');
  const [configSaved, setConfigSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const config = getCloudinaryConfig();
    setCloudName(config.cloudName);
    setUploadPreset(config.uploadPreset);
  }, [showConfigModal]);

  const hasConfig = Boolean(cloudName && uploadPreset);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      // Reset input value so same files can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setGlobalError(`"${file.name}" is not a valid image file.`);
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        setGlobalError(`"${file.name}" exceeds the 20MB Cloudinary limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Check Cloudinary configuration
    const currentConfig = getCloudinaryConfig();
    if (!currentConfig.cloudName || !currentConfig.uploadPreset) {
      setShowConfigModal(true);
      setGlobalError('Please configure your Cloudinary credentials before uploading images.');
      return;
    }

    setGlobalError(null);
    setIsUploading(true);

    const initialQueue = validFiles.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      progress: 'Uploading...'
    }));
    setUploadQueue(initialQueue);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const queueId = initialQueue[i].id;

      try {
        setUploadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 'Uploading to Cloudinary...' } : item));
        
        const url = await uploadToCloudinary(file, folder);
        uploadedUrls.push(url);

        setUploadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 'Completed' } : item));
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 'Failed', error: err.message } : item));
      }
    }

    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }

    setIsUploading(false);
    // Clear completed queue after 3 seconds
    setTimeout(() => {
      setUploadQueue(prev => prev.filter(item => item.progress !== 'Completed'));
    }, 3000);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, idx) => idx !== indexToRemove);
    onChange(newImages);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, idx) => idx !== index);
    onChange([selected, ...remaining]);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    onChange(newImages);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    
    const urlsToAdd = manualUrl.split(',').map(u => u.trim()).filter(Boolean);
    onChange([...images, ...urlsToAdd]);
    setManualUrl('');
    setShowManualInput(false);
  };

  const handleSaveConfig = () => {
    if (!cloudName.trim() || !uploadPreset.trim()) {
      setGlobalError('Please fill in both Cloud Name and Upload Preset.');
      return;
    }
    saveCloudinaryConfig(cloudName, uploadPreset);
    setConfigSaved(true);
    setTimeout(() => {
      setConfigSaved(false);
      setShowConfigModal(false);
      setGlobalError(null);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-bold text-[#171717] dark:text-white">
            Property Images ({images.length})
          </label>
          <span className="text-xs text-gray-500">
            • First image is Cover Photo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-black/10 dark:border-white/10 text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Add via URL"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {showManualInput ? 'Hide URL Input' : 'Add via URL'}
          </button>

          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              hasConfig 
                ? 'border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-black/5' 
                : 'border-amber-300 bg-amber-50 text-amber-900 animate-pulse'
            }`}
            title="Cloudinary Configuration"
          >
            <Settings className="w-3.5 h-3.5" />
            {hasConfig ? 'Cloudinary Settings' : 'Setup Cloudinary'}
          </button>
        </div>
      </div>

      {/* Manual URL Input dropdown */}
      {showManualInput && (
        <div className="p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/5 dark:border-white/10 flex gap-2 items-center animate-fade-in">
          <input
            type="text"
            placeholder="Paste image URL(s) separated by commas..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9ABA1B]"
          />
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-4 py-2 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shrink-0"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Global Error Banner */}
      {globalError && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{globalError}</span>
          </div>
          <button type="button" onClick={() => setGlobalError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
          isDragging 
            ? 'border-[#9ABA1B] bg-[#9ABA1B]/10 scale-[1.01]' 
            : 'border-black/10 dark:border-white/10 bg-white/60 dark:bg-[#1a1a1a]/60 hover:border-[#9ABA1B]/50 hover:bg-white dark:hover:bg-[#1a1a1a]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#9ABA1B]/10 text-[#9ABA1B] flex items-center justify-center mb-1">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#9ABA1B]" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-bold text-[#171717] dark:text-white">
              {isUploading ? 'Uploading to Cloudinary...' : 'Click to browse or drag & drop property photos'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, WebP up to 20MB each. High-speed global CDN delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Queue Progress */}
      {uploadQueue.length > 0 && (
        <div className="space-y-1.5 p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-black/5 dark:border-white/10">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300">Upload Status</p>
          {uploadQueue.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-black/5 dark:border-white/5 last:border-0">
              <span className="truncate max-w-[200px] text-gray-700 dark:text-gray-300">{item.name}</span>
              <div className="flex items-center gap-1.5">
                {item.progress === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                {item.progress === 'Failed' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                {item.progress !== 'Completed' && item.progress !== 'Failed' && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#9ABA1B]" />}
                <span className={item.progress === 'Failed' ? 'text-red-500 font-medium' : 'text-gray-500'}>
                  {item.error || item.progress}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((url, index) => {
            const isCover = index === 0;
            return (
              <div
                key={`${url}-${index}`}
                className={`group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 dark:bg-gray-800 border-2 transition-all shadow-sm ${
                  isCover ? 'border-[#9ABA1B] ring-2 ring-[#9ABA1B]/20' : 'border-transparent hover:border-black/20'
                }`}
              >
                <img
                  src={url}
                  alt={`Property photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Cover Badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-[#9ABA1B] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 fill-current" /> Cover Photo
                  </div>
                )}

                {/* Hover Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => setAsCover(index)}
                        className="px-2 py-1 bg-white/90 hover:bg-white text-[#171717] rounded text-[10px] font-bold shadow transition-colors flex items-center gap-1"
                        title="Set as Primary Cover Photo"
                      >
                        <Star className="w-3 h-3" /> Make Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition-colors ml-auto"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ordering arrows */}
                  <div className="flex items-center justify-center gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'left')}
                        className="p-1.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow transition-colors"
                        title="Move left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'right')}
                        className="p-1.5 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow transition-colors"
                        title="Move right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cloudinary Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[2rem] border border-black/10 dark:border-white/10 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#9ABA1B]/10 text-[#9ABA1B] flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#171717] dark:text-white">
                  Cloudinary Upload Settings
                </h3>
                <p className="text-xs text-gray-500">
                  Connect your Cloudinary account for direct browser uploads.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1">
                  Cloud Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dxyz1234"
                  value={cloudName}
                  onChange={(e) => setCloudName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveConfig(); }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9ABA1B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1">
                  Unsigned Upload Preset
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. terrashare_preset"
                  value={uploadPreset}
                  onChange={(e) => setUploadPreset(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveConfig(); }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9ABA1B]"
                />
              </div>

              {/* Quick instructions */}
              <div className="p-3.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 text-[11px] text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-bold text-[#171717] dark:text-white">How to get these in 1 minute:</p>
                <ol className="list-decimal list-inside space-y-0.5 leading-relaxed">
                  <li>Log in to your free account at <strong className="text-[#9ABA1B]">cloudinary.com</strong>.</li>
                  <li>Copy your <strong>Cloud Name</strong> from the Dashboard.</li>
                  <li>Go to <strong>Settings</strong> &rarr; <strong>Upload Presets</strong> &rarr; <strong>Add Upload Preset</strong>.</li>
                  <li>Set <strong>Signing Mode</strong> to <strong className="underline">Unsigned</strong>, and click <strong>Save</strong>.</li>
                </ol>
              </div>

              {configSaved && (
                <div className="p-2.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Settings saved successfully!</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold text-xs hover:bg-gray-800 transition-colors shadow-md"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
