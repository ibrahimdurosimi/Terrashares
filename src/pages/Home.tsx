import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Building2, Users, ShieldCheck, Search, BarChart3, Clock, Percent, CheckCircle2, Target, Eye, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { PropertyCard } from '../components/PropertyCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { WhoIsItFor } from '../components/WhoIsItFor';
import { WhyLoveCarousel } from '../components/WhyLoveCarousel';
import { HowItWorks } from '../components/HowItWorks';
import { InvestmentCalculator } from '../components/InvestmentCalculator';
import { SocialProofToast } from '../components/SocialProofToast';
import { AnimatedHeroText } from '../components/AnimatedHeroText';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { motion } from 'motion/react';

type Property = Database['public']['Tables']['properties']['Row'];

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({ 
    props: 20, 
    members: 100, 
    invested: 2000000000, 
    avgRoi: 16 
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
        
      const totalInvested = investments?.reduce((sum, inv) => sum + (inv as any).amount, 0) || 0;

      const { data: propertiesData } = await supabase
        .from('properties')
        .select('returns_percent');
        
      const avgRoi = propertiesData && propertiesData.length > 0
        ? propertiesData.reduce((sum, p) => sum + (p as any).returns_percent, 0) / propertiesData.length
        : 0;

// Stats are hardcoded for now
    }
    
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SocialProofToast />
      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 -mt-20 pt-28 pb-0 overflow-hidden bg-gradient-to-b from-[#F7D0BC] to-white dark:from-[#3a2012] dark:to-[#0a0a0a] dark:from-[#3a2012] dark:to-[#0a0a0a]">
        <div className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8 max-w-4xl tracking-tight text-[#0A0A0A] dark:text-white">
            Invest in <AnimatedHeroText /><br/>build your <span className="text-[#9B8924] italic" style={{ fontFamily: 'Georgia, serif' }}>future.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#0A0A0A]/60 dark:text-white/60 mb-12 max-w-2xl leading-relaxed">
            Fractional real estate investment platform. Secure, transparent, and built for everyone to grow their wealth through high-yield assets.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              to="/properties"
              className="w-full sm:w-auto px-8 py-4 border-2 border-[#0A0A0A]/10 dark:border-white/10 text-[#0A0A0A] dark:text-white rounded-full font-bold flex items-center justify-center gap-2 hover:border-[#0A0A0A] transition-colors"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#0A0A0A] dark:bg-white dark:bg-[#0a0a0a] text-white dark:text-[#0A0A0A] dark:text-white rounded-full font-bold shadow-xl shadow-black/10 hover:bg-gray-800 transition-colors"
            >
              Invest Now
            </Link>
          </div>
        </div>

        {/* Realistic Lagos skyline */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-64 md:h-[500px] z-0 opacity-15 mix-blend-multiply pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Lagos Skyline" 
            className="w-full h-full object-cover" 
          />
        </div>
      </section>

      {/* 3. Stats Bar */}
      <div className="bg-white dark:bg-[#0a0a0a] pb-16">
        <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
          {stats.props === 0 && stats.members === 0 ? (
            <div className="border-t border-b border-[#0A0A0A]/10 dark:border-white/10 py-12 text-center w-full">
              <p className="text-xl md:text-2xl font-bold text-[#0A0A0A]/60 dark:text-white/60 italic" style={{ fontFamily: 'Georgia, serif' }}>
                Now open for our first investors.
              </p>
            </div>
          ) : (
            <div className="w-full border-t border-b border-[#0A0A0A]/10 dark:border-white/10 py-12 relative">
              {/* Floating element */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#F7D0BC]/40 blur-md"></motion.div>
              
              <div className="flex flex-wrap justify-around items-center gap-8 md:gap-12 w-full max-w-6xl mx-auto">
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] dark:text-white mb-1">
                    <AnimatedCounter value={stats.props} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50 dark:text-white/50 mt-2">Properties</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] dark:text-white mb-1">
                    <AnimatedCounter value={stats.invested} prefix="₦" isCurrency={true} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50 dark:text-white/50 mt-2">Invested</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] dark:text-white mb-1">
                    <AnimatedCounter value={stats.members} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50 dark:text-white/50 mt-2">Members</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] dark:text-white mb-1">
                    <AnimatedCounter value={stats.avgRoi} suffix="%" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50 dark:text-white/50 mt-2">Avg Returns</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7.5 Investment Calculator */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-white dark:bg-[#0a0a0a] overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[15vw] font-black text-[#0A0A0A]/[0.02] dark:text-white/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
          CALCULATE
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Project Returns</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              See how your money grows
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 dark:text-white/60 mb-8 leading-relaxed">
              Real estate offers some of the most stable, high-yield returns. Use our demo calculator to project potential earnings over time based on historical performance.
            </p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="w-16 h-16 bg-[#F7D0BC]/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#9B8924]" />
            </motion.div>
          </div>
          <div>
            <InvestmentCalculator />
          </div>
        </div>
      </section>

      {/* 8. About TerraShare section */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#FAF8F5] dark:bg-[#111] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
            <div>
              <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">About Terrashare</p>
              <h2 className="text-5xl md:text-6xl text-[#0A0A0A] dark:text-white leading-[1.1] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Property ownership shouldn't be out of reach.
              </h2>
              <p className="text-lg text-[#0A0A0A] dark:text-white/70 leading-relaxed mb-8">
                For too long, it’s felt like something only the wealthy could afford. We’re here to change that, for good. We’re a passionate team working to change the way land is owned in Nigeria.
              </p>
              <Link 
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-white dark:bg-[#0a0a0a] px-8 text-sm font-bold text-white dark:text-[#0A0A0A] dark:text-white transition-transform hover:scale-105 shadow-lg"
              >
                Learn our story
              </Link>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[300px] md:h-[400px]">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" alt="Modern Nigerian Real Estate" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
             {/* Mission */}
             <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#0a0a0a]/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <Target className="w-7 h-7 text-[#9B8924]" />
               </div>
               <h3 className="text-3xl text-[#0A0A0A] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Mission</h3>
               <p className="text-[#0A0A0A]/60 dark:text-white/60 leading-relaxed mb-8 flex-grow">
                 To make land ownership possible for everyday Nigerians by using smart technology to deliver safe, simple, and affordable investments, one share at a time.
               </p>
               <Link to="/about" className="inline-flex items-center text-[#0A0A0A] dark:text-white font-semibold text-sm hover:text-[#9B8924] transition-colors group">
                 Read more <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             {/* Vision */}
             <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#0a0a0a]/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <Eye className="w-7 h-7 text-[#9B8924]" />
               </div>
               <h3 className="text-3xl text-[#0A0A0A] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Vision</h3>
               <p className="text-[#0A0A0A]/60 dark:text-white/60 leading-relaxed mb-8 flex-grow">
                 To build a future where every Nigerian, home or abroad, has the power to own land, build wealth, and take control of their tomorrow.
               </p>
               <Link to="/properties" className="inline-flex items-center text-[#0A0A0A] dark:text-white font-semibold text-sm hover:text-[#9B8924] transition-colors group">
                 View properties <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             {/* Core Values */}
             <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#0a0a0a]/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <ShieldCheck className="w-7 h-7 text-[#9B8924]" />
               </div>
               <h3 className="text-3xl text-[#0A0A0A] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Core Values</h3>
               <ul className="text-[#0A0A0A]/60 dark:text-white/60 leading-relaxed space-y-3 mb-8 flex-grow w-full">
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Trust Is Everything</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Everyone Deserves a Start</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Keep It Simple</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Security Matters</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Grow Together</li>
               </ul>
               <Link to="/contact" className="inline-flex items-center text-[#0A0A0A] dark:text-white font-semibold text-sm hover:text-[#9B8924] transition-colors group">
                 Join our team <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Featured properties */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-white dark:bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 max-w-2xl text-center mx-auto">
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Investments</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] dark:text-white leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Featured Opportunities
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 dark:text-white/60">Hand-picked investments currently open for funding.</p>
          </div>
          
          {featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <div key={property.id} className="hover:-translate-y-2 transition-transform duration-500">
                  <PropertyCard property={property as any} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto">
              <Building2 className="w-10 h-10 text-[#0A0A0A]/20 dark:text-white/20 mx-auto mb-4" />
              <p className="text-[#0A0A0A]/50 dark:text-white/50 font-medium mb-6">No active properties available at the moment. Check back soon for new opportunities.</p>
              <Link 
                to="/properties"
                className="inline-flex items-center text-[#9B8924] font-bold hover:opacity-70 transition-opacity"
              >
                Browse all properties <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 7. How It Works */}
      <HowItWorks />

      {/* 9. Who Is It For + Why People Love TerraShare */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#FAF8F5] dark:bg-[#111] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto mb-32 relative z-10 text-center">
          <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Audience</p>
          <h2 className="text-4xl md:text-5xl text-[#0A0A0A] dark:text-white mb-12" style={{ fontFamily: 'Georgia, serif' }}>
            Who Is It For?
          </h2>
          <WhoIsItFor />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Why Terrashare</p>
              <h2 className="text-4xl md:text-5xl text-[#0A0A0A] dark:text-white mb-8 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
                Why People Love TerraShare
              </h2>
              <p className="text-lg text-[#0A0A0A]/60 dark:text-white/60 mb-10 leading-relaxed">
                We're changing how Nigerians invest in and own property, making it accessible, secure, and transparent.
              </p>
              <Link 
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-white dark:bg-[#0a0a0a] px-8 text-sm font-bold text-white dark:text-[#0A0A0A] dark:text-white transition-transform hover:scale-105 shadow-lg shadow-black/10"
              >
                Learn more
              </Link>
            </div>
            
            <div className="lg:col-span-7">
              <WhyLoveCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Split FAQ intro & 10. Mini CTA + FAQ */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#FAF8F5] dark:bg-[#111] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start relative z-10">
          <div className="lg:col-span-5">
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Support</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 dark:text-white/60 mb-10 leading-relaxed">
              Your questions matter—explore our FAQs to get the answers you need.
            </p>
            <Link 
              to="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-transparent border border-[#0A0A0A]/20 px-8 text-sm font-bold text-[#0A0A0A] dark:text-white transition-colors hover:bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#0a0a0a]/5 mb-12 shadow-sm"
            >
              Learn More
            </Link>
            
            </div>

          <div className="lg:col-span-7">
            <FAQAccordion />
          </div>
        </div>
      </section>
      
      {/* 11. Closing CTA band */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#0A0A0A] dark:bg-white dark:bg-[#0a0a0a] text-white dark:text-[#0A0A0A] dark:text-white overflow-hidden text-center">
        {/* Subtle grid background for dark mode */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl text-white mb-10 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
            Start building your real estate portfolio today.
          </h2>
          <Link 
            to="/signup"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white dark:bg-[#0a0a0a] px-10 text-sm font-bold text-[#0A0A0A] dark:text-white transition-transform hover:scale-105 shadow-xl"
          >
            Invest Now
          </Link>
        </div>
      </section>
    </div>
  );
}
