import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '../types/database';
type Property = Database['public']['Tables']['properties']['Row'];
import { Scale, Check, MapPin, Building, Key, Video } from 'lucide-react';
import { getPropertyVideos } from '../utils/mediaUtils';

interface PropertyCardProps {
  key?: React.Key | string | number;
  property: Property;
  onCompareToggle?: (property: Property) => void;
  isCompared?: boolean;
}

export function PropertyCard({ property, onCompareToggle, isCompared }: PropertyCardProps) {
  const isBeechwoodOutright = property.slug === '4-bed-detached-beechwood';
  const isSoldOut = property.status === 'closed';
  const videos = getPropertyVideos(property);
  const hasVideos = videos.length > 0;

  return (
    <div className="bg-white dark:bg-[#171717] rounded-2xl sm:rounded-3xl md:rounded-[2rem] p-3 sm:p-5 md:p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.03] dark:border-white/5 flex flex-col h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group hover:-translate-y-1">
      
      {/* Compare Button */}
      {onCompareToggle && (
        <button
          onClick={(e) => { e.preventDefault(); onCompareToggle(property); }}
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2 sm:p-2.5 rounded-full border transition-all shadow-sm ${
            isCompared 
               ? 'bg-[#171717] border-[#171717] text-white scale-110' 
               : 'bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:text-black dark:bg-[#171717]/90 dark:border-gray-700 dark:text-gray-300 hover:scale-110'
          }`}
          title={isCompared ? "Remove from comparison" : "Add to comparison"}
        >
          {isCompared ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Scale className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      )}

      {/* Image Header */}
      <div className="w-full aspect-[4/3] rounded-xl sm:rounded-2xl md:rounded-[1.5rem] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-5 relative">
        {property.image_urls && property.image_urls.length > 0 ? (
          <img 
            src={property.image_urls[0]} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs sm:text-sm font-medium">No image</div>
        )}
        
        {/* Overlays */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <div className="bg-red-600 text-white font-black uppercase tracking-widest px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transform -rotate-12 shadow-2xl border-2 border-white/20 text-xs sm:text-base">
              Sold Out
            </div>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex items-center gap-1.5 z-10">
          {!isSoldOut && (
            <div className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md ${
              property.status === 'open' 
                ? 'bg-[#9ABA1B] text-white' 
                : 'bg-gray-800 text-white'
            }`}>
              {property.status === 'open' ? 'Active' : 'Closed'}
            </div>
          )}

          {hasVideos && (
            <div className="px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-black/65 backdrop-blur-md text-white shadow-md flex items-center gap-1 border border-white/10" title="Includes video tour">
              <Video className="w-3 h-3 text-[#9ABA1B]" />
              <span className="hidden xs:inline">Video</span>
            </div>
          )}
        </div>

        {isBeechwoodOutright && !isSoldOut && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 bg-white/95 dark:bg-[#171717]/95 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-2.5 shadow-lg border border-black/5 dark:border-white/10 z-10">
             <div className="flex items-center gap-1.5 mb-0.5">
               <Key className="w-3.5 h-3.5 text-[#9ABA1B]" />
               <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-[#171717] dark:text-white">Outright Purchase</span>
             </div>
             <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 leading-tight">
               Deposit <strong>₦100M</strong> • Bal. 12 mos
             </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow">
        {/* Title & Location */}
        <div className="mb-3 sm:mb-4">
          <h3 className="font-bold sm:font-black text-sm sm:text-base md:text-lg lg:text-xl text-[#171717] dark:text-white leading-tight mb-1 sm:mb-1.5 line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
            {property.title}
          </h3>
          <div className="flex items-center text-[11px] sm:text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 gap-1">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9ABA1B] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3.5 sm:mb-5 mt-auto pt-3 sm:pt-4 border-t border-black/5 dark:border-white/5">
          {property.acquisition_type === 'investment' ? (
            <>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mb-0.5 font-bold">Min. Inv.</p>
                <p className="font-black text-[#171717] dark:text-white text-xs sm:text-sm md:text-base lg:text-lg tracking-tight truncate">
                  {property.min_investment ? `₦${property.min_investment >= 1000000 ? `${(property.min_investment / 1000000).toLocaleString()}M` : property.min_investment.toLocaleString()}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mb-0.5 font-bold">Returns</p>
                <p className="font-black text-[#9ABA1B] text-xs sm:text-sm md:text-base lg:text-lg tracking-tight">{property.returns_percent || 0}%</p>
              </div>
            </>
          ) : property.ownership_subtype === 'co-ownership' ? (
            <>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mb-0.5 font-bold">Per Slot</p>
                <p className="font-black text-[#171717] dark:text-white text-xs sm:text-sm md:text-base lg:text-lg tracking-tight truncate">
                  {property.price_per_slot ? `₦${property.price_per_slot >= 1000000 ? `${(property.price_per_slot / 1000000).toLocaleString()}M` : property.price_per_slot.toLocaleString()}` : '-'}
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mb-0.5 font-bold">Type</p>
                <p className="font-black text-[#9ABA1B] text-xs sm:text-sm md:text-base lg:text-lg tracking-tight truncate">Co-own</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mb-0.5 font-bold">Type</p>
                <p className="font-black text-[#171717] dark:text-white text-xs sm:text-sm md:text-base lg:text-lg tracking-tight truncate">Buy-to-Own</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mb-0.5 font-bold">Duration</p>
                <p className="font-black text-[#9ABA1B] text-xs sm:text-sm md:text-base lg:text-lg tracking-tight truncate">{property.duration_months || '-'} Mos</p>
              </div>
            </>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/properties/${property.slug}`}
          className="w-full py-2 sm:py-3 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base text-center hover:bg-gray-800 transition-colors inline-block shadow-md"
        >
          View Property
        </Link>
      </div>
    </div>
  );
}
