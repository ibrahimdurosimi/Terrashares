import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';
import { Building2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Property = Database['public']['Tables']['properties']['Row'];
type Category = 'all' | 'residential' | 'commercial' | 'land' | 'mixed_use';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      
      const { data } = await query;
      
      if (data) {
        // Client-side text filter for location since it's a simple text match
        let filteredData = data;
        if (filterLocation) {
          filteredData = data.filter(p => (p as any).location.toLowerCase().includes(filterLocation.toLowerCase()));
        }
        setProperties(filteredData);
      }
      setLoading(false);
    }
    
    fetchProperties();
  }, [activeCategory, filterLocation]);

  const categories = [
    { id: 'all', label: 'All Properties' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'land', label: 'Land' },
    { id: 'mixed_use', label: 'Mixed Use' }
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#0A0A0A] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Available Properties
          </h1>
          <p className="text-lg md:text-xl text-[#0A0A0A]/60 leading-relaxed max-w-2xl mx-auto">
            Browse our curated selection of vetted commercial and residential properties. Find the perfect addition to your portfolio.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-[#0A0A0A] text-white shadow-md scale-105' 
                  : 'bg-white text-[#0A0A0A]/60 hover:bg-white/80 hover:text-[#0A0A0A] border border-black/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-16 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by location..." 
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full pl-12 pr-4 h-14 bg-white border border-black/5 shadow-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#9B8924] transition-all placeholder:text-[#0A0A0A]/40 text-[#0A0A0A]"
          />
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-3xl h-[350px] border border-black/5 p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="w-[72px] h-[72px] bg-gray-200 rounded-2xl shrink-0"></div>
                    <div className="flex flex-col justify-center gap-2 w-full">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-xl w-full mt-auto"></div>
                </div>
              ))}
            </motion.div>
          ) : properties.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {properties.map(property => (
                <PropertyCard key={property.id} property={property as any} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 bg-white rounded-[3rem] border border-black/5 shadow-sm"
            >
              <Building2 className="w-16 h-16 text-[#0A0A0A]/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2" style={{ fontFamily: 'Georgia, serif' }}>No properties found</h3>
              <p className="text-[#0A0A0A]/60 max-w-md mx-auto">Try adjusting your category or search to find new investment opportunities.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
