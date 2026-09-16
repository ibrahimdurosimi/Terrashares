import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Mail, Phone, MapPin, Calendar, Search, Filter, Trash2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Lead = Database['public']['Tables']['leads']['Row'];

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setLeads(data);
    setLoading(false);
  }

  const filtered = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.message && l.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Inquiries & Leads
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            General website contact inquiries, investor leads, and job applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9ABA1B] text-white text-xs font-bold shadow-sm hover:bg-[#85A316] transition-colors"
          >
            <span>Review Job Candidates</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-black/5 dark:border-white/10 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, content..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5F8E8]/40 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-[#171717] dark:text-white focus:outline-none focus:border-[#9ABA1B]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="font-semibold text-base">No inquiries found.</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {filtered.map(lead => {
              const isJobApp = lead.message && lead.message.includes('[JOB APPLICATION]');
              return (
                <div key={lead.id} className="p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[#171717] dark:text-white">{lead.name}</span>
                      {isJobApp && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9ABA1B]/20 text-[#9ABA1B]">
                          Career Application
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                      </span>
                    )}
                    {lead.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{lead.location}</span>
                      </span>
                    )}
                  </div>

                  <div className="bg-[#F5F8E8]/50 dark:bg-white/5 rounded-2xl p-4 text-xs text-[#171717]/80 dark:text-white/80 whitespace-pre-wrap font-sans">
                    {lead.message}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
