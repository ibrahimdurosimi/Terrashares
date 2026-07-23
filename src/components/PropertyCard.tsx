import { Link } from 'react-router-dom';
import { MapPin, Home, Building, Trees, Grid, Bath, Bed, Square } from 'lucide-react';
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
      default: return <Home className="w-4 h-4" />;
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
      
      <div className="px-3 flex-col flex flex-grow">
        <h3 className="font-bold text-lg leading-tight text-gray-900 mb-2 truncate group-hover:text-[#9B8924] transition-colors">
          {property.title}
        </h3>
        <p className="text-xs text-[#0A0A0A]/50 mb-4 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {property.location}
        </p>
        
        {/* Key category details if available */}
        {property.category === 'residential' && typeDetails.bedrooms && (
          <div className="flex items-center gap-4 text-[10px] font-semibold text-[#0A0A0A]/60 mb-5 pb-5 border-b border-black/5">
            <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5" /> {typeDetails.bedrooms} Beds</span>
            <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" /> {typeDetails.bathrooms} Baths</span>
            <span className="flex items-center gap-1.5"><Square className="w-3.5 h-3.5" /> {typeDetails.square_footage} sqft</span>
          </div>
        )}
        
        <div className="mt-auto flex justify-between items-end mb-5">
          <div>
            <div className="text-[10px] uppercase text-[#0A0A0A]/40 font-bold mb-0.5">Min. Invest</div>
            <div className="font-black text-lg text-[#0A0A0A]">
              ${property.min_investment.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#9B8924]/10 px-3 py-1.5 rounded-lg flex items-center justify-center">
            <div className="font-bold text-[#9B8924] text-sm flex items-center">
              {property.returns_percent}% <span className="text-[10px] ml-1 uppercase opacity-60">ROI</span>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/properties/${property.slug}`}
          className="w-full mt-auto py-3.5 border border-[#0A0A0A] text-[#0A0A0A] rounded-full text-sm font-bold text-center hover:bg-[#0A0A0A] hover:text-white transition-colors"
        >
          Invest now
        </Link>
      </div>
    </div>
  );
}
