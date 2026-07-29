import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { ArrowLeft, MapPin, X, MessageCircle, Mail, BookmarkPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { FAQAccordion } from '../components/FAQAccordion';

type Property = Database['public']['Tables']['properties']['Row'];
type Valuation = Database['public']['Tables']['property_valuations']['Row'];

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [portfolioStatus, setPortfolioStatus] = useState<'idle'|'success'>('idle');

  useEffect(() => {
    async function fetchPropertyDetails() {
      if (!slug) return;
      
      const { data: propData } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (propData) {
        setProperty(propData);
        
        // Fetch valuations for chart
        const { data: valData } = await supabase
          .from('property_valuations')
          .select('*')
          .eq('property_id', propData.id)
          .order('recorded_date', { ascending: true });
          
        if (valData) {
          setValuations(valData);
        }
      }
      setLoading(false);
    }
    
    fetchPropertyDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-12 h-12 border-4 border-[#0A0A0A]/10 border-t-[#9B8924] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property not found</h2>
          <Link to="/properties" className="text-[#9B8924] hover:underline">Back to properties</Link>
        </div>
      </div>
    );
  }

  // Calculate progress safely
  const progressPercent = property.is_fractional && property.total_units && property.units_sold
    ? Math.round((property.units_sold / property.total_units) * 100)
    : (property.status === 'closed' ? 100 : 0);

  const getCategoryLabel = (cat: string) => cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const getPayoutLabel = (style: string) => style.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const handleAddToPortfolio = async (type: 'wishlist' | 'offline') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please login to add to your portfolio.");
      return;
    }
    
    const key = `terrashare_portfolio_${session.user.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Check if already exists
    if (!existing.some((item: any) => item.property_id === property?.id)) {
      existing.push({
        id: Math.random().toString(36).substr(2, 9),
        property_id: property?.id,
        property_slug: property?.slug,
        title: property?.title,
        type,
        added_at: new Date().toISOString(),
        min_investment: property?.min_investment,
        returns_percent: property?.returns_percent,
        category: property?.category,
        image_urls: property?.image_urls
      });
      localStorage.setItem(key, JSON.stringify(existing));
    }
    
    setPortfolioStatus('success');
    setTimeout(() => {
      setIsPortfolioModalOpen(false);
      setPortfolioStatus('idle');
    }, 2000);
  };

  // Sample data if none provided
  const chartData = valuations.length > 0 
    ? valuations.map(v => ({ name: new Date(v.recorded_date).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}), value: v.value }))
    : [
        { name: 'Jan 2023', value: property.min_investment },
        { name: 'Jul 2023', value: property.min_investment * 1.05 },
        { name: 'Jan 2024', value: property.min_investment * 1.12 },
        { name: 'Current', value: property.min_investment * (1 + property.returns_percent / 100) }
      ];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-4xl">
        
        <Link to="/properties" className="inline-flex items-center text-[#0A0A0A]/60 hover:text-[#0A0A0A] font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to properties
        </Link>

        {/* 1. Main Image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-3xl overflow-hidden relative mb-8 shadow-sm">
          {property.image_urls && property.image_urls.length > 0 ? (
            <img 
              src={property.image_urls[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200"></div>
          )}
          
          {/* Closed Badge on Image */}
          <div className="absolute bottom-4 right-4 bg-white px-6 py-2 rounded-full text-sm font-bold text-gray-700 shadow-md">
            {property.status === 'closed' ? 'Closed' : 'Active'}
          </div>
        </div>

        {/* 2. Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 gap-1.5 font-medium">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600 fill-current shrink-0">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              {property.location}
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500 mb-1">Returns</p>
            <p className="text-2xl font-bold text-[#449175]">{property.returns_percent}%</p>
          </div>
        </div>

        {/* 3. Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {property.description}
          </p>
        </div>

        {/* 4. Invest Button */}
        <div className="flex gap-4 mb-10">
          <button 
            onClick={() => setIsInvestModalOpen(true)}
            className="flex-1 py-4 bg-[#449175] hover:bg-[#387861] text-white rounded-2xl font-bold text-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={property.status === 'closed'}
          >
            {property.status === 'closed' ? 'Closed' : 'Invest'}
          </button>
          <button 
            onClick={() => setIsPortfolioModalOpen(true)}
            className="w-16 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl shadow-sm transition-colors"
            title="Add to Portfolio"
          >
            <BookmarkPlus className="w-6 h-6" />
          </button>
        </div>

        {/* 5. Progress */}
        <div className="mb-10">
          <div className="flex justify-between items-center text-sm font-medium mb-2 text-gray-600">
            <span>Asset progress</span>
            <span>{progressPercent}% invested</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#BFA15F] h-full transition-all duration-1000" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* 6. Asset Details */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Asset details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#F8F9FA] p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Minimum investment</p>
              <p className="font-bold text-gray-900">₦{property.min_investment.toLocaleString()}</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Returns</p>
              <p className="font-bold text-gray-900">{property.returns_percent}%</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Category</p>
              <p className="font-bold text-gray-900">{getCategoryLabel(property.category)}</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Payout Style</p>
              <p className="font-bold text-gray-900">{getPayoutLabel(property.payout_style)}</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-bold text-gray-900">{property.duration_months} Months</p>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <p className={`font-bold ${property.status === 'open' ? 'text-[#449175]' : 'text-[#449175]'}`}>
                {property.status === 'open' ? 'Active' : 'Closed'}
              </p>
            </div>
          </div>
        </div>

        {/* 7. Property Value Over Time */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Property value over time</h2>
          <div className="h-[300px] w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  tickFormatter={(val) => `₦${val >= 1000000 ? (val/1000000).toFixed(1)+'M' : val.toLocaleString()}`}
                  dx={-10}
                />
                <RechartsTooltip 
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Value']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#9B8924" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#9B8924', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#9B8924', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. FAQs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <FAQAccordion />
        </div>
      </div>

      {/* Investment Options Modal */}
      <AnimatePresence>
        {isInvestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsInvestModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-black/5">
                <h3 className="text-xl font-bold text-gray-900">Invest in {property.title}</h3>
                <button
                  onClick={() => setIsInvestModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 mb-2">Choose how you'd like to get in touch with our investment managers to proceed with your investment.</p>
                
                <a 
                  href={`https://wa.me/2348000000000?text=${encodeURIComponent(`Hello! I am interested in investing in ${property.title} located at ${property.location}. The minimum investment is ₦${property.min_investment.toLocaleString()}. Please let me know how to proceed.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center mr-4 shrink-0 shadow-sm shadow-[#25D366]/20">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#25D366] mb-0.5">Chat on WhatsApp</h4>
                    <p className="text-xs text-[#25D366]/80 font-medium">Quickest response time</p>
                  </div>
                </a>

                <a 
                  href={`mailto:invest@yourcompany.com?subject=${encodeURIComponent(`Investment Inquiry: ${property.title}`)}&body=${encodeURIComponent(`Hello,\n\nI am interested in investing in ${property.title} located at ${property.location}.\n\nThe minimum investment is ₦${property.min_investment.toLocaleString()}.\n\nPlease provide me with the next steps to proceed with this investment.\n\nThank you.`)}`}
                  className="flex items-center w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0A0A0A] flex items-center justify-center mr-4 shrink-0 shadow-sm shadow-black/10">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A0A0A] mb-0.5">Send an Email</h4>
                    <p className="text-xs text-gray-500 font-medium">Detailed correspondence</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio Options Modal */}
      <AnimatePresence>
        {isPortfolioModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsPortfolioModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-black/5">
                <h3 className="text-xl font-bold text-gray-900">Add to Portfolio</h3>
                <button
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {portfolioStatus === 'success' ? (
                  <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center">
                    <p className="font-bold">Successfully added to your portfolio!</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">How would you like to track this property?</p>
                    
                    <button 
                      onClick={() => handleAddToPortfolio('wishlist')}
                      className="flex items-center text-left w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900 mb-0.5">Add to Wishlist</h4>
                        <p className="text-xs text-gray-500 font-medium">Track this property for future investment</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleAddToPortfolio('offline')}
                      className="flex items-center text-left w-full p-4 rounded-2xl bg-[#9B8924]/10 border border-[#9B8924]/20 hover:bg-[#9B8924]/20 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-[#9B8924] mb-0.5">Invested Offline</h4>
                        <p className="text-xs text-[#9B8924]/80 font-medium">I have already invested in this property offline</p>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
