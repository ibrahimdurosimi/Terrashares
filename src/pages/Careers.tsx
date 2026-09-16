import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Presentation, 
  Building2,
  Award,
  Share2,
  Mail,
  MessageSquare,
  Check,
  GraduationCap
} from 'lucide-react';
import { JOB_OPENINGS, FEATURED_JOB } from '../utils/careerUtils';
import { JobApplicationForm } from '../components/careers/JobApplicationForm';

export default function Careers() {
  const [selectedJobId, setSelectedJobId] = useState<string>(FEATURED_JOB.id);
  const [activeResponsibilityCategory, setActiveResponsibilityCategory] = useState<string>('all');

  const selectedJob = JOB_OPENINGS.find(j => j.id === selectedJobId) || FEATURED_JOB;

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveResponsibilityCategory('all');
  };

  const scrollToApply = (jobId?: string) => {
    if (jobId) {
      setSelectedJobId(jobId);
      setActiveResponsibilityCategory('all');
    }
    const el = document.getElementById('apply-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category icons mapping
  const getCategoryIcon = (categoryName: string) => {
    const lower = categoryName.toLowerCase();
    if (lower.includes('personal') || lower.includes('admin') || lower.includes('calendar')) {
      return <Calendar className="w-5 h-5" />;
    }
    if (lower.includes('business') || lower.includes('development') || lower.includes('presentation')) {
      return <Presentation className="w-5 h-5 text-[#9ABA1B]" />;
    }
    if (lower.includes('social')) {
      return <Share2 className="w-5 h-5 text-[#9ABA1B]" />;
    }
    if (lower.includes('email')) {
      return <Mail className="w-5 h-5 text-[#9ABA1B]" />;
    }
    if (lower.includes('community')) {
      return <MessageSquare className="w-5 h-5 text-[#9ABA1B]" />;
    }
    return <Briefcase className="w-5 h-5 text-[#9ABA1B]" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#171717]">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-[#F5F8E8] dark:bg-[#111] border-b border-black/5 dark:border-white/5">
        {/* Decorative background watermarks */}
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
            <span>We're Hiring • {JOB_OPENINGS.length} Active Positions in Lagos</span>
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
            We are democratizing property investment and commercial construction across Nigeria. Join our fast-scaling team in high-impact roles offering direct leadership mentorship and tangible growth.
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
              <span>Lagos, Nigeria • Hybrid</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/10">
              <Clock className="w-4 h-4 text-[#9ABA1B]" />
              <span>Full-time & Internship Tracks</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-full shadow-sm border border-black/5 dark:border-white/10">
              <Briefcase className="w-4 h-4 text-[#9ABA1B]" />
              <span>Direct Leadership Mentorship</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. OPEN ROLES SELECTOR TABS */}
      <section className="px-4 sm:px-6 lg:px-10 pt-12 pb-6 bg-white dark:bg-[#171717]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#9ABA1B]">
                Open Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                Explore Available Roles
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#171717]/60 dark:text-white/60">
              Click a role to inspect responsibilities, criteria, and apply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {JOB_OPENINGS.map(job => {
              const isSelected = job.id === selectedJobId;
              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job.id)}
                  className={`p-6 rounded-3xl border text-left cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-[#9ABA1B] bg-[#9ABA1B]/5 dark:bg-[#9ABA1B]/10 shadow-lg ring-2 ring-[#9ABA1B]'
                      : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-gray-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isSelected
                          ? 'bg-[#9ABA1B] text-white'
                          : 'bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300'
                      }`}>
                        {job.employment_type}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                        {job.workplace_type}
                      </span>
                    </div>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#9ABA1B]">
                        <Check className="w-4 h-4" /> Active Viewing
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 group-hover:text-black">
                        Click to view details →
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#171717] dark:text-white mb-2 leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#171717]/70 dark:text-white/70 line-clamp-2 mb-4 leading-relaxed">
                    {job.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-3 border-t border-black/5 dark:border-white/10 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#9ABA1B]" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#9ABA1B]" /> {job.experience_level}
                    </span>
                    {job.reports_to && (
                      <span className="flex items-center gap-1 text-[#9ABA1B] font-semibold">
                        • Reports to: {job.reports_to}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ACTIVE POSITION HIGHLIGHT HERO CARD */}
      <section className="px-4 sm:px-6 lg:px-10 py-6 md:py-10 bg-white dark:bg-[#171717]">
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
                    {selectedJob.department}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90">
                    {selectedJob.employment_type}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  {selectedJob.title}
                </h2>

                <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                  {selectedJob.summary}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Location</span>
                    <strong className="text-white">{selectedJob.location}</strong>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Experience</span>
                    <strong className="text-white">{selectedJob.experience_level}</strong>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Schedule</span>
                    <strong className="text-white">{selectedJob.workplace_type}</strong>
                  </div>
                  <div>
                    <span className="block text-white/40 text-[11px] uppercase tracking-wider font-semibold">Reports To</span>
                    <strong className="text-[#9ABA1B]">{selectedJob.reports_to || 'Leadership'}</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => scrollToApply(selectedJob.id)}
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

          {/* 4. KEY RESPONSIBILITIES BREAKDOWN */}
          <div id="responsibilities" className="pt-4 scroll-mt-28 mb-16">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9ABA1B]">
                What You Will Do
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                Key Responsibilities
              </h3>
              <p className="text-sm text-[#171717]/60 dark:text-white/60 mt-2">
                Detailed scope of deliverables for the <strong className="text-[#171717] dark:text-white">{selectedJob.title}</strong> role.
              </p>
            </div>

            {/* Responsibility Category Tabs */}
            {selectedJob.responsibilities.length > 1 && (
              <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                <div className="bg-gray-100 dark:bg-[#252525] p-1.5 rounded-full flex gap-1">
                  <button
                    onClick={() => setActiveResponsibilityCategory('all')}
                    className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                      activeResponsibilityCategory === 'all'
                        ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                        : 'text-[#171717]/60 dark:text-white/60 hover:text-[#171717] dark:hover:text-white'
                    }`}
                  >
                    All Areas ({selectedJob.responsibilities.reduce((acc, cat) => acc + cat.items.length, 0)})
                  </button>
                  {selectedJob.responsibilities.map(cat => (
                    <button
                      key={cat.category}
                      onClick={() => setActiveResponsibilityCategory(cat.category)}
                      className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                        activeResponsibilityCategory === cat.category
                          ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717] shadow-sm'
                          : 'text-[#171717]/60 dark:text-white/60 hover:text-[#171717] dark:hover:text-white'
                      }`}
                    >
                      {cat.category} ({cat.items.length})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedJob.responsibilities
                .filter(cat => activeResponsibilityCategory === 'all' || activeResponsibilityCategory === cat.category)
                .map((cat, catIdx) => (
                  <div 
                    key={cat.category}
                    className={`bg-[#F5F8E8]/60 dark:bg-white/[0.03] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 ${
                      activeResponsibilityCategory !== 'all' ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#171717] dark:bg-white text-white dark:text-[#171717] flex items-center justify-center font-bold shadow-md">
                        {getCategoryIcon(cat.category)}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                          {cat.category}
                        </h4>
                        <p className="text-xs text-[#171717]/60 dark:text-white/60">
                          {cat.items.length} core deliverables
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-4">
                      {cat.items.map((item, idx) => (
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
                ))}
            </div>
          </div>

          {/* 5. REQUIREMENTS & WHAT WE OFFER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Requirements (Col 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-2 text-[#9ABA1B] text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Eligibility Checklist</span>
              </div>
              <h3 className="text-2xl font-black text-[#171717] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                Requirements
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                What we look for in prospective candidates for this position.
              </p>

              <ul className="space-y-3.5">
                {selectedJob.requirements.map((req, idx) => (
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
                  {selectedJob.nice_to_have.map((item, idx) => (
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
                  {selectedJob.benefits.map((benefit, idx) => (
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

          {/* 6. APPLICATION FORM SECTION */}
          <div id="apply-section" className="scroll-mt-24 mb-16">
            <JobApplicationForm 
              selectedJobId={selectedJobId} 
              onJobChange={(jobId) => setSelectedJobId(jobId)} 
            />
          </div>

          {/* 7. FAQ & CANDIDATE GUIDANCE */}
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
                  Can current students or NYSC corps members apply?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Yes, absolutely. The <strong>Digital Marketing Intern</strong> role is explicitly open to current students and recent graduates looking for a 6-month stipend-paid learning experience. Proactive NYSC corps members with strong communication skills are also welcomed for both tracks.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  How is the hybrid work schedule structured?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Our office is at Block C270, Ikota Shopping Complex, Ajah, Lagos. You will split time between collaborative in-office sessions (team reviews, site visits, or executive meetings) and flexible remote work days.
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  What is the recruitment timeline?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Applications are reviewed on a rolling basis. Suitable candidates will receive an invitation for an introductory screening call within 3–5 business days, followed by a final discussion with the respective hiring lead (Growth Manager or CEO).
                </p>
              </div>

              <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                <h4 className="font-bold text-[#171717] dark:text-white mb-2">
                  How do I track my submitted application?
                </h4>
                <p className="text-[#171717]/70 dark:text-white/70 leading-relaxed text-xs sm:text-sm">
                  Immediately upon completing the form, you will receive a unique tracking code (e.g., TS-APP-2026-XXXX). Our recruitment team logs every submission and follows up directly via email and phone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
