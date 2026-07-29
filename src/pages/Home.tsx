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
        
      const totalInvested = investments?.reduce((sum, inv) => sum + (inv as any).amount, 0) || 0;

      const { data: propertiesData } = await supabase
        .from('properties')
        .select('returns_percent');
        
      const avgRoi = propertiesData && propertiesData.length > 0
        ? propertiesData.reduce((sum, p) => sum + (p as any).returns_percent, 0) / propertiesData.length
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
      <SocialProofToast />
      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 -mt-20 pt-28 pb-0 overflow-hidden bg-gradient-to-b from-[#F7D0BC] to-white">
        <div className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8 max-w-4xl tracking-tight text-[#0A0A0A]">
            Invest in <AnimatedHeroText /><br/>build your <span className="text-[#9B8924] italic" style={{ fontFamily: 'Georgia, serif' }}>future.</span>
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

        {/* Simple line-art skyline illustration */}
        <div className="relative w-full h-32 md:h-48 border-t border-[#0A0A0A]/5 flex items-end justify-center overflow-hidden opacity-60 mt-12">
          <svg viewBox="0 0 1000 200" className="absolute bottom-0 w-[150%] md:w-full h-full fill-none" preserveAspectRatio="none">
            {/* Clouds */}
            <g stroke="#9B8924" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
              <path d="M 120 45 a 10 10 0 0 1 10 -10 a 15 15 0 0 1 25 0 a 10 10 0 0 1 10 10 h -45" />
              <path d="M 350 35 a 12 12 0 0 1 12 -12 a 18 18 0 0 1 30 0 a 12 12 0 0 1 12 12 h -54" />
              <path d="M 750 60 a 15 15 0 0 1 15 -15 a 25 25 0 0 1 40 0 a 15 15 0 0 1 15 15 h -70" />
            </g>
            {/* Buildings */}
            <g stroke="#9B8924" strokeWidth="1.5" strokeLinejoin="round">
              {/* Building 1 */}
              <rect x="50" y="120" width="60" height="80" rx="4" />
              <rect x="70" y="180" width="20" height="20" />
              <rect x="60" y="135" width="12" height="15" />
              <rect x="88" y="135" width="12" height="15" />
              <rect x="60" y="160" width="12" height="15" />
              <rect x="88" y="160" width="12" height="15" />

              {/* Building 2 */}
              <rect x="130" y="70" width="80" height="130" rx="4" />
              <rect x="155" y="175" width="30" height="25" />
              <rect x="145" y="90" width="15" height="20" />
              <rect x="180" y="90" width="15" height="20" />
              <rect x="145" y="125" width="15" height="20" />
              <rect x="180" y="125" width="15" height="20" />

              {/* Building 3 */}
              <rect x="230" y="140" width="70" height="60" rx="4" />
              <rect x="250" y="180" width="30" height="20" />
              <rect x="245" y="155" width="40" height="12" />

              {/* Building 4 */}
              <rect x="320" y="50" width="90" height="150" rx="4" />
              <rect x="350" y="170" width="30" height="30" />
              <rect x="340" y="70" width="20" height="20" />
              <rect x="370" y="70" width="20" height="20" />
              <rect x="340" y="105" width="20" height="20" />
              <rect x="370" y="105" width="20" height="20" />
              <rect x="340" y="140" width="20" height="20" />
              <rect x="370" y="140" width="20" height="20" />

              {/* Building 5 */}
              <rect x="430" y="90" width="60" height="110" rx="4" />
              <rect x="445" y="175" width="30" height="25" />
              <rect x="445" y="110" width="30" height="15" />
              <rect x="445" y="140" width="30" height="15" />

              {/* Building 6 */}
              <rect x="510" y="30" width="100" height="170" rx="4" />
              <rect x="545" y="165" width="30" height="35" />
              <rect x="530" y="55" width="20" height="25" />
              <rect x="570" y="55" width="20" height="25" />
              <rect x="530" y="95" width="20" height="25" />
              <rect x="570" y="95" width="20" height="25" />
              <rect x="530" y="135" width="20" height="25" />
              <rect x="570" y="135" width="20" height="25" />

              {/* Building 7 */}
              <rect x="630" y="110" width="70" height="90" rx="4" />
              <rect x="650" y="170" width="30" height="30" />
              <rect x="645" y="130" width="15" height="20" />
              <rect x="670" y="130" width="15" height="20" />

              {/* Building 8 */}
              <rect x="720" y="60" width="80" height="140" rx="4" />
              <rect x="745" y="175" width="30" height="25" />
              <rect x="740" y="80" width="15" height="20" />
              <rect x="765" y="80" width="15" height="20" />
              <rect x="740" y="115" width="15" height="20" />
              <rect x="765" y="115" width="15" height="20" />
              <rect x="740" y="150" width="15" height="20" />
              <rect x="765" y="150" width="15" height="20" />

              {/* Building 9 */}
              <rect x="820" y="130" width="50" height="70" rx="4" />
              <rect x="835" y="175" width="20" height="25" />
              <rect x="830" y="145" width="12" height="15" />
              <rect x="848" y="145" width="12" height="15" />

              {/* Building 10 */}
              <rect x="890" y="80" width="70" height="120" rx="4" />
              <rect x="910" y="170" width="30" height="30" />
              <rect x="905" y="100" width="15" height="20" />
              <rect x="930" y="100" width="15" height="20" />
              <rect x="905" y="135" width="15" height="20" />
              <rect x="930" y="135" width="15" height="20" />
            </g>
          </svg>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <div className="bg-white pb-16">
        <div className="mx-4 sm:mx-6 lg:mx-10 max-w-7xl mx-auto">
          {stats.props === 0 && stats.members === 0 ? (
            <div className="border-t border-b border-[#0A0A0A]/10 py-12 text-center">
              <p className="text-xl md:text-2xl font-bold text-[#0A0A0A]/60 italic" style={{ fontFamily: 'Georgia, serif' }}>
                Now open for our first investors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#0A0A0A]/10 py-8 relative">
              {/* Floating element */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#F7D0BC]/40 blur-md"></motion.div>
              
              <div className="text-center border-r border-[#0A0A0A]/10 px-4">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.props} />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Properties</div>
              </div>
              <div className="text-center md:border-r border-[#0A0A0A]/10 px-4">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.invested} prefix="$" isCurrency={true} />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Invested</div>
              </div>
              <div className="text-center border-r border-[#0A0A0A]/10 px-4 mt-8 md:mt-0">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.members} />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Members</div>
              </div>
              <div className="text-center px-4 mt-8 md:mt-0">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.avgRoi} suffix="%" />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Avg Returns</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7.5 Investment Calculator */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-white overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[15vw] font-black text-[#0A0A0A]/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
          CALCULATE
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Project Returns</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              See how your money grows
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 mb-8 leading-relaxed">
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
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#FAF8F5] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-20 max-w-2xl">
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">About Terrashare</p>
            <h2 className="text-5xl md:text-6xl text-[#0A0A0A] leading-[1.1] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Property ownership shouldn't be out of reach.
            </h2>
            <p className="text-lg text-[#0A0A0A]/70 leading-relaxed mb-8">
              For too long, it’s felt like something only the wealthy could afford. We’re here to change that, for good. We’re a passionate team working to change the way land is owned in Nigeria.
            </p>
            <Link 
              to="/about"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#0A0A0A] px-8 text-sm font-bold text-white transition-transform hover:scale-105 shadow-lg"
            >
              Learn our story
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
             {/* Mission */}
             <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-8">
                 <Target className="w-7 h-7 text-[#9B8924]" />
               </div>
               <h3 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Mission</h3>
               <p className="text-[#0A0A0A]/60 leading-relaxed mb-8 flex-grow">
                 To make land ownership possible for everyday Nigerians by using smart technology to deliver safe, simple, and affordable investments, one share at a time.
               </p>
               <Link to="/about" className="inline-flex items-center text-[#0A0A0A] font-semibold text-sm hover:text-[#9B8924] transition-colors group">
                 Read more <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             {/* Vision */}
             <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-8">
                 <Eye className="w-7 h-7 text-[#9B8924]" />
               </div>
               <h3 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Vision</h3>
               <p className="text-[#0A0A0A]/60 leading-relaxed mb-8 flex-grow">
                 To build a future where every Nigerian, home or abroad, has the power to own land, build wealth, and take control of their tomorrow.
               </p>
               <Link to="/properties" className="inline-flex items-center text-[#0A0A0A] font-semibold text-sm hover:text-[#9B8924] transition-colors group">
                 View properties <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             {/* Core Values */}
             <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mb-8">
                 <ShieldCheck className="w-7 h-7 text-[#9B8924]" />
               </div>
               <h3 className="text-3xl text-[#0A0A0A] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Core Values</h3>
               <ul className="text-[#0A0A0A]/60 leading-relaxed space-y-3 mb-8 flex-grow w-full">
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Trust Is Everything</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Everyone Deserves a Start</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Keep It Simple</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Security Matters</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9B8924]" /> Grow Together</li>
               </ul>
               <Link to="/contact" className="inline-flex items-center text-[#0A0A0A] font-semibold text-sm hover:text-[#9B8924] transition-colors group">
                 Join our team <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 6. Featured properties */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 max-w-2xl text-center mx-auto">
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Investments</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Featured Opportunities
            </h2>
            <p className="text-lg text-[#0A0A0A]/60">Hand-picked investments currently open for funding.</p>
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
              <Building2 className="w-10 h-10 text-[#0A0A0A]/20 mx-auto mb-4" />
              <p className="text-[#0A0A0A]/50 font-medium mb-6">No active properties available at the moment. Check back soon for new opportunities.</p>
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
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#FAF8F5] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto mb-32 relative z-10 text-center">
          <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Audience</p>
          <h2 className="text-4xl md:text-5xl text-[#0A0A0A] mb-12" style={{ fontFamily: 'Georgia, serif' }}>
            Who Is It For?
          </h2>
          <WhoIsItFor />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Why Terrashare</p>
              <h2 className="text-4xl md:text-5xl text-[#0A0A0A] mb-8 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
                Why People Love TerraShare
              </h2>
              <p className="text-lg text-[#0A0A0A]/60 mb-10 leading-relaxed">
                We're changing how Nigerians invest in and own property, making it accessible, secure, and transparent.
              </p>
              <Link 
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0A0A0A] px-8 text-sm font-bold text-white transition-transform hover:scale-105 shadow-lg shadow-black/10"
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
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#FAF8F5] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start relative z-10">
          <div className="lg:col-span-5">
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Support</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 mb-10 leading-relaxed">
              Your questions matter—explore our FAQs to get the answers you need.
            </p>
            <Link 
              to="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-transparent border border-[#0A0A0A]/20 px-8 text-sm font-bold text-[#0A0A0A] transition-colors hover:bg-gray-50 mb-12 shadow-sm"
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
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#0A0A0A] text-white overflow-hidden text-center">
        {/* Subtle grid background for dark mode */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl text-white mb-10 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
            Start building your real estate portfolio today.
          </h2>
          <Link 
            to="/signup"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-sm font-bold text-[#0A0A0A] transition-transform hover:scale-105 shadow-xl"
          >
            Invest Now
          </Link>
        </div>
      </section>
    </div>
  );
}
