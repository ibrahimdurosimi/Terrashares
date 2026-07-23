import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { 
  Building2, MapPin, Calendar, Banknote, Percent, Target, 
  ChevronLeft, MessageCircle, Home, Building, Trees, Grid, Share2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { FAQAccordion } from '../components/FAQAccordion';
import { cn } from '../lib/utils';

type Property = Database['public']['Tables']['properties']['Row'];
type Valuation = Database['public']['Tables']['property_valuations']['Row'];

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fractional investing states
  const [units, setUnits] = useState(1);
  
  // Lead form states
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchProperty() {
      if (!slug) return;
      setLoading(true);
      
      const { data: propData } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (propData) {
        setProperty(propData);
        
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
    
    fetchProperty();
  }, [slug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    
    setFormStatus('submitting');
    
    const message = property.is_fractional 
      ? `Interest: ${units} units ($${((property.unit_value || 0) * units).toLocaleString()}). ${formData.message}`
      : formData.message;

    const { error } = await supabase.from('leads').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: message,
      property_id: property.id,
      status: 'new'
    });

    if (error) {
      console.error(error);
      setFormStatus('error');
    } else {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B8924]"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Building2 className="w-16 h-16 text-[#0A0A0A]/20 mb-6" />
        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">Property Not Found</h2>
        <Link to="/properties" className="text-[#9B8924] font-medium hover:opacity-70 flex items-center transition-opacity">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Properties
        </Link>
      </div>
    );
  }

  const typeDetails: any = property.type_details || {};
  const isAvailable = property.status === 'open';
  const availableUnits = property.is_fractional ? (property.total_units || 0) - (property.units_sold || 0) : 0;
  const progressPercent = property.is_fractional && property.total_units ? Math.round(((property.units_sold || 0) / property.total_units) * 100) : 0;

  // Chart formatting
  const chartData = valuations.map(v => ({
    date: format(parseISO(v.recorded_date), 'MMM yyyy'),
    value: v.value,
  }));
  
  const initialValue = valuations.length > 0 ? valuations[0].value : 0;
  const latestValue = valuations.length > 0 ? valuations[valuations.length - 1].value : 0;
  const valueChange = initialValue > 0 ? ((latestValue - initialValue) / initialValue) * 100 : 0;

  return (
    <div className="pb-24">
      {/* Hero Image Gallery */}
      <div className="w-full h-[40vh] md:h-[60vh] bg-[#0A0A0A] relative">
        {property.image_urls && property.image_urls.length > 0 ? (
          <img 
            src={property.image_urls[0]} 
            alt={property.title} 
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-24 h-24 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-10 pb-8 md:pb-12">
            <Link to="/properties" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to properties
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#9B8924] text-white px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase">
                {property.category.replace('_', ' ')}
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-semibold tracking-wide uppercase text-white",
                property.status === 'open' ? "bg-green-600" : "bg-gray-600"
              )}>
                {property.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-300 text-lg">
              <MapPin className="w-5 h-5 mr-2" />
              {property.location}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 mt-8 md:mt-12">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-black/5 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Overview</h2>
              <div className="prose prose-lg text-[#0A0A0A]/70 leading-relaxed max-w-none">
                <p>{property.description}</p>
              </div>
            </section>

            {/* Asset Details */}
            <section className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-black/5 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0A0A0A] mb-8">Asset Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                <div>
                  <div className="flex items-center text-[#0A0A0A]/50 mb-2">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium uppercase tracking-wider">Target Returns</span>
                  </div>
                  <p className="text-2xl font-bold text-[#9B8924]">{property.returns_percent}%</p>
                </div>
                <div>
                  <div className="flex items-center text-[#0A0A0A]/50 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0A0A0A]">{property.duration_months} Months</p>
                </div>
                <div>
                  <div className="flex items-center text-[#0A0A0A]/50 mb-2">
                    <Banknote className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium uppercase tracking-wider">Payout Style</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0A0A0A] capitalize">{property.payout_style.replace('_', ' ')}</p>
                </div>
                
                {/* Dynamic Category Details */}
                {property.category === 'residential' && (
                  <>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Bedrooms</p>
                      <p className="text-2xl font-bold text-[#0A0A0A]">{typeDetails.bedrooms || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Bathrooms</p>
                      <p className="text-2xl font-bold text-[#0A0A0A]">{typeDetails.bathrooms || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Square Footage</p>
                      <p className="text-2xl font-bold text-[#0A0A0A]">{typeDetails.square_footage?.toLocaleString() || '-'}</p>
                    </div>
                  </>
                )}
                {property.category === 'commercial' && (
                  <>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Business Type</p>
                      <p className="text-2xl font-bold text-[#0A0A0A] capitalize">{typeDetails.business_type || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Floors</p>
                      <p className="text-2xl font-bold text-[#0A0A0A]">{typeDetails.floors || '-'}</p>
                    </div>
                  </>
                )}
                {property.category === 'land' && (
                  <>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Lot Size (Acres)</p>
                      <p className="text-2xl font-bold text-[#0A0A0A]">{typeDetails.lot_size_acres || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#0A0A0A]/50 font-medium uppercase tracking-wider mb-2">Zoning</p>
                      <p className="text-2xl font-bold text-[#0A0A0A] capitalize">{typeDetails.zoning_type || '-'}</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Valuation Chart */}
            {valuations.length > 0 && (
              <section className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-black/5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Valuation History</h2>
                    <p className="text-[#0A0A0A]/60">Track the asset's performance over time.</p>
                  </div>
                  <div className="bg-white/50 px-4 py-2 rounded-xl border border-black/5">
                    <p className="text-xs text-[#0A0A0A]/50 uppercase font-bold tracking-wider mb-1">Total Change</p>
                    <p className={cn(
                      "text-xl font-bold flex items-center",
                      valueChange >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {valueChange >= 0 ? '+' : ''}{valueChange.toFixed(2)}%
                    </p>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Valuation']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#9B8924" 
                        strokeWidth={3}
                        dot={{ fill: '#9B8924', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}

            {/* FAQs */}
            <section className="pt-4">
              <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Investment FAQs</h2>
              <FAQAccordion />
            </section>
          </div>

          {/* Sidebar / Investment Form */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-xl shadow-black/5">
              {property.is_fractional ? (
                <>
                  <div className="mb-6 pb-6 border-b border-black/5">
                    <p className="text-sm text-[#0A0A0A]/50 font-bold tracking-wider uppercase mb-2">Price per unit</p>
                    <p className="text-4xl font-black text-[#0A0A0A]">${property.unit_value?.toLocaleString()}</p>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-[#0A0A0A]/70">Funding Progress</span>
                      <span className="text-[#9B8924] font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-black/5 rounded-full h-3 mb-2 overflow-hidden">
                      <div 
                        className="bg-[#9B8924] h-3 rounded-full transition-all duration-1000" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-[#0A0A0A]/50 font-medium">
                      {property.units_sold} of {property.total_units} units sold • {availableUnits} remaining
                    </p>
                  </div>

                  {isAvailable && (
                    <div className="mb-8 bg-white/40 p-4 rounded-2xl border border-black/5">
                      <label className="block text-sm font-bold text-[#0A0A0A] mb-3">Select Units</label>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setUnits(Math.max(1, units - 1))}
                          className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center font-bold text-xl hover:bg-black/5 transition-colors"
                        >-</button>
                        <span className="text-2xl font-black text-[#0A0A0A] w-12 text-center">{units}</span>
                        <button 
                          onClick={() => setUnits(Math.min(availableUnits, units + 1))}
                          className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center font-bold text-xl hover:bg-black/5 transition-colors"
                        >+</button>
                      </div>
                      <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-center">
                        <span className="font-semibold text-[#0A0A0A]/60">Total Investment</span>
                        <span className="text-2xl font-black text-[#0A0A0A]">${((property.unit_value || 0) * units).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="mb-8 pb-6 border-b border-black/5">
                  <p className="text-sm text-[#0A0A0A]/50 font-bold tracking-wider uppercase mb-2">Minimum Investment</p>
                  <p className="text-4xl font-black text-[#0A0A0A]">${property.min_investment.toLocaleString()}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-bold text-[#0A0A0A] text-lg">Express Interest</h3>
                <p className="text-sm text-[#0A0A0A]/50 mb-4">Leave your details and an investment manager will contact you.</p>
                
                {formStatus === 'success' ? (
                  <div className="bg-green-50 text-green-800 p-6 rounded-2xl text-center border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold mb-1">Interest Registered!</h4>
                    <p className="text-sm">We've received your request and will be in touch shortly.</p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="mt-4 text-sm font-semibold text-green-700 hover:underline"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#9B8924] focus:bg-white transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#9B8924] focus:bg-white transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#9B8924] focus:bg-white transition-colors"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    <textarea
                      placeholder="Any questions?"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 border border-black/5 focus:ring-2 focus:ring-[#9B8924] focus:bg-white transition-colors resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                    
                    <button
                      type="submit"
                      disabled={!isAvailable || formStatus === 'submitting'}
                      className="w-full h-14 rounded-full bg-[#0A0A0A] text-white font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'submitting' ? 'Submitting...' : isAvailable ? 'Request Details' : 'Closed for Funding'}
                    </button>
                    {formStatus === 'error' && (
                      <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* WhatsApp Float/Inline */}
            <a 
              href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hi, I'm interested in ${property.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-14 rounded-full bg-[#25D366] text-white font-bold text-lg flex items-center justify-center hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
