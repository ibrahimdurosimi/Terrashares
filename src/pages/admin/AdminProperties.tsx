import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Edit2, Trash2, Plus, X, LineChart as ChartIcon } from 'lucide-react';

type Property = Database['public']['Tables']['properties']['Row'];
type Valuation = Database['public']['Tables']['property_valuations']['Row'];

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [currentPropId, setCurrentPropId] = useState<string | null>(null);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [valuationForm, setValuationForm] = useState({ recorded_date: '', value: 0 });

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
    
    // Ensure image_urls is an array if we input comma separated
    let processedData = { ...rest };
    if (typeof rest.image_urls === 'string') {
        processedData.image_urls = (rest.image_urls as string).split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    
    if (id) {
      await supabase.from('properties').update(processedData as any).eq('id', id);
    } else {
      await supabase.from('properties').insert(processedData as any);
    }
    
    setIsModalOpen(false);
    fetchProperties();
  };

  const openNew = () => {
    setFormData({
      title: '', slug: '', location: '', description: '', min_investment: 0, returns_percent: 0, 
      duration_months: 13, payout_style: 'after_maturity', category: 'residential', 
      status: 'open', is_fractional: true, type_details: {}, image_urls: [], total_units: 100, units_sold: 0
    });
    setIsModalOpen(true);
  };

  const openEdit = (prop: Property) => {
    setFormData({
        ...prop,
        image_urls: prop.image_urls?.join(', ') as any
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      await supabase.from('properties').delete().eq('id', id);
      fetchProperties();
    }
  };

  const openValuations = async (id: string) => {
    setCurrentPropId(id);
    setValuationForm({ recorded_date: new Date().toISOString().split('T')[0], value: 0 });
    setIsValuationModalOpen(true);
    await fetchValuations(id);
  };

  const fetchValuations = async (id: string) => {
    const { data } = await supabase.from('property_valuations').select('*').eq('property_id', id).order('recorded_date', { ascending: true });
    if (data) setValuations(data);
  };

  const handleSaveValuation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPropId) return;
    
    await supabase.from('property_valuations').insert({
      property_id: currentPropId,
      recorded_date: valuationForm.recorded_date,
      value: valuationForm.value
    });
    
    setValuationForm({ recorded_date: new Date().toISOString().split('T')[0], value: 0 });
    fetchValuations(currentPropId);
  };

  const handleDeleteValuation = async (id: string) => {
    await supabase.from('property_valuations').delete().eq('id', id);
    if (currentPropId) fetchValuations(currentPropId);
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
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
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${prop.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-6 font-bold">₦{prop.min_investment.toLocaleString()}</td>
                    <td className="p-6 text-right space-x-2">
                      <button onClick={() => openValuations(prop.id)} className="text-[#0A0A0A]/60 hover:text-blue-600 p-2 transition-colors" title="Manage Valuations"><ChartIcon className="w-5 h-5" /></button>
                      <button onClick={() => openEdit(prop)} className="text-[#0A0A0A]/60 hover:text-[#9B8924] p-2 transition-colors" title="Edit"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(prop.id)} className="text-[#0A0A0A]/60 hover:text-red-600 p-2 transition-colors" title="Delete"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Property Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF8F5] rounded-[2rem] border border-black/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-[#0A0A0A]">{formData.id ? 'Edit Property' : 'Add Property'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Slug</label>
                  <input type="text" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Location</label>
                  <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Image URLs (comma separated)</label>
                  <input type="text" value={formData.image_urls as any} onChange={e => setFormData({...formData, image_urls: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Min Investment (₦)</label>
                  <input type="number" required value={formData.min_investment} onChange={e => setFormData({...formData, min_investment: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Returns (%)</label>
                  <input type="number" step="0.1" required value={formData.returns_percent} onChange={e => setFormData({...formData, returns_percent: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="mixed_use">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Payout Style</label>
                  <select value={formData.payout_style} onChange={e => setFormData({...formData, payout_style: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors">
                    <option value="after_maturity">After Maturity</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Duration (Months)</label>
                  <input type="number" required value={formData.duration_months} onChange={e => setFormData({...formData, duration_months: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Total Funding Needed / Units</label>
                  <input type="number" required value={formData.total_units || 0} onChange={e => setFormData({...formData, total_units: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Amount Funded / Units Sold</label>
                  <input type="number" required value={formData.units_sold || 0} onChange={e => setFormData({...formData, units_sold: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors h-32 resize-none"></textarea>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" className="px-8 py-3 bg-[#0A0A0A] hover:bg-gray-800 text-white rounded-full font-bold transition-colors">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Valuations Modal */}
      {isValuationModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF8F5] rounded-[2rem] border border-black/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setIsValuationModalOpen(false)} className="absolute top-8 right-8 text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#0A0A0A]">Manage Valuations</h2>
            
            <form onSubmit={handleSaveValuation} className="flex gap-4 mb-8 items-end">
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Date</label>
                <input type="date" required value={valuationForm.recorded_date} onChange={e => setValuationForm({...valuationForm, recorded_date: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#0A0A0A] mb-2">Value (₦)</label>
                <input type="number" required value={valuationForm.value} onChange={e => setValuationForm({...valuationForm, value: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9B8924] rounded-xl transition-colors" />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#9B8924] hover:bg-[#83731c] text-white rounded-xl font-bold transition-colors h-[52px]">Add</button>
            </form>

            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-black/5 text-sm font-bold text-[#0A0A0A]/60">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Value</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {valuations.map(val => (
                    <tr key={val.id}>
                      <td className="p-4">{new Date(val.recorded_date).toLocaleDateString()}</td>
                      <td className="p-4">₦{val.value.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteValuation(val.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {valuations.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">No valuations recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
