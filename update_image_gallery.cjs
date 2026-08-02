const fs = require('fs');
let content = fs.readFileSync('src/components/ImageGallery.tsx', 'utf8');

content = content.replace("interface ImageGalleryProps {\n  images: string[];\n  title: string;\n}", "interface ImageGalleryProps {\n  images: string[];\n  title: string;\n  badge?: React.ReactNode;\n}");

content = content.replace("export function ImageGallery({ images, title }: ImageGalleryProps) {", "export function ImageGallery({ images, title, badge }: ImageGalleryProps) {");

content = content.replace('<div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm pointer-events-none z-10">\n          <Maximize2 className="w-5 h-5" />\n        </div>', '<div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm pointer-events-none z-10">\n          <Maximize2 className="w-5 h-5" />\n        </div>\n\n        {badge && (\n          <div className="absolute bottom-4 right-4 z-10">\n            {badge}\n          </div>\n        )}');

fs.writeFileSync('src/components/ImageGallery.tsx', content, 'utf8');
