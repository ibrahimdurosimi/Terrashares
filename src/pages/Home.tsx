import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Building2, Users, ShieldCheck, Search, MessageCircle, BarChart3, Clock, Percent, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { TestimonialCarousel } from '../components/TestimonialCarousel';

type Property = Database['public']['Tables']['properties']['Row'];

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({ 
    props: 0, 
    members: 0, 
    invested: 0, 
    avgRoi: 0 
  });

  useEffect(() => {
    async function fetchHomeData() {
      // Fetch 3 newest open properties
      const { data: props } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (props) setFeaturedProperties(props);

      const { count: propsCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      
      const { data: investments } = await supabase
        .from('investments')
        .select('amount')
        .eq('status', 'confirmed');
        
      const totalInvested = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;

      const { data: propertiesData } = await supabase
        .from('properties')
        .select('returns_percent');
        
      const avgRoi = propertiesData && propertiesData.length > 0
        ? propertiesData.reduce((sum, p) => sum + p.returns_percent, 0) / propertiesData.length
        : 0;

      setStats({
        props: propsCount || 0,
        members: usersCount || 0,
        invested: totalInvested,
        avgRoi: avgRoi,
      });
    }
    
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-20 pb-0 overflow-hidden bg-gradient-to-b from-[#F7D0BC] to-[#FDF3EE]">
        <div className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8 max-w-4xl tracking-tight text-[#0A0A0A]">
            Invest in property,<br/>
            build your <span className="text-[#9B8924] italic" style={{ fontFamily: 'Georgia, serif' }}>future.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#0A0A0A]/60 mb-12 max-w-2xl leading-relaxed">
            Fractional real estate investment platform. Secure, transparent, and built for everyone to grow their wealth through high-yield assets.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              to="/properties"
              className="w-full sm:w-auto px-8 py-4 border-2 border-[#0A0A0A]/10 text-[#0A0A0A] rounded-full font-bold flex items-center justify-center gap-2 hover:border-[#0A0A0A] transition-colors"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#0A0A0A] text-white rounded-full font-bold shadow-xl shadow-black/10 hover:bg-gray-800 transition-colors"
            >
              Invest Now
            </Link>
          </div>
        </div>

        {/* Thin line-art illustration strip */}
        <div className="relative w-full h-32 md:h-48 border-t border-[#0A0A0A]/10 flex items-end justify-center overflow-hidden opacity-80">
          <svg viewBox="0 0 1000 200" className="absolute bottom-0 w-[150%] md:w-full h-full stroke-[#0A0A0A]/20 fill-none" preserveAspectRatio="none">
            <path d="M0,200 L0,150 L50,150 L50,100 L100,100 L100,180 L180,180 L180,60 L240,60 L240,160 L320,160 L320,120 L380,120 L380,200" strokeWidth="2" />
            <path d="M380,200 L380,90 L450,90 L450,140 L520,140 L520,50 L600,50 L600,170 L680,170 L680,110 L750,110 L750,200" strokeWidth="2" stroke="#9B8924" />
            <path d="M750,200 L750,130 L820,130 L820,80 L880,80 L880,150 L950,150 L950,100 L1000,100 L1000,200" strokeWidth="2" />
            
            {/* Small Olive accent squares */}
            <rect x="100" y="100" width="6" height="6" fill="#9B8924" stroke="none" />
            <rect x="240" y="60" width="6" height="6" fill="#9B8924" stroke="none" />
            <rect x="520" y="50" width="6" height="6" fill="#9B8924" stroke="none" />
            <rect x="820" y="80" width="6" height="6" fill="#9B8924" stroke="none" />
          </svg>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <div className="bg-[#FDF3EE] pb-16">
        <div className="mx-4 sm:mx-6 lg:mx-10">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#0A0A0A]/10 py-8">
            <div className="text-center border-r border-[#0A0A0A]/10 px-4">
              <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">{stats.props}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Properties</div>
            </div>
            <div className="text-center md:border-r border-[#0A0A0A]/10 px-4">
              <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">${(stats.invested >= 1000000 ? (stats.invested / 1000000).toFixed(1) + 'M' : stats.invested.toLocaleString())}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Invested</div>
            </div>
            <div className="text-center border-r border-[#0A0A0A]/10 px-4 mt-8 md:mt-0">
              <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">{stats.members}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Members</div>
            </div>
            <div className="text-center px-4 mt-8 md:mt-0">
              <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">{stats.avgRoi.toFixed(1)}%</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Avg Returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Value-prop feature section */}
      <section className="px-4 sm:px-6 lg:px-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6 leading-tight">Institutional grade assets, accessible to all.</h2>
            <p className="text-lg text-[#0A0A0A]/60 mb-10 leading-relaxed">
              We break down large commercial and residential investments into affordable fractions, giving you the same benefits as institutional investors without the massive capital requirements.
            </p>
            <Link 
              to="/about"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#0A0A0A] px-10 text-base font-bold text-white transition-transform hover:scale-105 shadow-lg"
            >
              Learn our approach
            </Link>
          </div>
          <div className="relative h-[400px]">
            {/* Overlapping floating cards */}
            <div className="absolute top-0 right-12 w-64 bg-white rounded-3xl p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-black/5 z-20">
              <div className="w-12 h-12 bg-[#9B8924]/10 rounded-full flex items-center justify-center mb-4">
                <Percent className="w-6 h-6 text-[#9B8924]" />
              </div>
              <h3 className="font-bold text-[#0A0A0A] mb-1">High Yield</h3>
              <p className="text-sm text-[#0A0A0A]/60">Target returns averaging 12-15% annually.</p>
            </div>
            
            <div className="absolute bottom-10 left-0 w-72 bg-white rounded-3xl p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-black/5 z-30">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1554469234-f874284b3e83?auto=format&fit=crop&q=80&w=200" alt="Property" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A0A0A] text-sm mb-1">Downtown Plaza</h3>
                  <div className="flex items-center text-[#9B8924] font-bold text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" /> +14.2% ROI
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#F7D0BC] rounded-full blur-[80px] opacity-30 z-10"></div>
          </div>
        </div>
      </section>

      {/* 6. Featured properties */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-[#FDF3EE]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6">Featured Opportunities</h2>
          <p className="text-lg text-[#0A0A0A]/60">Hand-picked investments currently open for funding.</p>
        </div>
        
        {featuredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-black/5 max-w-3xl mx-auto">
            <Building2 className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
            <p className="text-[#0A0A0A]/50 font-bold">No active properties available at the moment.</p>
          </div>
        )}
      </section>

      {/* 7. Steps section */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div className="bg-gradient-to-r from-[#F7D0BC]/40 to-white p-12 rounded-[3rem] border border-black/5">
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight">Simple process,<br/>powerful results.</h2>
            </div>
            <div className="flex items-center">
              <p className="text-xl text-[#0A0A0A]/60 leading-relaxed">
                We handle the complex property management, tenant relations, and legal structuring. You simply choose the assets that fit your strategy and watch your portfolio grow.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:flex absolute top-12 left-[16.66%] w-[66.66%] justify-around items-center z-0">
              <ArrowRight className="w-6 h-6 text-[#0A0A0A]/20" />
              <ArrowRight className="w-6 h-6 text-[#0A0A0A]/20" />
            </div>
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 mx-auto bg-white border border-black/10 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <span className="text-4xl font-black text-[#9B8924]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Browse & Select</h3>
              <p className="text-[#0A0A0A]/60">Review vetted opportunities with full transparency.</p>
            </div>
            
            <div className="relative z-10 text-center mt-12 md:mt-0">
              <div className="w-24 h-24 mx-auto bg-white border border-black/10 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <span className="text-4xl font-black text-[#9B8924]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Invest Securely</h3>
              <p className="text-[#0A0A0A]/60">Purchase fractional shares seamlessly online.</p>
            </div>
            
            <div className="relative z-10 text-center mt-12 md:mt-0">
              <div className="w-24 h-24 mx-auto bg-white border border-black/10 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <span className="text-4xl font-black text-[#9B8924]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Earn Passive Income</h3>
              <p className="text-[#0A0A0A]/60">Receive regular payouts and track appreciation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Investment advantage grid */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Why choose Terrashares?</h2>
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                Our platform is built to provide unprecedented access, liquidity, and transparency in an asset class traditionally reserved for the few.
              </p>
              <Link 
                to="/about"
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-bold text-[#0A0A0A] transition-transform hover:scale-105"
              >
                Learn more
              </Link>
            </div>
            
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {[
                { icon: <ShieldCheck className="text-[#9B8924]" />, title: 'Vetted Assets', desc: 'Strict due diligence on every property.' },
                { icon: <BarChart3 className="text-[#9B8924]" />, title: 'Performance Tracking', desc: 'Live updates on your portfolio value.' },
                { icon: <Clock className="text-[#9B8924]" />, title: 'Passive Income', desc: 'Consistent distributions directly to you.' },
                { icon: <Users className="text-[#9B8924]" />, title: 'Expert Management', desc: 'We handle the tenants and maintenance.' },
                { icon: <Percent className="text-[#9B8924]" />, title: 'Tax Benefits', desc: 'Access to real estate tax advantages.' },
                { icon: <CheckCircle2 className="text-[#9B8924]" />, title: 'Secure Platform', desc: 'Bank-level security for your investments.' },
              ].map((adv, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    {adv.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{adv.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{adv.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonial carousel */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-white">
        <TestimonialCarousel />
      </section>

      {/* 5. Split FAQ intro & 10. Mini CTA + FAQ */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-[#FDF3EE]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] mb-8 leading-tight">Got questions?</h2>
            
            <div className="bg-gray-100 p-8 rounded-[2rem] border border-black/5 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto bg-[#F7D0BC]/50 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-[#0A0A0A]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Need more help?</h3>
              <p className="text-[#0A0A0A]/50 mb-8">Our support team is ready to assist you with any inquiries.</p>
              <Link 
                to="/contact"
                className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#9B8924] px-6 text-base font-bold text-white transition-colors hover:bg-[#8A791F]"
              >
                Send message
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <FAQAccordion />
          </div>
        </div>
      </section>
      
      {/* 11. Closing CTA band */}
      <section className="px-4 sm:px-6 lg:px-10 py-32 bg-gradient-to-b from-[#FDF3EE] to-[#F7D0BC]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-[#0A0A0A] mb-10 leading-tight">Start building your real estate portfolio today.</h2>
          <Link 
            to="/signup"
            className="inline-flex h-16 items-center justify-center rounded-full bg-[#9B8924] px-12 text-lg font-bold text-white transition-transform hover:scale-105 shadow-xl shadow-[#9B8924]/20"
          >
            Invest Now
          </Link>
        </div>
      </section>
    </div>
  );
}
