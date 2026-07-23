import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Building2, Users, ShieldCheck, Search, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { TestimonialCarousel } from '../components/TestimonialCarousel';

type Property = Database['public']['Tables']['properties']['Row'];

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({ props: 0, members: 0 });

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

      // We'd normally do aggregations via RPC, but let's do a simple count for demo
      const { count: propsCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      
      setStats({
        props: propsCount || 12,
        members: usersCount || 154,
      });
    }
    
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-10 pt-12 pb-8 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 max-w-4xl">
          Invest in property,<br/>
          build your <span className="text-[#9B8924] italic" style={{ fontFamily: 'Georgia, serif' }}>future.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#0A0A0A]/70 mb-10 max-w-2xl leading-relaxed">
          Fractional real estate investment platform. Secure, transparent, and built for everyone to grow their wealth through high-yield assets.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/properties"
            className="w-full sm:w-auto px-8 py-4 bg-[#0A0A0A] text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            Browse Properties
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#0A0A0A] rounded-full font-semibold shadow-md hover:bg-gray-50 transition-colors"
          >
            Invest Now
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="mx-4 sm:mx-6 lg:mx-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white/40 border border-black/10 rounded-2xl py-6 md:py-8 backdrop-blur-sm shadow-sm gap-y-6">
          <div className="text-center md:border-r border-black/10">
            <div className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">$124M+</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest font-semibold opacity-50 mt-1">Invested</div>
          </div>
          <div className="text-center md:border-r border-black/10">
            <div className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">{stats.props}</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest font-semibold opacity-50 mt-1">Properties</div>
          </div>
          <div className="text-center md:border-r border-black/10">
            <div className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">{stats.members}</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest font-semibold opacity-50 mt-1">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#9B8924]">12.5%</div>
            <div className="text-[10px] md:text-xs uppercase tracking-widest font-semibold opacity-50 mt-1">Avg ROI</div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <section className="mx-4 sm:mx-6 lg:mx-10 mb-16 bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-xl shadow-black/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-4">Invest with confidence in a few steps</h2>
          <p className="text-lg text-[#0A0A0A]/60">Our platform simplifies real estate investing so you can focus on building your portfolio.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#F7D0BC]/20 rounded-2xl flex items-center justify-center mb-6 rotate-3 border border-[#F7D0BC]">
              <Search className="w-10 h-10 text-[#0A0A0A]" />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">1. Discover properties</h3>
            <p className="text-[#0A0A0A]/60 leading-relaxed">Browse our curated selection of vetted commercial and residential opportunities.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-[#9B8924] rounded-2xl flex items-center justify-center mb-6 -rotate-3 shadow-lg shadow-[#9B8924]/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">2. Invest with confidence</h3>
            <p className="text-[#0A0A0A]/60 leading-relaxed">Review detailed financials, sign documents digitally, and fund your investment securely.</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <TrendingUp className="w-10 h-10 text-[#0A0A0A]" />
            </div>
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">3. Earn & track</h3>
            <p className="text-[#0A0A0A]/60 leading-relaxed">Monitor your portfolio performance, receive updates, and earn potential distributions.</p>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="px-4 sm:px-6 lg:px-10 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-2">Featured Opportunities</h2>
            <p className="text-lg text-[#0A0A0A]/60">Hand-picked investments currently open for funding.</p>
          </div>
          <Link 
            to="/properties" 
            className="inline-flex items-center text-[#9B8924] font-semibold hover:opacity-70 transition-opacity"
          >
            View all properties <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
        
        {featuredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-3xl border border-black/5">
            <Building2 className="w-12 h-12 text-[#0A0A0A]/20 mx-auto mb-4" />
            <p className="text-[#0A0A0A]/50 font-medium">No active properties available at the moment.</p>
          </div>
        )}
      </section>
      
      {/* Testimonials */}
      <section className="mx-4 sm:mx-6 lg:mx-10 mb-16">
        <TestimonialCarousel />
      </section>

      {/* FAQs */}
      <section className="px-4 sm:px-6 lg:px-10 mb-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] mb-6">Frequently asked questions</h2>
            <p className="text-lg text-[#0A0A0A]/60 mb-8 leading-relaxed">
              Everything you need to know about investing with Terrashares. Can't find the answer you're looking for?
            </p>
            
            <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[2rem] border border-black/5 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto bg-[#F7D0BC]/50 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-[#0A0A0A]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Have any question in your mind?</h3>
              <p className="text-[#0A0A0A]/50 mb-6">Our support team is here to help you understand the details.</p>
              <Link 
                to="/contact"
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0A0A0A] px-6 text-sm font-medium text-white transition-colors hover:bg-gray-800"
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
      
      {/* CTA Section */}
      <section className="mx-4 sm:mx-6 lg:mx-10 mb-16">
        <div className="bg-[#0A0A0A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#9B8924] rounded-full blur-[100px] opacity-20"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to build your portfolio?</h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of investors securing their financial future through premium real estate.</p>
          <Link 
            to="/signup"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#F7D0BC] px-10 text-base font-bold text-[#0A0A0A] transition-transform hover:scale-105 shadow-lg shadow-[#F7D0BC]/20 relative z-10"
          >
            Create free account
          </Link>
        </div>
      </section>
    </div>
  );
}
