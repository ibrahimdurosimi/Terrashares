import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Building2, Plus, Edit2, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

type Property = Database['public']['Tables']['properties']['Row'];

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '', slug: '', location: '', description: '', min_investment: 0, returns_percent: 0, 
    duration_months: 12, payout_style: 'after_maturity', category: 'residential', 
    status: 'open', is_fractional: false, type_details: {}
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (data) setProperties(data);
    setLoading(false);
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...rest } = formData;
    
    if (id) {
      // Update
      await supabase.from('properties').update(rest).eq('id', id);
    } else {
      // Insert
      await supabase.from('properties').insert(rest as any);
    }
    
    setIsModalOpen(false);
    fetchProperties();
  };

  const openNew = () => {
    setFormData({
      title: '', slug: '', location: '', description: '', min_investment: 0, returns_percent: 0, 
      duration_months: 12, payout_style: 'after_maturity', category: 'residential', 
      status: 'open', is_fractional: false, type_details: {}
    });
    setIsModalOpen(true);
  };

  const openEdit = (prop: Property) => {
    setFormData(prop);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await supabase.from('properties').delete().eq('id', id);
      fetchProperties();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0A0A0A]">Manage Properties</h1>
        <button 
          onClick={openNew}
          className="flex items-center px-6 py-3 bg-[#0A0A0A] text-white rounded-full hover:bg-gray-800 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Property
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] shadow-sm border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#0A0A0A]/50">Loading properties...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 border-b border-black/5 text-sm text-[#0A0A0A]/50 uppercase tracking-wider">
                <th className="p-6 font-medium">Property</th>
                <th className="p-6 font-medium">Category</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 font-medium">Min Invest</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#0A0A0A]">
              {properties.map(prop => (
                <tr key={prop.id} className="hover:bg-white/50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-[#0A0A0A]">{prop.title}</p>
                    <p className="text-xs text-[#0A0A0A]/50">{prop.location}</p>
                  </td>
                  <td className="p-6 capitalize">{prop.category.replace('_', ' ')}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${prop.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-[#0A0A0A]/10 text-[#0A0A0A]/70'}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="p-6 font-bold">${prop.min_investment.toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <button onClick={() => openEdit(prop)} className="text-[#0A0A0A]/60 hover:text-[#9B8924] p-2 transition-colors"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(prop.id)} className="text-[#0A0A0A]/60 hover:text-red-600 p-2 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal - Basic scaffold for brevity */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#F7D0BC] rounded-[2rem] border border-black/10 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-[#0A0A0A]">{formData.id ? 'Edit Property' : 'Add Property'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Slug</label>
                  <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="mixed_use">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Min Investment ($)</label>
                  <input type="number" required value={formData.min_investment} onChange={e => setFormData({...formData, min_investment: Number(e.target.value)})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Returns (%)</label>
                  <input type="number" step="0.1" required value={formData.returns_percent} onChange={e => setFormData({...formData, returns_percent: Number(e.target.value)})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white/60 border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors h-32 resize-none"></textarea>
              </div>
              <div className="pt-6 flex justify-end">
                <button type="submit" className="px-8 py-3 bg-[#0A0A0A] hover:bg-[#0A0A0A]/80 text-[#F7D0BC] rounded-full font-bold transition-colors">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
