import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Building2, Users, ShieldCheck, Search, BarChart3, Clock, Percent, CheckCircle2, Target, Eye, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { isPropertyPublished } from '../utils/propertyUtils';
import teamHumanTouchImg from '../assets/images/regenerated_image_1787233145158.png';
import aboutTerrashareImg from '../assets/images/regenerated_image_1787234208742.jpg';

type Property = Database['public']['Tables']['properties']['Row'];

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState({ 
    props: 20, 
    invested: 2000000000, 
    experience: 15,
    avgRoi: 16 
  });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      const itemWidth = clientWidth / 2;
      const pageIndex = Math.round(scrollLeft / (itemWidth * 2));
      setCurrentSlide(pageIndex);
    }
  };

  const scrollMobile = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const scrollToSlide = (pageIndex: number) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * pageIndex;
    carouselRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    async function fetchHomeData() {
      // Fetch open properties
      const { data: props } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
        
      if (props && props.length > 0) {
        const published = props.filter(isPropertyPublished).slice(0, 6);
        setFeaturedProperties(published);
      }

      const { count: propsCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
      
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

      // Set stats with Nigerian investment metrics
      setStats({
        props: propsCount && propsCount > 0 ? propsCount : 20,
        invested: 2000000000,
        experience: 15,
        avgRoi: avgRoi > 0 ? Math.round(avgRoi) : 16
      });
    }
    
    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SocialProofToast />
      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 -mt-20 pt-28 pb-0 overflow-hidden bg-white dark:bg-[#171717]">
        {/* Large Brand Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
          <Building2 className="w-full h-full text-[#9ABA1B]" />
        </div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-6 md:mb-8 max-w-4xl tracking-tight text-[#171717] dark:text-white">
            Invest in <AnimatedHeroText /><br/>build your <span className="text-[#9ABA1B] italic" style={{ fontFamily: 'Georgia, serif' }}>future.</span>
          </h1>
          
          <p className="text-lg md:text-[20px] leading-[28px] md:leading-[30px] font-sans text-center font-normal text-[#171717] dark:text-gray-300 no-underline not-italic w-[650px] max-w-full mb-8 md:mb-12 px-2">
            Fractional real estate investment platform. Secure, transparent, and built for everyone to grow their wealth through high-yield assets.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              to="/properties"
              className="w-full sm:w-auto px-8 py-4 border-2 border-[#171717]/10 dark:border-white/10 text-[#171717] dark:text-white rounded-full font-bold flex items-center justify-center gap-2 hover:border-[#171717] transition-colors bg-white/50 dark:bg-[#171717]/50 backdrop-blur-sm"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/properties"
              className="w-full sm:w-auto px-8 py-4 bg-[#9ABA1B] text-[#171717] rounded-full font-bold shadow-xl shadow-[#9ABA1B]/20 hover:bg-[#85A316] transition-colors"
            >
              Invest Now
            </Link>
          </div>
        </div>

        {/* Realistic Lagos skyline */}
        <div className="absolute bottom-0 left-0 right-0 w-full h-64 md:h-[500px] z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#171717] dark:via-[#171717]/80 dark:to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Lagos Skyline" 
            className="w-full h-full object-cover grayscale opacity-30 mix-blend-multiply dark:mix-blend-screen dark:opacity-20" 
          />
        </div>
      </section>

      {/* 3. Stats Bar */}
      <div className="bg-white dark:bg-[#171717] pb-16">
        <div className="px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
          {stats.props === 0 ? (
            <div className="border-t border-b border-[#171717]/10 dark:border-white/10 py-12 text-center w-full">
              <p className="text-xl md:text-2xl font-bold text-[#171717]/60 dark:text-white/60 italic" style={{ fontFamily: 'Georgia, serif' }}>
                Now open for our first investors.
              </p>
            </div>
          ) : (
            <div className="w-full border-t border-b border-[#171717]/10 dark:border-white/10 py-12 relative">
              {/* Floating element */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#9ABA1B]/40 blur-md"></motion.div>
              
              <div className="flex flex-wrap justify-around items-center gap-8 md:gap-12 w-full max-w-6xl mx-auto">
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#171717] dark:text-white mb-1">
                    <AnimatedCounter value={stats.props} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#171717]/50 dark:text-white/50 mt-2">Properties</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#171717] dark:text-white mb-1">
                    <AnimatedCounter value={stats.invested} prefix="₦" isCurrency={true} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#171717]/50 dark:text-white/50 mt-2">Investment Opportunity</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#171717] dark:text-white mb-1">
                    <AnimatedCounter value={stats.experience} prefix="Over " suffix=" Yrs" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#171717]/50 dark:text-white/50 mt-2">Industry Experience</div>
                </div>
                <div className="text-center px-2">
                  <div className="text-3xl md:text-5xl font-black text-[#171717] dark:text-white mb-1">
                    <AnimatedCounter value={stats.avgRoi} suffix="%" />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#171717]/50 dark:text-white/50 mt-2">Avg Returns</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 8. About TerraShare section */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#F5F8E8] dark:bg-[#111] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20 items-center">
            <div>
              <p className="text-[#9ABA1B] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">About Terrashare</p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl text-[#171717] dark:text-white leading-[1.1] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Property ownership shouldn't be out of reach.
              </h2>
              <p className="text-lg text-[#171717] dark:text-white/70 leading-relaxed mb-8">
                For too long, it’s felt like something only the wealthy could afford. We’re here to change that, for good. We’re a passionate team working to change the way land is owned in Nigeria.
              </p>
              <Link 
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#171717] dark:bg-white dark:bg-[#171717] px-8 text-sm font-bold text-white dark:text-[#171717] dark:text-white transition-transform hover:scale-105 shadow-lg"
              >
                Learn our story
              </Link>
            </div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl h-[300px] md:h-[400px]">
              <img src={aboutTerrashareImg} alt="Modern Nigerian Real Estate" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
             {/* Mission */}
             <div className="bg-white dark:bg-[#171717] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#171717]/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <Target className="w-7 h-7 text-[#9ABA1B]" />
               </div>
               <h3 className="text-3xl text-[#171717] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Mission</h3>
               <p className="text-[#171717]/60 dark:text-white/60 leading-relaxed mb-8 flex-grow">
                 To make land ownership possible for everyday Nigerians by using smart technology to deliver safe, simple, and affordable investments, one unit at a time.
               </p>
               <Link to="/about" className="inline-flex items-center text-[#171717] dark:text-white font-semibold text-sm hover:text-[#9ABA1B] transition-colors group">
                 Read more <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             {/* Vision */}
             <div className="bg-white dark:bg-[#171717] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#171717]/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <Eye className="w-7 h-7 text-[#9ABA1B]" />
               </div>
               <h3 className="text-3xl text-[#171717] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Vision</h3>
               <p className="text-[#171717]/60 dark:text-white/60 leading-relaxed mb-8 flex-grow">
                 To build a future where every Nigerian, home or abroad, has the power to own land, build wealth, and take control of their tomorrow.
               </p>
               <Link to="/properties" className="inline-flex items-center text-[#171717] dark:text-white font-semibold text-sm hover:text-[#9ABA1B] transition-colors group">
                 View properties <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             {/* Core Values */}
             <div className="bg-white dark:bg-[#171717] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 flex flex-col items-start hover:-translate-y-2 transition-transform duration-500">
               <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#171717]/5 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center mb-8">
                 <ShieldCheck className="w-7 h-7 text-[#9ABA1B]" />
               </div>
               <h3 className="text-3xl text-[#171717] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>Core Values</h3>
               <ul className="text-[#171717]/60 dark:text-white/60 leading-relaxed space-y-3 mb-8 flex-grow w-full">
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9ABA1B]" /> Trust Is Everything</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9ABA1B]" /> Everyone Deserves a Start</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9ABA1B]" /> Keep It Simple</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9ABA1B]" /> Security Matters</li>
                 <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#9ABA1B]" /> Grow Together</li>
               </ul>
               <Link to="/contact" className="inline-flex items-center text-[#171717] dark:text-white font-semibold text-sm hover:text-[#9ABA1B] transition-colors group">
                 Join our team <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>
          </div>
        </div>
      </section>

      {/* 7.5 Chat With Our Team */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-20 bg-white dark:bg-[#171717] overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[15vw] font-black text-[#171717]/[0.02] dark:text-white/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
          CONNECT
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <div>
            <p className="text-[#9ABA1B] font-bold text-[16px] leading-[18px] tracking-[0.2em] uppercase mb-4">Human Touch</p>
            <h2 className="text-3xl md:text-5xl text-[#171717] dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              We're real people,<br/>here to help.
            </h2>
            <p className="text-[18px] sm:text-[20px] font-sans leading-relaxed text-[#171717]/60 dark:text-white/60 mb-8 max-w-lg">
              Investing in real estate is a big decision. That's why our dedicated Nigerian investment team is always available to answer your questions, guide you through properties, and ensure your capital is secure.
            </p>
            <div className="flex gap-4 items-center">
              <a 
                href="https://wa.me/2348097701222" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#9ABA1B] text-[#171717] rounded-full font-bold shadow-xl shadow-[#9ABA1B]/20 hover:bg-[#85A316] transition-colors inline-flex items-center gap-2"
              >
                Chat With Our Team
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src={teamHumanTouchImg} 
                alt="Our Team" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex -space-x-4 mb-3">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80" alt="Team member" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
                  <img src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&h=200&q=80" alt="Team member" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
                  <img src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=200&h=200&q=80" alt="Team member" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#9ABA1B] flex items-center justify-center text-white font-bold text-sm shadow-md">+15</div>
                </div>
                <p className="text-white font-medium text-sm drop-shadow-sm">Our Nigerian advisory team replies in under 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured properties */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-white dark:bg-[#171717] overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14">
            <div>
              <p className="text-[#9ABA1B] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3">Investments</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#171717] dark:text-white leading-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Featured Opportunities
              </h2>
              <p className="text-base sm:text-lg text-[#171717]/60 dark:text-white/60">Hand-picked investments currently open for funding.</p>
            </div>

            {/* Mobile Carousel Controls */}
            {featuredProperties.length > 2 && (
              <div className="flex md:hidden items-center justify-between mt-4 pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  Swipe or use arrows to view more
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollMobile('left')}
                    disabled={!canScrollLeft}
                    aria-label="Previous properties"
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                      canScrollLeft 
                        ? 'bg-white dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-800 dark:text-white shadow-sm active:scale-95' 
                        : 'opacity-30 border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollMobile('right')}
                    disabled={!canScrollRight}
                    aria-label="Next properties"
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                      canScrollRight 
                        ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] border-transparent shadow-sm active:scale-95' 
                        : 'opacity-30 border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Browse Link */}
            <div className="hidden md:block">
              <Link 
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/10 dark:border-white/10 text-sm font-bold text-[#171717] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Browse all properties <ArrowRight className="w-4 h-4 text-[#9ABA1B]" />
              </Link>
            </div>
          </div>
          
          {featuredProperties.length > 0 ? (
            <div>
              {/* Desktop: 3 in a row grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
                {featuredProperties.map(property => (
                  <div key={property.id} className="hover:-translate-y-2 transition-transform duration-500 h-full">
                    <PropertyCard property={property as any} />
                  </div>
                ))}
              </div>

              {/* Mobile: 2-column Horizontal Carousel */}
              <div className="md:hidden">
                <div 
                  ref={carouselRef}
                  onScroll={checkScroll}
                  className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {featuredProperties.map(property => (
                    <div 
                      key={property.id} 
                      className="w-[calc(50%-6px)] shrink-0 snap-start flex flex-col"
                    >
                      <PropertyCard property={property as any} />
                    </div>
                  ))}
                </div>

                {/* Mobile Pagination Dots */}
                {featuredProperties.length > 2 && (
                  <div className="flex items-center justify-center gap-1.5 mt-4">
                    {Array.from({ length: Math.ceil(featuredProperties.length / 2) }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentSlide === idx 
                            ? 'w-6 bg-[#9ABA1B]' 
                            : 'w-2 bg-gray-300 dark:bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto">
              <Building2 className="w-10 h-10 text-[#171717]/20 dark:text-white/20 mx-auto mb-4" />
              <p className="text-[#171717]/50 dark:text-white/50 font-medium mb-6">No active properties available at the moment. Check back soon for new opportunities.</p>
              <Link 
                to="/properties"
                className="inline-flex items-center text-[#9ABA1B] font-bold hover:opacity-70 transition-opacity"
              >
                Browse all properties <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}

          {/* Mobile Bottom CTA */}
          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/properties"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-white/5 text-sm font-bold text-[#171717] dark:text-white hover:bg-gray-200 transition-colors"
            >
              Browse all properties <ArrowRight className="w-4 h-4 text-[#9ABA1B]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. How It Works */}
      <HowItWorks />

      {/* 9. Who Is It For + Why People Love TerraShare */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#F5F8E8] dark:bg-[#111] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto mb-32 relative z-10 text-center">
          <p className="text-[#9ABA1B] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Audience</p>
          <h2 className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-12" style={{ fontFamily: 'Georgia, serif' }}>
            Who Is It For?
          </h2>
          <WhoIsItFor />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <p className="text-[#9ABA1B] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Why Terrashare</p>
              <h2 className="text-3xl md:text-5xl text-[#171717] dark:text-white mb-8 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
                Why People Love TerraShare
              </h2>
              <p className="text-lg text-[#171717]/60 dark:text-white/60 mb-10 leading-relaxed">
                We're changing how Nigerians invest in and own property, making it accessible, secure, and transparent.
              </p>
              <Link 
                to="/about"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#171717] dark:bg-white dark:bg-[#171717] px-8 text-sm font-bold text-white dark:text-[#171717] dark:text-white transition-transform hover:scale-105 shadow-lg shadow-black/10"
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
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#F5F8E8] dark:bg-[#111] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start relative z-10">
          <div className="lg:col-span-5">
            <p className="text-[#9ABA1B] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Support</p>
            <h2 className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#171717]/60 dark:text-white/60 mb-10 leading-relaxed">
              Your questions matter—explore our FAQs to get the answers you need.
            </p>
            <Link 
              to="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-transparent border border-[#171717]/20 px-8 text-sm font-bold text-[#171717] dark:text-white transition-colors hover:bg-gray-50 dark:bg-white/5 dark:bg-white dark:bg-[#171717]/5 mb-12 shadow-sm"
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
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#171717] dark:bg-white dark:bg-[#171717] text-white dark:text-[#171717] dark:text-white overflow-hidden text-center">
        {/* Subtle grid background for dark mode */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl text-white mb-10 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
            Start building your real estate portfolio today.
          </h2>
          <Link 
            to="/properties"
            className="inline-flex h-14 items-center justify-center rounded-full bg-white dark:bg-[#171717] px-10 text-sm font-bold text-[#171717] dark:text-white transition-transform hover:scale-105 shadow-xl"
          >
            Invest Now
          </Link>
        </div>
      </section>
    </div>
  );
}
