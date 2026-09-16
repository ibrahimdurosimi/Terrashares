import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Calendar, 
  FileSpreadsheet, 
  Presentation, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Compass, 
  HelpCircle,
  Building2,
  Award,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { FEATURED_JOB } from '../utils/careerUtils';
import { JobApplicationForm } from '../components/careers/JobApplicationForm';
import { Link } from 'react-router-dom';

export default function Careers() {
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'bd'>('all');

  const scrollToApply = () => {
    const el = document.getElementById('apply-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#171717]">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#F5F8E8] dark:bg-[#111] border-b border-black/5 dark:border-white/5">
        {/* Subtle decorative background watermarks */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
          <Building2 className="w-[600px] h-[600px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9ABA1B]/15 text-[#9ABA1B] text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>We're Hiring • Executive Talent</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-[#171717] dark:text-white mb-6 leading-[1.15]" 
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Build your career with <br className="hidden sm:block" />
            <span className="text-[#9ABA1B] italic">Terrashare.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#171717]/70 dark:text-white/70 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            We are democratizing property investment and homeownership across Nigeria. Join our executive team in a high-impact, fast-growth role with direct leadership mentorship.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-[#171717]/80 dark:text-white/80"
          >
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/10">
              <MapPin className="w-4 h-4 text-[#9ABA1B]" />
              <span>Ajah, Lagos • Hybrid</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/10">
              <Clock className="w-4 h-4 text-[#9ABA1B]" />
              <span>Full-time Position</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/10">
              <Briefcase className="w-4 h-4 text-[#9ABA1B]" />
              <span>0–2 Years (Internships Count)</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OPEN POSITION HIGHLIGHT CARD */}
      <section className="px-4 sm:px-6 lg:px-10 py-12 md:py-16 bg-white dark:bg-[#171717]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#171717] dark:bg-[#202020] text-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#9ABA1B]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#9ABA1B] text-white">
                    Actively Interviewing
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90">
                    Executive Office
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90">
                    Business Development
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {FEATURED_JOB.title}
                </h2>

                <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                  {FEATURED_JOB.summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Location</span>
                    <strong className="text-white">Ajah, Lagos (Hybrid)</strong>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Experience</span>
                    <strong className="text-white">0–2 Years</strong>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Work Type</span>
                    <strong className="text-white">Hybrid Schedule</strong>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Mentorship</span>
                    <strong className="text-[#9ABA1B]">Direct CEO Access</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={scrollToApply}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#9ABA1B] hover:bg-[#85A316] text-white font-bold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#responsibilities"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors text-center"
                >
                  View Job Details ↓
                </a>
              </div>
            </div>
          </div>

          {/* 3. KEY RESPONSIBILITIES BREAKDOWN */}
          <div id="responsibilities" className="pt-4 scroll-mt-28 mb-16">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9ABA1B]">
                What You Will Do
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                Key Responsibilities
              </h3>
              <p className="text-sm text-[#171717]/60 dark:text-white/60 mt-2">
                This dual-impact role balances executive operations with frontline business development.
              </p>
            </div>

            {/* Responsibility Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 dark:bg-[#252525] p-1.5 rounded-full flex gap-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                      : 'text-[#171717]/60 dark:text-white/60 hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  All Responsibilities
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                      : 'text-[#171717]/60 dark:text-white/60 hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  Personal & Admin (7)
                </button>
                <button
                  onClick={() => setActiveTab('bd')}
                  className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'bd'
                      ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                      : 'text-[#171717]/60 dark:text-white/60 hover:text-[#171717] dark:hover:text-white'
                  }`}
                >
                  Business Development (6)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category 1: Personal & Administrative Support */}
              {(activeTab === 'all' || activeTab === 'admin') && (
                <div className={`bg-[#F5F8E8]/60 dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 ${activeTab === 'admin' ? 'md:col-span-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#9ABA1B] text-white flex items-center justify-center font-bold shadow-md">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                        Personal & Administrative Support
                      </h4>
                      <p className="text-xs text-[#171717]/60 dark:text-white/60">
                        Executive office coordination & CEO liaison
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {FEATURED_JOB.responsibilities[0].items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#9ABA1B]/20 text-[#9ABA1B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-[#171717]/80 dark:text-white/80 leading-relaxed font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Category 2: Business Development Support */}
              {(activeTab === 'all' || activeTab === 'bd') && (
                <div className={`bg-[#F5F8E8]/60 dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 ${activeTab === 'bd' ? 'md:col-span-2' : ''}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] flex items-center justify-center font-bold shadow-md">
                      <Presentation className="w-6 h-6 text-[#9ABA1B]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                        Business Development Support
                      </h4>
                      <p className="text-xs text-[#171717]/60 dark:text-white/60">
                        Pitch decks, client scheduling & CRM intelligence
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {FEATURED_JOB.responsibilities[1].items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#171717]/10 dark:bg-white/10 text-[#171717] dark:text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-[#171717]/80 dark:text-white/80 leading-relaxed font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 4. REQUIREMENTS & NICE TO HAVE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Requirements (Col 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-2 text-[#9ABA1B] text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Eligibility Checklist</span>
              </div>
              <h3 className="text-2xl font-black text-[#171717] dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                Requirements
              </h3>

              <ul className="space-y-3.5">
                {FEATURED_JOB.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-[#171717]/80 dark:text-white/80 leading-relaxed font-medium">
                      {req}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to Have & What We Offer (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Nice to Have */}
              <div className="bg-[#F5F8E8] dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2 text-[#9ABA1B] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Bonus Attributes</span>
                </div>
                <h3 className="text-xl font-black text-[#171717] dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Nice to Have
                </h3>
                <ul className="space-y-3">
                  {FEATURED_JOB.nice_to_have.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#9ABA1B] shrink-0 mt-2" />
                      <span className="text-sm text-[#171717]/80 dark:text-white/80 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We Offer */}
              <div className="bg-[#171717] text-white rounded-3xl p-6 sm:p-8 border border-white/5">
                <div className="flex items-center gap-2 text-[#9ABA1B] text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  <span>Perks & Growth</span>
                </div>
                <h3 className="text-xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  What We Offer
                </h3>
                <ul className="space-y-3.5">
                  {FEATURED_JOB.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#9ABA1B]/20 text-[#9ABA1B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-sm text-white/90 leading-relaxed font-medium">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5. APPLICATION SECTION */}
          <div id="apply-section" className="scroll-mt-24 mb-16">
            <JobApplicationForm />
          </div>

          {/* 6. FAQ & CANDIDATE GUIDANCE */}
          <div className="bg-[#F5F8E8] dark:bg-white/[0.02] rounded-3xl p-8 md:p-12 border border-black/5 dark:border-white/10 mb-8">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9ABA1B]">
                Common Questions
              </span>
              <h3 className="text-2xl font-black text-[#171717] dark:text-white mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                Application & Hiring FAQs
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  Can fresh graduates or corps members (NYSC) apply?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Yes, absolutely. We welcome proactive graduates and corps members with strong communication, organization, and presentation skills. Practical drive and attention to detail matter most.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  How does the hybrid work arrangement work?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Our office is located at Block C270, Ikota Shopping Complex, Ajah. You will split time between in-person executive coordination/site visits and focused remote work days.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  What is the recruitment timeline?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Applications are reviewed on a rolling basis. Suitable candidates receive an invitation for an initial screening call within 3–5 business days, followed by a final in-person interview with the CEO.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  How will I know if my application was received?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Immediately upon submitting the form, you will receive a unique tracking ID on-screen. Our hiring team logs all entries and communicates via email and phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
