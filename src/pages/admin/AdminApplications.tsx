import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { JobApplication } from '../../types/careers';
import { getJobApplications, updateApplicationStatus, deleteApplication } from '../../utils/careerUtils';

export default function AdminApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const loadData = () => {
    setApplications(getJobApplications());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('terrashare_application_submitted', handleUpdate);
    window.addEventListener('terrashare_application_updated', handleUpdate);
    window.addEventListener('terrashare_application_deleted', handleUpdate);

    return () => {
      window.removeEventListener('terrashare_application_submitted', handleUpdate);
      window.removeEventListener('terrashare_application_updated', handleUpdate);
      window.removeEventListener('terrashare_application_deleted', handleUpdate);
    };
  }, []);

  const handleStatusChange = (id: string, newStatus: JobApplication['status']) => {
    updateApplicationStatus(id, newStatus);
    loadData();
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSaveNote = () => {
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, selectedApp.status, adminNote);
    loadData();
    setSelectedApp(prev => prev ? { ...prev, notes: adminNote } : null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this application?')) {
      deleteApplication(id);
      loadData();
      if (selectedApp && selectedApp.id === id) setSelectedApp(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: JobApplication['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">New</span>;
      case 'reviewing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Reviewing</span>;
      case 'shortlisted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Shortlisted</span>;
      case 'interview':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">Interview</span>;
      case 'hired':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#9ABA1B]/20 text-[#9ABA1B]">Hired</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Job Applications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review candidates for Executive Assistant & Business Development Support
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 text-xs font-bold">
            Total Candidates: <span className="text-[#9ABA1B]">{applications.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/10 mb-6 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by candidate name, email, location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F8E8]/40 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {['all', 'new', 'reviewing', 'shortlisted', 'interview', 'rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                  : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="font-semibold text-base">No job applications match your filters.</p>
            <p className="text-xs text-gray-400 mt-1">New candidates applying through /careers will show up here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F8E8] dark:bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-black/5 dark:border-white/10">
                <tr>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Education & Exp</th>
                  <th className="py-4 px-6">Availability</th>
                  <th className="py-4 px-6">Resume / CV</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#171717] dark:text-white">{app.full_name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{app.email}</span>
                        <span>•</span>
                        <span>{app.phone}</span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#9ABA1B]" />
                        <span>{app.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-xs text-[#171717] dark:text-white">{app.qualification}</div>
                      <div className="text-xs text-gray-500">{app.experience_years}</div>
                      {app.industry_exposure && app.industry_exposure.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.industry_exposure.slice(0, 2).map((exp, i) => (
                            <span key={i} className="text-[10px] bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600 dark:text-gray-300">
                      {app.availability}
                    </td>
                    <td className="py-4 px-6">
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#9ABA1B] hover:underline font-semibold"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : app.resume_name ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium">
                          <FileText className="w-3.5 h-3.5 text-[#9ABA1B]" />
                          <span className="truncate max-w-[120px]">{app.resume_name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">In cover pitch</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setAdminNote(app.notes || '');
                          }}
                          className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#9ABA1B] hover:text-white transition-colors text-gray-600 dark:text-gray-300"
                          title="View Full Application"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-colors text-gray-400"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Application Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/5 dark:border-white/10 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-6">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{selectedApp.id}</span>
                <h3 className="text-2xl font-bold text-[#171717] dark:text-white">{selectedApp.full_name}</h3>
                <p className="text-xs text-gray-500">{selectedApp.job_title}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Quick Contact & Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F5F8E8] dark:bg-white/5 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-gray-500 block">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="font-bold text-[#171717] dark:text-white hover:underline">
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block">Phone</span>
                  <a href={`tel:${selectedApp.phone}`} className="font-bold text-[#171717] dark:text-white hover:underline">
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block">Location</span>
                  <strong className="text-[#171717] dark:text-white">{selectedApp.location}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Qualification</span>
                  <strong className="text-[#171717] dark:text-white">{selectedApp.qualification}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Experience</span>
                  <strong className="text-[#171717] dark:text-white">{selectedApp.experience_years}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Availability</span>
                  <strong className="text-[#9ABA1B]">{selectedApp.availability}</strong>
                </div>
              </div>

              {/* Profiles & Resume */}
              <div className="flex flex-wrap items-center gap-3">
                {selectedApp.linkedin_url && (
                  <a
                    href={selectedApp.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApp.portfolio_url && (
                  <a
                    href={selectedApp.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/5 dark:bg-white/10 hover:bg-black/10"
                  >
                    <span>Portfolio / Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApp.resume_url && (
                  <a
                    href={selectedApp.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#9ABA1B]/15 text-[#9ABA1B] hover:bg-[#9ABA1B]/25"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Resume / CV Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedApp.resume_name && !selectedApp.resume_url && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#9ABA1B]/15 text-[#9ABA1B]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Attached: {selectedApp.resume_name}</span>
                  </span>
                )}
              </div>

              {/* Cover Note */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Candidate Statement & Pitch</h4>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-sm leading-relaxed text-[#171717]/90 dark:text-white/90 whitespace-pre-wrap">
                  {selectedApp.cover_note}
                </div>
              </div>

              {/* Status Update Control */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Update Application Stage</h4>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'reviewing', 'shortlisted', 'interview', 'hired', 'rejected'] as JobApplication['status'][]).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedApp.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedApp.status === st
                          ? 'bg-[#9ABA1B] text-white shadow-md'
                          : 'bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Internal Note */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Executive Internal Notes</h4>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add notes from screening, call observations, or interview feedback..."
                  className="w-full bg-[#F5F8E8]/40 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-xs font-bold hover:opacity-90"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
