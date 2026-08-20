const fs = require('fs');

const content = `import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '../types/database';
type Property = Database['public']['Tables']['properties']['Row'];
import { Scale, Check, MapPin, Building, Key } from 'lucide-react';

interface PropertyCardProps {
  key?: React.Key | string | number;
  property: Property;
  onCompareToggle?: (property: Property) => void;
  isCompared?: boolean;
}

export function PropertyCard({ property, onCompareToggle, isCompared }: PropertyCardProps) {
  const isBeechwoodOutright = property.slug === '4-bed-detached-beechwood';
  const isSoldOut = property.status === 'closed';

  return (
    <div className="bg-white dark:bg-[#171717] rounded-3xl md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-black/[0.03] dark:border-white/5 flex flex-col h-full hover:shadow-2xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
      
      {/* Compare Button */}
      {onCompareToggle && (
        <button
          onClick={(e) => { e.preventDefault(); onCompareToggle(property); }}
          className={\`absolute top-6 right-6 z-20 p-2.5 rounded-full border transition-all shadow-sm \${
            isCompared 
               ? 'bg-[#171717] border-[#171717] text-white scale-110' 
               : 'bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:text-black dark:bg-[#171717]/90 dark:border-gray-700 dark:text-gray-300 hover:scale-110'
          }\`}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
        >
          {isCompared ? <Check className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
        </button>
      )}

      {/* Image Header */}
      <div className="w-full aspect-[4/3] rounded-2xl md:rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6 relative">
        {property.image_urls && property.image_urls.length > 0 ? (
          <img 
            src={property.image_urls[0]} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-sm font-medium">No image</div>
        )}
        
        {/* Overlays */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <div className="bg-red-600 text-white font-black uppercase tracking-widest px-6 py-3 rounded-xl transform -rotate-12 shadow-2xl border-2 border-white/20 text-lg sm:text-xl">
              Sold Out
            </div>
          </div>
        )}

        {!isSoldOut && (
          <div className={\`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md z-10 \${
            property.status === 'open' 
              ? 'bg-[#9ABA1B] text-white' 
              : 'bg-gray-800 text-white'
          }\`}>
            {property.status === 'open' ? 'Active' : 'Closed'}
          </div>
        )}

        {isBeechwoodOutright && !isSoldOut && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#171717]/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-black/5 dark:border-white/10 z-10">
             <div className="flex items-center gap-2 mb-1">
               <Key className="w-4 h-4 text-[#9ABA1B]" />
               <span className="font-bold text-xs uppercase tracking-wider text-[#171717] dark:text-white">Outright Purchase</span>
             </div>
             <div className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
               Deposit <strong>₦100,000,000</strong><br/>
               Balance ₦180M over 12 months (₦15M/month)
             </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        {/* Title & Location */}
        <div className="mb-5">
          <h3 className="font-black text-xl sm:text-2xl md:text-[1.75rem] text-[#171717] dark:text-white leading-tight mb-2 line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
            {property.title}
          </h3>
          <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 gap-1.5">
            <MapPin className="w-4 h-4 text-[#9ABA1B] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 mt-auto pt-5 border-t-2 border-black/5 dark:border-white/5">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">Min. Inv.</p>
            <p className="font-black text-[#171717] dark:text-white text-lg sm:text-xl md:text-2xl tracking-tight">₦{property.min_investment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">Returns</p>
            <p className="font-black text-[#9ABA1B] text-lg sm:text-xl md:text-2xl tracking-tight">{property.returns_percent}%</p>
          </div>
        </div>

        {/* Button */}
        <Link
          to={\`/properties/\${property.slug}\`}
          className="w-full py-4 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-2xl font-bold text-sm md:text-base text-center hover:bg-gray-800 transition-colors inline-block shadow-lg"
        >
          View Property
        </Link>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/PropertyCard.tsx', content);
