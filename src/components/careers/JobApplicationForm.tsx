import React, { useState, useRef } from 'react';
import { 
  Send, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Linkedin, 
  Globe, 
  Calendar, 
  Clock, 
  X, 
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JOB_OPENINGS, FEATURED_JOB, submitJobApplication } from '../../utils/careerUtils';

interface JobApplicationFormProps {
  selectedJobId?: string;
  onJobChange?: (jobId: string) => void;
  onSuccess?: (appId: string) => void;
}

export function JobApplicationForm({ selectedJobId, onJobChange, onSuccess }: JobApplicationFormProps) {
  const [currentJobId, setCurrentJobId] = useState<string>(selectedJobId || FEATURED_JOB.id);

  // Sync if selectedJobId changes externally
  React.useEffect(() => {
    if (selectedJobId && selectedJobId !== currentJobId) {
      setCurrentJobId(selectedJobId);
    }
  }, [selectedJobId]);

  const currentJob = JOB_OPENINGS.find(j => j.id === currentJobId) || FEATURED_JOB;

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    qualification: "Bachelor's degree",
    experience_years: '0–1 year',
    linkedin_url: '',
    portfolio_url: '',
    availability: 'Immediate',
    cover_note: '',
  });

  const [industryExposure, setIndustryExposure] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeLink, setResumeLink] = useState('');
  const [useResumeLink, setUseResumeLink] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleIndustryExposure = (item: string) => {
    setIndustryExposure(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document (.pdf, .docx, .doc)' }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: 'File size must be under 10MB' }));
      return;
    }
    setResumeFile(file);
    setErrors(prev => {
      const rest = { ...prev };
      delete rest.resume;
      return rest;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Current location (city/state) is required';
    if (!formData.cover_note.trim() || formData.cover_note.trim().length < 30) {
      newErrors.cover_note = 'Please provide at least 30 characters sharing why you are a great fit';
    }
    if (!useResumeLink && !resumeFile) {
      newErrors.resume = 'Please upload your CV/Resume or provide a link';
    } else if (useResumeLink && !resumeLink.trim()) {
      newErrors.resume = 'Please provide a valid link to your CV/Resume (Google Drive, Dropbox, etc.)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitJobApplication({
        job_id: currentJob.id,
        job_title: currentJob.title,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        qualification: formData.qualification,
        experience_years: formData.experience_years,
        linkedin_url: formData.linkedin_url.trim() || undefined,
        portfolio_url: formData.portfolio_url.trim() || undefined,
        resume_name: resumeFile ? resumeFile.name : undefined,
        resume_size: resumeFile ? formatFileSize(resumeFile.size) : undefined,
        resume_url: useResumeLink ? resumeLink.trim() : undefined,
        cover_note: formData.cover_note.trim(),
        availability: formData.availability,
        industry_exposure: industryExposure,
      });

      if (result.success) {
        setSubmittedAppId(result.applicationId);
        if (onSuccess) onSuccess(result.applicationId);
      } else {
        setErrors(prev => ({ ...prev, submit: result.error || 'Failed to submit application. Please try again.' }));
      }
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setErrors(prev => ({ ...prev, submit: 'An unexpected error occurred. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedAppId) {
    const isInternship = currentJob.id === 'digital-marketing-intern';
    return (
      <div id="application-success" className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 md:p-12 shadow-xl border border-black/5 dark:border-white/10 text-center">
        <div className="w-20 h-20 bg-[#9ABA1B]/15 text-[#9ABA1B] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#9ABA1B]/10 text-[#9ABA1B] mb-4">
          Application Received
        </span>
        <h3 className="text-3xl font-black text-[#171717] dark:text-white mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Thank You, {formData.full_name}!
        </h3>
        <p className="text-[#171717]/70 dark:text-white/70 max-w-lg mx-auto mb-6 text-base leading-relaxed">
          Your application for <strong className="text-[#171717] dark:text-white">{currentJob.title}</strong> has been successfully registered under tracking code:
        </p>
        
        <div className="inline-block bg-[#F5F8E8] dark:bg-[#252525] border border-[#9ABA1B]/30 rounded-2xl px-6 py-3 font-mono text-lg font-bold text-[#171717] dark:text-white mb-8 select-all">
          {submittedAppId}
        </div>

        <div className="max-w-md mx-auto text-left bg-gray-50 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-black/5 dark:border-white/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#171717]/50 dark:text-white/50 mb-3">
            What Happens Next?
          </h4>
          <ul className="space-y-3 text-sm text-[#171717]/80 dark:text-white/80">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#9ABA1B]/20 text-[#9ABA1B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
              <span><strong>Review:</strong> Our hiring team reviews your profile, portfolio, and experience within 3–5 business days.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#9ABA1B]/20 text-[#9ABA1B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
              <span><strong>Screening:</strong> Shortlisted applicants will be invited for a 20-minute video or phone chat with the hiring lead ({isInternship ? 'Growth Manager' : 'Executive Team'}).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#9ABA1B]/20 text-[#9ABA1B] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
              <span><strong>Final Interview:</strong> Finalists participate in an in-person or video interview ({isInternship ? 'Growth team review & task showcase' : 'Direct interview with the CEO'}).</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => {
            setSubmittedAppId(null);
            setFormData({
              full_name: '',
              email: '',
              phone: '',
              location: '',
              qualification: "Bachelor's degree",
              experience_years: '0–1 year',
              linkedin_url: '',
              portfolio_url: '',
              availability: 'Immediate',
              cover_note: '',
            });
            setResumeFile(null);
            setResumeLink('');
            setIndustryExposure([]);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#171717] dark:bg-white text-white dark:text-[#171717] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  const roleTags = currentJob.id === 'digital-marketing-intern'
    ? [
        'Social Media Management (IG/FB/LinkedIn)',
        'Canva & Graphic Design',
        'Email Campaigns & Newsletters',
        'Community Engagement & Moderation',
        'Content Copywriting',
        'Video Editing (CapCut / Reels)',
        'Real Estate & Proptech Interest'
      ]
    : [
        'Real Estate / Property',
        'Fintech / Investments',
        'Personal / Executive Assistant Role',
        'CRM & Lead Tracking Tools',
        'Client Presentations & Pitch Decks',
        'Calendar & Travel Scheduling'
      ];

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-10 shadow-xl border border-black/5 dark:border-white/10">
      {/* Position Header & Selection */}
      <div className="border-b border-black/5 dark:border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-2 text-[#9ABA1B] text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Apply Online</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
          Candidate Application Form
        </h3>
        <p className="text-sm text-[#171717]/60 dark:text-white/60 mt-1 mb-5">
          Select the opening you are applying for and fill out the details below.
        </p>

        {/* Role Selector Buttons */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#9ABA1B] mb-2.5">
            Select Target Position <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {JOB_OPENINGS.map(job => {
              const isSelected = job.id === currentJobId;
              return (
                <button
                  type="button"
                  key={job.id}
                  onClick={() => {
                    setCurrentJobId(job.id);
                    setIndustryExposure([]);
                    if (onJobChange) onJobChange(job.id);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-[#9ABA1B] bg-[#9ABA1B]/10 dark:bg-[#9ABA1B]/15 shadow-sm ring-1 ring-[#9ABA1B]'
                      : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-gray-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#9ABA1B] text-white'
                        : 'bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                    }`}>
                      {job.employment_type} • {job.workplace_type}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#9ABA1B]" />}
                  </div>
                  <div className="font-bold text-sm text-[#171717] dark:text-white leading-snug">
                    {job.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {job.department} • {job.salary_range}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errors.submit}</span>
        </div>
      )}

      {/* SECTION 1: Personal Details */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ABA1B] mb-4 flex items-center gap-2">
          <User className="w-4 h-4" /> 1. Personal & Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-error={!!errors.full_name}>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. Babatunde Adeleke"
                className={`w-full bg-[#F5F8E8]/50 dark:bg-white/5 border ${
                  errors.full_name ? 'border-red-400 focus:border-red-500' : 'border-black/10 dark:border-white/10 focus:border-[#9ABA1B]'
                } rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none transition-colors`}
              />
            </div>
            {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
          </div>

          <div data-error={!!errors.email}>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. candidate@example.com"
                className={`w-full bg-[#F5F8E8]/50 dark:bg-white/5 border ${
                  errors.email ? 'border-red-400 focus:border-red-500' : 'border-black/10 dark:border-white/10 focus:border-[#9ABA1B]'
                } rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none transition-colors`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div data-error={!!errors.phone}>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Phone / WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +234 803 000 0000"
                className={`w-full bg-[#F5F8E8]/50 dark:bg-white/5 border ${
                  errors.phone ? 'border-red-400 focus:border-red-500' : 'border-black/10 dark:border-white/10 focus:border-[#9ABA1B]'
                } rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none transition-colors`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div data-error={!!errors.location}>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Current Location (City / Area) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ajah, Lekki, or Lagos"
                className={`w-full bg-[#F5F8E8]/50 dark:bg-white/5 border ${
                  errors.location ? 'border-red-400 focus:border-red-500' : 'border-black/10 dark:border-white/10 focus:border-[#9ABA1B]'
                } rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none transition-colors`}
              />
            </div>
            {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
          </div>
        </div>
      </div>

      {/* SECTION 2: Qualifications & Experience */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ABA1B] mb-4 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> 2. Qualifications & Background
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Highest Educational Level
            </label>
            <select
              value={formData.qualification}
              onChange={e => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full bg-[#F5F8E8]/50 dark:bg-[#252525] border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
            >
              <option value="Bachelor's degree">Bachelor's Degree (B.Sc / B.A)</option>
              <option value="HND">Higher National Diploma (HND)</option>
              <option value="OND">Ordinary National Diploma (OND)</option>
              <option value="Master's / Postgrad">Master's / Postgraduate</option>
              <option value="Other">Other Equivalent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Relevant Work Experience
            </label>
            <select
              value={formData.experience_years}
              onChange={e => setFormData({ ...formData, experience_years: e.target.value })}
              className="w-full bg-[#F5F8E8]/50 dark:bg-[#252525] border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
            >
              <option value="0–1 year">0–1 Year (Entry Level / Internships)</option>
              <option value="1–2 years">1–2 Years</option>
              <option value="2–3 years">2–3 Years</option>
              <option value="3+ years">3+ Years</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5">
              Availability / Notice Period
            </label>
            <select
              value={formData.availability}
              onChange={e => setFormData({ ...formData, availability: e.target.value })}
              className="w-full bg-[#F5F8E8]/50 dark:bg-[#252525] border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
            >
              <option value="Immediate">Immediate Start</option>
              <option value="1 week">1 Week Notice</option>
              <option value="2 weeks">2 Weeks Notice</option>
              <option value="1 month">1 Month Notice</option>
            </select>
          </div>
        </div>

        {/* Nice to have checklist */}
        <div>
          <label className="block text-xs font-bold text-[#171717] dark:text-white mb-2">
            Relevant Skills & Prior Exposure (Check all that apply):
          </label>
          <div className="flex flex-wrap gap-2.5">
            {roleTags.map(item => {
              const isChecked = industryExposure.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleIndustryExposure(item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isChecked
                      ? 'bg-[#9ABA1B] text-white shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 text-[#171717]/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: Online Profiles & Resume */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ABA1B] mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" /> 3. Links & Resume Upload
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" /> LinkedIn Profile (Optional)
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
              onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-[#F5F8E8]/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] dark:text-white mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-500" /> Portfolio / Website Link (Optional)
            </label>
            <input
              type="url"
              value={formData.portfolio_url}
              onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
              placeholder="https://myportfolio.com"
              className="w-full bg-[#F5F8E8]/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
            />
          </div>
        </div>

        {/* Resume Switcher: File or Link */}
        <div data-error={!!errors.resume}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[#171717] dark:text-white">
              Curriculum Vitae / Resume <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setUseResumeLink(!useResumeLink);
                setErrors(prev => {
                  const rest = { ...prev };
                  delete rest.resume;
                  return rest;
                });
              }}
              className="text-xs text-[#9ABA1B] hover:underline font-semibold"
            >
              {useResumeLink ? '← Upload a file instead' : 'Have a link instead? (Google Drive/Dropbox)'}
            </button>
          </div>

          {useResumeLink ? (
            <div>
              <input
                type="url"
                value={resumeLink}
                onChange={e => setResumeLink(e.target.value)}
                placeholder="Paste link to Google Drive / Dropbox / Cloud storage (Make sure permissions are public)"
                className="w-full bg-[#F5F8E8]/50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Please make sure the link access is set to "Anyone with the link can view".
              </p>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {resumeFile ? (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#9ABA1B]/10 border border-[#9ABA1B]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#9ABA1B] text-white flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#171717] dark:text-white truncate max-w-xs sm:max-w-md">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-[#171717]/60 dark:text-white/60">
                        {formatFileSize(resumeFile.size)} • Document ready
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-[#9ABA1B] bg-[#9ABA1B]/5'
                      : 'border-black/15 dark:border-white/15 hover:border-[#9ABA1B] bg-[#F5F8E8]/30 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-3 text-[#171717]/70 dark:text-white/70">
                    <Upload className="w-6 h-6 text-[#9ABA1B]" />
                  </div>
                  <p className="text-sm font-bold text-[#171717] dark:text-white mb-1">
                    Click to upload or drag & drop your resume
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, or DOCX formats accepted (up to 10MB)
                  </p>
                </div>
              )}
            </div>
          )}
          {errors.resume && <p className="text-xs text-red-500 mt-1.5">{errors.resume}</p>}
        </div>
      </div>

      {/* SECTION 4: Pitch & Cover Letter */}
      <div className="mb-8" data-error={!!errors.cover_note}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9ABA1B] mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> 4. Candidate Pitch & Cover Note
        </h4>
        <label className="block text-xs text-[#171717]/70 dark:text-white/70 mb-2">
          {currentJob.id === 'digital-marketing-intern'
            ? 'Tell us why you are interested in this digital marketing internship and what makes you a great fit (mention any experience with social channels, design tools like Canva, copywriting, or email newsletters):'
            : 'Tell us why you are interested in this role and what makes you a great fit for Terrashare (mention any experience with CEO support, presentations, or business development):'}{' '}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          value={formData.cover_note}
          onChange={e => setFormData({ ...formData, cover_note: e.target.value })}
          placeholder={
            currentJob.id === 'digital-marketing-intern'
              ? 'Tell us about your social media background, creative tools you use (Canva, CapCut, etc.), and what excites you about marketing at Terrashare...'
              : 'Write your note here... (Minimum 30 characters)'
          }
          className={`w-full bg-[#F5F8E8]/50 dark:bg-white/5 border ${
            errors.cover_note ? 'border-red-400 focus:border-red-500' : 'border-black/10 dark:border-white/10 focus:border-[#9ABA1B]'
          } rounded-2xl p-4 text-sm text-[#171717] dark:text-white focus:outline-none transition-colors resize-y`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.cover_note ? (
            <p className="text-xs text-red-500">{errors.cover_note}</p>
          ) : (
            <p className="text-[11px] text-gray-400">Be authentic and highlight key skills or past projects.</p>
          )}
          <span className="text-[11px] text-gray-400">{formData.cover_note.length} characters</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
          By submitting, you consent to Terrashare evaluating your application for executive recruitment.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#9ABA1B] hover:bg-[#85A316] text-white font-bold text-sm shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
