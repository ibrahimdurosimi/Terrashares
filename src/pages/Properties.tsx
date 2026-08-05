import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';
import { Building2, Search, Filter, X, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Property = Database['public']['Tables']['properties']['Row'];
type Category = 'all' | 'residential' | 'commercial' | 'land' | 'mixed_use';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Compare feature state
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      
      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }
      
      const { data } = await query;
      
      if (data) {
        let filteredData = data as Property[];
        
        // Location filter
        if (filterLocation) {
          filteredData = filteredData.filter(p => p.location.toLowerCase().includes(filterLocation.toLowerCase()));
        }
        
        // Price filter
        if (minPrice) {
          const min = parseFloat(minPrice);
          if (!isNaN(min)) {
            filteredData = filteredData.filter(p => p.min_investment >= min);
          }
        }
        if (maxPrice) {
          const max = parseFloat(maxPrice);
          if (!isNaN(max)) {
            filteredData = filteredData.filter(p => p.min_investment <= max);
          }
        }
        
        setProperties(filteredData);
      }
      setLoading(false);
    }
    
    fetchProperties();
  }, [activeCategory, filterLocation, minPrice, maxPrice]);

  const categories = [
    { id: 'all', label: 'All Properties' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'land', label: 'Land' },
    { id: 'mixed_use', label: 'Mixed Use' }
  ];

  const toggleCompare = (property: Property) => {
    setCompareList(prev => {
      const isSelected = prev.some(p => p.id === property.id);
      if (isSelected) {
        const newList = prev.filter(p => p.id !== property.id);
        if (newList.length === 0) setShowCompareModal(false);
        return newList;
      } else {
        if (prev.length >= 3) {
          alert('You can only compare up to 3 properties.');
          return prev;
        }
        return [...prev, property];
      }
    });
  };

  return (
    <div className="pt-32 pb-32 min-h-screen bg-[#F5F8E8] dark:bg-[#111]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#171717] dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Available Properties
          </h1>
          <p className="text-lg md:text-xl text-[#171717]/60 dark:text-white/60 leading-relaxed max-w-2xl mx-auto">
            Browse our curated selection of vetted commercial and residential properties. Find the perfect addition to your portfolio.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <span className="font-bold text-[#171717] dark:text-white">{properties.length} Results</span>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 bg-white dark:bg-[#171717] px-4 py-2 rounded-full border border-black/10 font-medium text-sm shadow-sm"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar / Filters */}
          <div className={`lg:w-1/4 shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-[#171717] p-6 rounded-3xl border border-black/5 shadow-sm sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#171717] dark:text-white">Filters</h3>
                {showMobileFilters && (
                  <button onClick={() => setShowMobileFilters(false)} className="lg:hidden text-[#171717]/60 dark:text-white/60">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Location Search */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#171717]/60 dark:text-white/60 mb-3">Location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#171717] dark:text-white/40 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search by city, area..." 
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9ABA1B] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#171717]/60 dark:text-white/60 mb-3">Property Type</label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input 
                          type="radio" 
                          name="category"
                          value={cat.id}
                          checked={activeCategory === cat.id}
                          onChange={() => setActiveCategory(cat.id as Category)}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-[#171717] peer-checked:bg-[#171717] transition-all"></div>
                        <div className="absolute w-2 h-2 rounded-full bg-white dark:bg-[#171717] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span className={`text-sm ${activeCategory === cat.id ? 'font-medium text-[#171717] dark:text-white' : 'text-[#171717] dark:text-white/70 group-hover:text-[#171717] dark:text-white'}`}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-[#171717]/60 dark:text-white/60 mb-3">Min. Investment</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#171717] dark:text-white/40 text-sm">₦</span>
                    <input 
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9ABA1B] text-sm"
                    />
                  </div>
                  <span className="text-[#171717] dark:text-white/40">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#171717] dark:text-white/40 text-sm">₦</span>
                    <input 
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9ABA1B] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(filterLocation || activeCategory !== 'all' || minPrice || maxPrice) && (
                <button 
                  onClick={() => {
                    setFilterLocation('');
                    setActiveCategory('all');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="mt-8 w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="lg:w-3/4 flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <span className="font-medium text-[#171717]/60 dark:text-white/60 text-sm">
                Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6"
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse bg-white dark:bg-[#171717] rounded-3xl h-[350px] border border-black/5 p-6">
                      <div className="flex gap-4 mb-4">
                        <div className="w-[72px] h-[72px] bg-gray-200 dark:bg-gray-700 rounded-2xl shrink-0"></div>
                        <div className="flex flex-col justify-center gap-2 w-full">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                      </div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full mt-auto"></div>
                    </div>
                  ))}
                </motion.div>
              ) : properties.length > 0 ? (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6"
                >
                  {properties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property as any} 
                      onCompareToggle={toggleCompare}
                      isCompared={compareList.some(p => p.id === property.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 bg-white dark:bg-[#171717] rounded-[3rem] border border-black/5 shadow-sm"
                >
                  <Building2 className="w-16 h-16 text-[#171717]/20 dark:text-white/20 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#171717] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>No properties found</h3>
                  <p className="text-[#171717]/60 dark:text-white/60 max-w-md mx-auto">Try adjusting your filters to find new investment opportunities.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Compare Banner */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#171717] border-t border-gray-200 dark:border-gray-700 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] z-40 p-4"
          >
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-[#F5F8E8] dark:bg-[#111] p-3 rounded-xl hidden sm:block">
                  <Scale className="w-6 h-6 text-[#9ABA1B]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#171717] dark:text-white">Compare Properties</h4>
                  <p className="text-sm text-[#171717]/60 dark:text-white/60">{compareList.length} of 3 selected</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
                <div className="hidden sm:flex gap-2">
                  {compareList.map(p => (
                    <div key={p.id} className="bg-gray-100 dark:bg-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span className="truncate max-w-[120px]">{p.title}</span>
                      <button onClick={() => toggleCompare(p)} className="text-gray-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setCompareList([]);
                      setShowCompareModal(false);
                    }}
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 px-2"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowCompareModal(true)}
                    disabled={compareList.length < 2}
                    className="px-6 py-2.5 bg-[#171717] dark:bg-white text-white dark:text-[#171717] rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Compare Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#171717] rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-bold text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>Compare Properties</h2>
                <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="p-0 overflow-x-auto flex-1 overflow-y-auto">
                <div className="min-w-[600px] p-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 border-b border-gray-100 dark:border-white/10 w-1/4"></th>
                        {compareList.map(p => (
                          <th key={p.id} className="p-4 border-b border-gray-100 dark:border-white/10 w-1/4 align-top">
                            <div className="relative pt-2">
                              <button 
                                onClick={() => toggleCompare(p)} 
                                className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:text-red-500 hover:border-red-200 z-10 text-gray-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden mb-3">
                                {p.image_urls && p.image_urls.length > 0 ? (
                                  <img src={p.image_urls[0]} alt={p.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Building2 className="w-8 h-8 opacity-20" />
                                  </div>
                                )}
                              </div>
                              <h3 className="font-bold text-[#171717] dark:text-white leading-tight mb-1">{p.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{p.location}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Property Type</td>
                        {compareList.map(p => <td key={p.id} className="p-4 text-sm text-[#171717] dark:text-white capitalize">{p.category.replace('_', ' ')}</td>)}
                      </tr>
                      <tr>
                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Min. Investment</td>
                        {compareList.map(p => <td key={p.id} className="p-4 text-sm font-bold text-[#171717] dark:text-white">₦{p.min_investment.toLocaleString()}</td>)}
                      </tr>
                      <tr>
                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Expected Returns</td>
                        {compareList.map(p => <td key={p.id} className="p-4 text-sm font-bold text-[#9ABA1B]">{p.returns_percent}%</td>)}
                      </tr>
                      <tr>
                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</td>
                        {compareList.map(p => <td key={p.id} className="p-4 text-sm text-[#171717] dark:text-white">{p.duration_months} months</td>)}
                      </tr>
                      <tr>
                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Payout Style</td>
                        {compareList.map(p => <td key={p.id} className="p-4 text-sm text-[#171717] dark:text-white capitalize">{p.payout_style.replace('_', ' ')}</td>)}
                      </tr>
                      <tr>
                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</td>
                        {compareList.map(p => (
                          <td key={p.id} className="p-4">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.status === 'open' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700'
                            }`}>
                              {p.status === 'open' ? 'Active' : 'Closed'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
