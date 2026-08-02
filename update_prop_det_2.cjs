const fs = require('fs');

let content = fs.readFileSync('src/pages/PropertyDetail.tsx', 'utf8');

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
            {property.status === 'closed' ? 'Closed' : 'Active'}
          </div>
        </div>`;

const newImageBlock = `{/* 1. Main Image */}
        <ImageGallery 
          images={property.image_urls || []} 
          title={property.title}
          badge={
            <div className="bg-white dark:bg-[#171717] px-6 py-2 rounded-full text-sm font-bold text-[#171717] dark:text-white shadow-md">
              {property.status === 'closed' ? 'Closed' : 'Active'}
            </div>
          }
        />`;

content = content.replace(oldImageBlock, newImageBlock);

fs.writeFileSync('src/pages/PropertyDetail.tsx', content, 'utf8');
