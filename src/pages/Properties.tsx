import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';
import { Building2, Search, Filter } from 'lucide-react';

type Property = Database['public']['Tables']['properties']['Row'];

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      
      const { data } = await query;
      
      if (data) {
        // Client-side text filter for location since it's a simple text match
        let filteredData = data;
        if (filterLocation) {
          filteredData = data.filter(p => p.location.toLowerCase().includes(filterLocation.toLowerCase()));
        }
        setProperties(filteredData);
      }
      setLoading(false);
    }
    
    fetchProperties();
  }, [filterStatus, filterLocation]);

  return (
    <div className="pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#0A0A0A] mb-6">
            Investment <span className="text-[#9B8924] italic" style={{ fontFamily: 'Georgia, serif' }}>Opportunities</span>
          </h1>
          <p className="text-xl text-[#0A0A0A]/60 leading-relaxed">
            Browse our curated selection of vetted commercial and residential properties. Find the perfect addition to your portfolio.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] p-4 shadow-sm border border-black/5 mb-12 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by location..." 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full pl-12 pr-4 h-14 bg-white/50 border-none rounded-full focus:ring-2 focus:ring-[#9B8924] focus:bg-white transition-colors placeholder:text-[#0A0A0A]/40 text-[#0A0A0A]"
            />
          </div>
          <div className="relative shrink-0 w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 w-5 h-5" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full sm:w-48 pl-12 pr-10 h-14 bg-white/50 border-none rounded-full appearance-none focus:ring-2 focus:ring-[#9B8924] focus:bg-white transition-colors cursor-pointer text-[#0A0A0A]"
            >
              <option value="all">All Status</option>
              <option value="open">Open for Investment</option>
              <option value="closed">Closed / Funded</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white/40 rounded-3xl h-[450px] border border-black/5">
                <div className="h-[250px] bg-black/5 rounded-t-3xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-black/10 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-black/10 rounded w-1/2 mb-8"></div>
                  <div className="h-12 bg-black/10 rounded-full w-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-black/5">
            <Building2 className="w-16 h-16 text-[#0A0A0A]/20 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">No properties found</h3>
            <p className="text-[#0A0A0A]/60 max-w-md mx-auto">Try adjusting your filters or check back later for new investment opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
