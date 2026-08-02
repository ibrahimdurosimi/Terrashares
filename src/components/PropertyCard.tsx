import React from 'react';
import { Link } from 'react-router-dom';
import { Database } from '../types/database';

type Property = Database['public']['Tables']['properties']['Row'];

import { Scale, Check } from 'lucide-react';

interface PropertyCardProps {
  key?: React.Key | string | number;
  property: Property;
  onCompareToggle?: (property: Property) => void;
  isCompared?: boolean;
}

export function PropertyCard({ property, onCompareToggle, isCompared }: PropertyCardProps) {
  return (
    <div className="bg-white dark:bg-[#171717] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col h-full hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex gap-4 mb-4 relative">
        {onCompareToggle && (
          <button
            onClick={(e) => { e.preventDefault(); onCompareToggle(property); }}
            className={`absolute top-0 right-0 p-2 rounded-full border transition-colors ${
              isCompared 
                ? 'bg-[#171717] border-[#171717] text-white' 
                : 'bg-white dark:bg-[#171717] border-gray-200 dark:border-gray-700 text-gray-400 hover:border-[#171717] hover:text-[#171717] dark:text-white'
            }`}
            title={isCompared ? "Remove from comparison" : "Add to comparison"}
          >
            {isCompared ? <Check className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
          </button>
        )}
        <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
          {property.image_urls && property.image_urls.length > 0 ? (
            <img 
              src={property.image_urls[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight mb-1 truncate pr-8">
            {property.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1.5 mt-1 pr-8">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="truncate max-w-[150px]">{property.location}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">
        {property.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6 mt-auto">
        <div>
          <p className="text-xs text-gray-400 mb-1">Min. Investment</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">₦{property.min_investment.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Returns</p>
          <p className="font-bold text-[#9ABA1B] text-sm">{property.returns_percent}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
            property.status === 'open' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-green-100 text-green-700' // Keeping it green for both per screenshot, or make closed slightly different
          }`}>
            {property.status === 'open' ? 'Active' : 'Closed'}
          </div>
        </div>
      </div>

      {/* Button */}
      <Link
        to={`/properties/${property.slug}`}
        className="w-full py-3.5 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl font-bold text-sm text-center hover:bg-gray-800 transition-colors"
      >
        Invest
      </Link>
    </div>
  );
}
