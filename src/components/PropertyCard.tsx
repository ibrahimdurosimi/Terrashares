import { Link } from 'react-router-dom';
import { MapPin, Home, Building, Trees, Grid } from 'lucide-react';
import { Database } from '../types/database';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const getCategoryIcon = () => {
    switch (property.category) {
      case 'residential': return <Home className="w-4 h-4" />;
      case 'commercial': return <Building className="w-4 h-4" />;
      case 'land': return <Trees className="w-4 h-4" />;
      case 'mixed_use': return <Grid className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = () => {
    return property.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Safe parse type details
  const typeDetails: any = property.type_details || {};

  return (
    <div className="bg-white rounded-3xl p-3 shadow-xl shadow-black/5 flex flex-col group transition-transform duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] relative overflow-hidden bg-[#E5E7EB] rounded-2xl mb-4">
        {property.image_urls && property.image_urls.length > 0 ? (
          <img 
            src={property.image_urls[0]} 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm">
          {getCategoryLabel()}
        </div>
        {property.status === 'closed' && (
          <div className="absolute top-3 right-3 bg-gray-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Closed
          </div>
        )}
      </div>
      
      <div className="px-2 flex-col flex flex-grow">
        <h3 className="font-bold text-lg leading-tight text-gray-900 mb-1 line-clamp-1 group-hover:text-[#9B8924] transition-colors">
          {property.title}
        </h3>
        <p className="text-xs text-[#0A0A0A]/50 mb-4">{property.location}</p>
        
        {/* Key category details if available */}
        {property.category === 'residential' && typeDetails.bedrooms && (
          <div className="flex items-center gap-3 text-xs text-[#0A0A0A]/60 mb-4 pb-4 border-b border-black/5">
            <span>{typeDetails.bedrooms} Beds</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
            <span>{typeDetails.bathrooms} Baths</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
            <span>{typeDetails.square_footage} sqft</span>
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-end mb-4">
          <div>
            <div className="text-[10px] uppercase text-[#0A0A0A]/40 font-bold mb-0.5">Min. Invest</div>
            <div className="font-bold text-sm md:text-base text-[#0A0A0A]">
              ${property.min_investment.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-[#0A0A0A]/40 font-bold mb-0.5">Returns</div>
            <div className="font-bold text-[#9B8924] text-sm md:text-base">
              {property.returns_percent}%
            </div>
          </div>
        </div>
        
        <Link 
          to={`/properties/${property.slug}`}
          className="w-full mt-auto py-3 bg-[#0A0A0A] text-white rounded-xl text-xs font-bold text-center hover:bg-gray-800 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
