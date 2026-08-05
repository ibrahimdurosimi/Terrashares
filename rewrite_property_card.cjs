const fs = require('fs');

const content = `import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '../types/database';
type Property = Database['public']['Tables']['properties']['Row'];
import { Scale, Check, MapPin } from 'lucide-react';

interface PropertyCardProps {
  key?: React.Key | string | number;
  property: Property;
  onCompareToggle?: (property: Property) => void;
  isCompared?: boolean;
}

export function PropertyCard({ property, onCompareToggle, isCompared }: PropertyCardProps) {
  return (
    <div className="bg-white dark:bg-[#171717] rounded-2xl md:rounded-[2rem] p-3 sm:p-5 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col h-full hover:shadow-lg transition-shadow relative overflow-hidden group">
      
      {/* Compare Button */}
      {onCompareToggle && (
        <button
          onClick={(e) => { e.preventDefault(); onCompareToggle(property); }}
          className={\`absolute top-4 right-4 z-20 p-2 rounded-full border transition-colors shadow-sm \${
            isCompared 
               ? 'bg-[#171717] border-[#171717] text-white' 
               : 'bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:text-black dark:bg-[#171717]/90 dark:border-gray-700 dark:text-gray-300'
          }\`}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
        >
          {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
        </button>
      )}

      {/* Image Header */}
      <div className="w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4 relative">
        {property.image_urls && property.image_urls.length > 0 ? (
          <img 
            src={property.image_urls[0]} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs">No image</div>
        )}
        
        {/* Status Badge */}
        <div className={\`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold \${
          property.status === 'open' 
            ? 'bg-[#9ABA1B] text-white shadow-sm' 
            : 'bg-gray-800 text-white shadow-sm'
        }\`}>
          {property.status === 'open' ? 'Active' : 'Closed'}
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Title & Location */}
        <div className="mb-3">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 leading-tight mb-1 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-1">
            <MapPin className="w-3 h-3 text-[#9ABA1B] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 mt-auto pt-3 border-t border-black/5 dark:border-white/5">
          <div>
            <p className="text-[10px] md:text-xs text-gray-400 mb-0.5">Min. Inv.</p>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm">₦{property.min_investment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-gray-400 mb-0.5">Returns</p>
            <p className="font-bold text-[#9ABA1B] text-xs sm:text-sm">{property.returns_percent}%</p>
          </div>
        </div>

        {/* Button */}
        <Link
          to={\`/properties/\${property.slug}\`}
          className="w-full py-2.5 md:py-3.5 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl font-bold text-xs sm:text-sm text-center hover:bg-gray-800 transition-colors inline-block"
        >
          View
        </Link>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/PropertyCard.tsx', content);
