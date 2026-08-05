import { Target, Eye, ShieldCheck, Globe, Users, Lightbulb, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#171717]">
      {/* 1. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-40 pb-20 overflow-hidden bg-white dark:bg-[#171717]">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
          <Building2 className="w-[500px] h-[500px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#9ABA1B] text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-6"
          >
            Our Story
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-[#171717] dark:text-white mb-8 leading-[1.1]" 
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Democratizing Real Estate for <span className="text-[#9ABA1B] italic">Everyone.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#171717]/60 dark:text-white/60 max-w-3xl mx-auto leading-relaxed"
          >
            Terrashare was built on a simple belief: wealth-building through property shouldn’t be a privilege reserved for the 1%. We are breaking down borders, reducing barriers, and making global real estate accessible.
          </motion.p>
        </div>
      </section>

      {/* 2. The Problem & Solution */}
      <section className="px-4 sm:px-6 lg:px-10 py-24 bg-white dark:bg-[#171717]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#9ABA1B]/20 to-transparent rounded-[2rem] transform -translate-x-4 translate-y-4"></div>
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Modern Real Estate" 
              className="relative z-10 w-full h-[500px] object-cover rounded-[2rem] shadow-xl grayscale-[20%]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-8 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              Bridging the gap in property investment
            </h2>
            <div className="space-y-6 text-lg text-[#171717] dark:text-white/70 leading-relaxed">
              <p>
                Historically, investing in real estate required massive upfront capital, endless paperwork, and deep local knowledge. This left millions of hardworking individuals—from young professionals in Lagos to the diaspora community abroad—locked out of the most reliable asset class in the world.
              </p>
              <p>
                At Terrashare, we use technology to bridge this gap. By fractionalizing high-yield properties, we allow you to buy shares in premium real estate starting with an amount that fits your budget.
              </p>
              <p className="font-bold text-[#171717] dark:text-white">
                No hidden fees. No management headaches. Just secure, transparent ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="px-4 sm:px-6 lg:px-10 py-32 bg-[#171717] dark:bg-white text-white dark:text-[#171717] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 relative z-10">
          <div className="bg-white/5 dark:bg-[#171717]/5 border border-white/10 dark:border-black/10 rounded-[2rem] p-10 md:p-14 hover:bg-white/10 dark:hover:bg-[#171717]/10 transition-colors">
            <div className="w-16 h-16 bg-[#9ABA1B]/20 rounded-2xl flex items-center justify-center mb-8">
              <Target className="w-8 h-8 text-[#9ABA1B]" />
            </div>
            <h3 className="text-3xl text-white dark:text-[#171717] mb-6" style={{ fontFamily: 'Georgia, serif' }}>Our Mission</h3>
            <p className="text-lg text-white/70 dark:text-[#171717]/70 leading-relaxed">
              To empower individuals globally by providing seamless, fractional access to premium, high-yield real estate markets. We strive to create wealth opportunities for everyone through transparency and innovation.
            </p>
          </div>
          
          <div className="bg-white/5 dark:bg-[#171717]/5 border border-white/10 dark:border-black/10 rounded-[2rem] p-10 md:p-14 hover:bg-white/10 dark:hover:bg-[#171717]/10 transition-colors">
            <div className="w-16 h-16 bg-[#9ABA1B]/20 rounded-2xl flex items-center justify-center mb-8">
              <Eye className="w-8 h-8 text-[#9ABA1B]" />
            </div>
            <h3 className="text-3xl text-white dark:text-[#171717] mb-6" style={{ fontFamily: 'Georgia, serif' }}>Our Vision</h3>
            <p className="text-lg text-white/70 dark:text-[#171717]/70 leading-relaxed">
              To be the world’s most trusted real estate investment platform, where geographical boundaries and capital constraints no longer limit an individual's financial growth and prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="px-4 sm:px-6 lg:px-10 py-32 bg-[#F5F8E8] dark:bg-[#111]">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            What drives us
          </h2>
          <p className="text-lg text-[#171717]/60 dark:text-white/60 max-w-2xl mx-auto">
            Our operations are guided by strict principles that ensure your investments are safe, profitable, and aligned with your goals.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-[#9ABA1B]" />, title: "Absolute Security", desc: "Every property is vetted by top legal experts. Your capital is backed by physical assets." },
            { icon: <Globe className="w-6 h-6 text-[#9ABA1B]" />, title: "Global Access", desc: "From Lagos to London, we source the best markets for maximum yield and appreciation." },
            { icon: <Users className="w-6 h-6 text-[#9ABA1B]" />, title: "Community First", desc: "We win when you win. Our platform is built around shared growth and inclusive wealth." },
            { icon: <Lightbulb className="w-6 h-6 text-[#9ABA1B]" />, title: "Radical Transparency", desc: "No hidden charges. Clear ROI projections. Full visibility into property management." }
          ].map((value, idx) => (
            <div key={idx} className="bg-white dark:bg-[#171717] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-[#171717] dark:text-white mb-3">{value.title}</h3>
              <p className="text-[#171717]/60 dark:text-white/60 leading-relaxed text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Closing CTA */}
      <section className="px-4 sm:px-6 lg:px-10 py-32 bg-white dark:bg-[#171717] text-center">
        <div className="max-w-3xl mx-auto bg-[#9ABA1B]/20 p-12 md:p-20 rounded-[3rem] border border-[#9ABA1B]/30">
          <h2 className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-8 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to rewrite your financial future?
          </h2>
          <p className="text-lg text-[#171717] dark:text-white/70 mb-10 max-w-xl mx-auto">
            Join thousands of smart investors who are building their portfolios with Terrashare today.
          </p>
          <Link 
            to="/signup"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#171717] dark:bg-white px-10 text-sm font-bold text-white transition-transform hover:scale-105 shadow-xl shadow-black/10 gap-2"
          >
            Start Investing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
