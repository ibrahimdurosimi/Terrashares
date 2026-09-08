export interface PropertyVideo {
  id: string;
  url: string;
  type: 'youtube' | 'file';
  title?: string;
  thumbnail?: string;
}

export type MediaTab = 'all' | 'photos' | 'videos';
