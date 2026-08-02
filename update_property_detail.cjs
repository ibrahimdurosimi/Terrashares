const fs = require('fs');

let content = fs.readFileSync('src/pages/PropertyDetail.tsx', 'utf8');

if (!content.includes('import { ImageGallery }')) {
  content = content.replace("import { SuccessModal } from '../components/SuccessModal';", "import { SuccessModal } from '../components/SuccessModal';\nimport { ImageGallery } from '../components/ImageGallery';");
}

const oldImageBlock = `{/* 1. Main Image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden relative mb-8 shadow-sm">
          {property.image_urls && property.image_urls.length > 0 ? (
            <img 
              src={property.image_urls[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
          )}
          
          {/* Closed Badge on Image */}
          <div className="absolute bottom-4 right-4 bg-white dark:bg-[#171717] px-6 py-2 rounded-full text-sm font-bold text-gray-700 shadow-md">
            {progressPercent >= 100 ? 'Fully Funded' : 'Funding Open'}
          </div>
        </div>`;

// Wait, the closed badge was inside the image wrapper!
// I'll update ImageGallery to accept a badge prop or I can just render it. Wait, it's easier to modify ImageGallery.tsx to accept an optional badge node. 

fs.writeFileSync('src/pages/PropertyDetail.tsx', content, 'utf8');
