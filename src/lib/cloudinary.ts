/**
 * Cloudinary Upload and URL Transformation Utilities
 */

const STORAGE_KEY_CLOUD_NAME = 'terrashare_cloudinary_cloud_name';
const STORAGE_KEY_UPLOAD_PRESET = 'terrashare_cloudinary_upload_preset';

export function getCloudinaryConfig(): { cloudName: string; uploadPreset: string } {
  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

  const localCloudName = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_CLOUD_NAME) || '' : '';
  const localUploadPreset = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_UPLOAD_PRESET) || '' : '';

  return {
    cloudName: localCloudName || envCloudName,
    uploadPreset: localUploadPreset || envUploadPreset,
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_CLOUD_NAME, cloudName.trim());
    localStorage.setItem(STORAGE_KEY_UPLOAD_PRESET, uploadPreset.trim());
  }
}

/**
 * Optimizes a Cloudinary image URL by injecting dynamic compression and auto-formatting (f_auto, q_auto)
 */
export function optimizeCloudinaryUrl(url: string, width?: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Insert transformations after /upload/
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const transformations = ['f_auto', 'q_auto'];
  if (width) transformations.push(`w_${width}`);

  const transformString = transformations.join(',');

  // Check if transformation is already present
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url;
  }

  const prefix = url.substring(0, uploadIndex + 8);
  const rest = url.substring(uploadIndex + 8);

  return `${prefix}${transformString}/${rest}`;
}

export interface UploadProgressCallback {
  (fileIndex: number, progressPercent: number): void;
}

/**
 * Uploads a single file to Cloudinary
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'terrashare/properties'
): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing. Please provide your Cloud Name and Unsigned Upload Preset.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData.error?.message ||
      `Upload failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMsg);
  }

  const result = await response.json();
  const rawUrl = result.secure_url || result.url;
  return optimizeCloudinaryUrl(rawUrl);
}

/**
 * Uploads a video file to Cloudinary
 */
export async function uploadVideoToCloudinary(
  file: File,
  folder = 'terrashare/properties/videos'
): Promise<string> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing. Please provide your Cloud Name and Unsigned Upload Preset in Settings.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg =
      errorData.error?.message ||
      `Video upload failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMsg);
  }

  const result = await response.json();
  return result.secure_url || result.url;
}
