import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Edit2, Trash2, Plus, X, LineChart as ChartIcon, AlertTriangle, Loader2, Eye, EyeOff, Video } from 'lucide-react';
import { ImageUploadDropzone } from '../../components/ImageUploadDropzone';
import { PropertyVideoManager } from '../../components/admin/PropertyVideoManager';
import { PropertyVideo } from '../../types/media';
import { getPropertyVideos } from '../../utils/mediaUtils';
import { isPropertyPublished, getMergedPropertyList, savePropertyOverride } from '../../utils/propertyUtils';

type Property = Database['public']['Tables']['properties']['Row'];
type Valuation = Database['public']['Tables']['property_valuations']['Row'];

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});
  const [modalIsPublished, setModalIsPublished] = useState<boolean>(true);
  const [modalVideos, setModalVideos] = useState<PropertyVideo[]>([]);
  const [isTogglingPublishId, setIsTogglingPublishId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [currentPropId, setCurrentPropId] = useState<string | null>(null);
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [valuationForm, setValuationForm] = useState({ recorded_date: '', value: 0 });

  // Delete modal state
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await (supabase as any).from('properties').select('*').order('created_at', { ascending: false });
    if (data) {
      const merged = getMergedPropertyList(data);
      setProperties(merged);
    }
    if (error) console.error('Error fetching properties:', error);
    setLoading(false);
  }

  const handleTogglePublish = async (prop: Property) => {
    const currentPublished = isPropertyPublished(prop);
    const nextPublished = !currentPublished;
    setIsTogglingPublishId(prop.id);
    
    const currentDetails = (prop.type_details && typeof prop.type_details === 'object') ? prop.type_details : {};
    const updatedDetails = {
      ...currentDetails,
      is_published: nextPublished,
    };

    try {
      await (supabase as any)
        .from('properties')
        .update({
          type_details: updatedDetails,
        })
        .eq('id', prop.id);

      // Save locally as well to guarantee persistence
      savePropertyOverride(prop.id, { type_details: updatedDetails });

      // Optimistically update local state
      setProperties(prev => prev.map(p => {
        if (p.id === prop.id) {
          return {
            ...p,
            type_details: updatedDetails as any,
          };
        }
        return p;
      }));

      setActionSuccess(
        nextPublished
          ? `"${prop.title}" published successfully. It is now live on the website.`
          : `"${prop.title}" unpublished. It will no longer appear on the website.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      console.error('Error toggling publish status:', err);
      alert(err?.message || 'Failed to update publication status.');
    } finally {
      setIsTogglingPublishId(null);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    const { id, ...rest } = formData;
    
    // Ensure image_urls is an array
    let processedData = { ...rest };
    if (typeof rest.image_urls === 'string') {
      processedData.image_urls = (rest.image_urls as string).split(',').map((s: string) => s.trim()).filter((s: string) => s);
    } else if (!Array.isArray(rest.image_urls)) {
      processedData.image_urls = [];
    }

    // Set published flag and video assets in type_details
    const existingDetails = (processedData.type_details && typeof processedData.type_details === 'object') 
      ? (processedData.type_details as Record<string, any>) 
      : {};
    processedData.type_details = {
      ...existingDetails,
      is_published: modalIsPublished,
      videos: modalVideos,
      video_urls: modalVideos.map(v => v.url),
    } as any;
    
    // Clean data based on selected paths
    if (processedData.acquisition_type === 'investment') {
      processedData.ownership_subtype = null;
      processedData.payment_method = null;
      processedData.total_units = null;
      processedData.price_per_slot = null;
      processedData.units_sold = null;
    } else { // ownership
      processedData.returns_percent = null;
      processedData.min_investment = null;
      processedData.payout_style = null;
      
      if (processedData.ownership_subtype === 'full-ownership') {
        processedData.total_units = null;
        processedData.price_per_slot = null;
        processedData.units_sold = null;
      } else { // co-ownership
        processedData.duration_months = null;
      }
    }
    
    try {
      if (id) {
        await (supabase as any).from('properties').update(processedData as any).eq('id', id);
        savePropertyOverride(id, processedData);
        setActionSuccess('Property updated successfully.');
      } else {
        const { data: newRow } = await (supabase as any).from('properties').insert(processedData as any).select().single();
        const savedId = newRow?.id || processedData.slug || `prop-${Date.now()}`;
        savePropertyOverride(savedId, { ...processedData, id: savedId });
        setActionSuccess('Property created successfully.');
      }
      setTimeout(() => setActionSuccess(null), 3500);
      setIsModalOpen(false);
      fetchProperties();
    } catch (err: any) {
      console.error('Error saving property:', err);
    }
  };

  const openNew = () => {
    setFormData({
      title: '', slug: '', location: '', description: '', 
      min_investment: 0, returns_percent: 0, duration_months: 13, payout_style: 'after_maturity', 
      category: 'residential', status: 'open', is_fractional: true, type_details: {}, image_urls: [], 
      total_units: 100, units_sold: 0,
      property_type: 'land', acquisition_type: 'investment', ownership_subtype: null,
      documentation_charges: 0, price_per_slot: 0, payment_method: null
    });
    setModalIsPublished(true);
    setModalVideos([]);
    setIsModalOpen(true);
  };

  const openEdit = (prop: Property) => {
    setFormData({
      ...prop,
      image_urls: prop.image_urls || [],
      property_type: prop.property_type || 'land',
      acquisition_type: prop.acquisition_type || 'investment',
      ownership_subtype: prop.ownership_subtype || null,
      documentation_charges: prop.documentation_charges || 0,
      price_per_slot: prop.price_per_slot || 0,
      payment_method: prop.payment_method || null
    });
    setModalIsPublished(isPropertyPublished(prop));
    setModalVideos(getPropertyVideos(prop));
    setIsModalOpen(true);
  };

  const requestDelete = (prop: Property) => {
    setPropertyToDelete(prop);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // 1. Delete associated valuations to prevent foreign key errors
      const { error: valError } = await (supabase as any)
        .from('property_valuations')
        .delete()
        .eq('property_id', propertyToDelete.id);
      
      if (valError) {
        console.warn('Valuation cleanup warning:', valError);
      }

      // 2. Disassociate leads referencing this property
      const { error: leadsError } = await (supabase as any)
        .from('leads')
        .update({ property_id: null })
        .eq('property_id', propertyToDelete.id);

      if (leadsError) {
        console.warn('Leads disassociation warning:', leadsError);
      }

      // 3. Delete property record
      const { error: propError } = await (supabase as any)
        .from('properties')
        .delete()
        .eq('id', propertyToDelete.id);

      if (propError) {
        console.error('Failed to delete property:', propError);
        setDeleteError(propError.message || 'Failed to delete property. Check database constraints or permissions.');
        setIsDeleting(false);
        return;
      }

      // Success
      setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
      setActionSuccess(`"${propertyToDelete.title}" was deleted.`);
      setTimeout(() => setActionSuccess(null), 3500);
      setPropertyToDelete(null);
    } catch (err: any) {
      console.error('Error during deletion:', err);
      setDeleteError(err.message || 'An unexpected error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openValuations = async (id: string) => {
    setCurrentPropId(id);
    setValuationForm({ recorded_date: new Date().toISOString().split('T')[0], value: 0 });
    setIsValuationModalOpen(true);
    await fetchValuations(id);
  };

  const fetchValuations = async (id: string) => {
    const { data } = await (supabase as any).from('property_valuations').select('*').eq('property_id', id).order('recorded_date', { ascending: true });
    if (data) setValuations(data);
  };

  const handleSaveValuation = async (e: any) => {
    e.preventDefault();
    if (!currentPropId) return;
    
    await (supabase as any).from('property_valuations').insert({
      property_id: currentPropId,
      recorded_date: valuationForm.recorded_date,
      value: valuationForm.value
    });
    
    setValuationForm({ recorded_date: new Date().toISOString().split('T')[0], value: 0 });
    fetchValuations(currentPropId);
  };

  const handleDeleteValuation = async (id: string) => {
    await (supabase as any).from('property_valuations').delete().eq('id', id);
    if (currentPropId) fetchValuations(currentPropId);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#171717]">Manage Properties</h1>
          <p className="text-sm text-[#171717]/60 mt-1">
            Publish or unpublish properties to control what appears on the website front end.
          </p>
        </div>
        <button 
          onClick={openNew}
          className="flex items-center px-6 py-3 bg-[#171717] text-white rounded-full hover:bg-gray-800 transition-colors font-medium shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Property
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            statusFilter === 'all'
              ? 'bg-[#171717] text-white shadow-sm'
              : 'bg-white/80 text-[#171717]/70 hover:bg-white hover:text-[#171717] border border-black/5'
          }`}
        >
          All Properties ({properties.length})
        </button>
        <button
          onClick={() => setStatusFilter('published')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            statusFilter === 'published'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white/80 text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Published ({properties.filter(isPropertyPublished).length})
        </button>
        <button
          onClick={() => setStatusFilter('unpublished')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            statusFilter === 'unpublished'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white/80 text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <EyeOff className="w-3.5 h-3.5" />
          Unpublished / Hidden ({properties.filter(p => !isPropertyPublished(p)).length})
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] shadow-sm border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#171717]/50">Loading properties...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-black/5 border-b border-black/5 text-sm text-[#171717]/50 uppercase tracking-wider">
                  <th className="p-6 font-medium">Property</th>
                  <th className="p-6 font-medium">Category</th>
                  <th className="p-6 font-medium">Visibility & Status</th>
                  <th className="p-6 font-medium">Min Invest</th>
                  <th className="p-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-[#171717]">
                {properties
                  .filter(prop => {
                    if (statusFilter === 'published') return isPropertyPublished(prop);
                    if (statusFilter === 'unpublished') return !isPropertyPublished(prop);
                    return true;
                  })
                  .map(prop => {
                    const isPublished = isPropertyPublished(prop);
                    const isToggling = isTogglingPublishId === prop.id;
                    const propVideos = getPropertyVideos(prop);

                    return (
                      <tr key={prop.id} className={`hover:bg-white/50 transition-colors ${!isPublished ? 'bg-amber-50/20' : ''}`}>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#171717]">{prop.title}</p>
                            {propVideos.length > 0 && (
                              <span className="text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1" title={`${propVideos.length} video(s) attached`}>
                                <Video className="w-2.5 h-2.5" />
                                {propVideos.length} {propVideos.length === 1 ? 'Video' : 'Videos'}
                              </span>
                            )}
                            {!isPublished && (
                              <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#171717]/50">{prop.location}</p>
                        </td>
                        <td className="p-6 capitalize">
                          {prop.category.replace('_', ' ')}
                          {prop.property_type_needs_review && (
                            <span className="block mt-1 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full w-max">
                              Needs Review
                            </span>
                          )}
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-1.5 items-start">
                            {isPublished ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                Published (Live)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                                <EyeOff className="w-3 h-3 text-amber-700" />
                                Unpublished (Hidden)
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${prop.status === 'open' ? 'text-gray-500 bg-gray-100' : 'text-red-700 bg-red-100'}`}>
                              {prop.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 font-bold">
                          {prop.acquisition_type === 'investment' 
                            ? `₦${(prop.min_investment || 0).toLocaleString()}`
                            : prop.ownership_subtype === 'co-ownership' 
                              ? `₦${(prop.price_per_slot || 0).toLocaleString()} / slot`
                              : '-'}
                        </td>
                        <td className="p-6 text-right space-x-2 whitespace-nowrap">
                          {/* Unpublish / Publish Button */}
                          <button
                            onClick={() => handleTogglePublish(prop)}
                            disabled={isToggling}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                              isPublished
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                            } disabled:opacity-50`}
                            title={isPublished ? "Unpublish this property so it does not appear on the website front end" : "Publish this property to make it visible on the website"}
                          >
                            {isToggling ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isPublished ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Publish</span>
                              </>
                            )}
                          </button>

                          <button onClick={() => openValuations(prop.id)} className="text-[#171717]/60 hover:text-blue-600 p-2 transition-colors inline-block" title="Manage Valuations"><ChartIcon className="w-5 h-5" /></button>
                          <button onClick={() => openEdit(prop)} className="text-[#171717]/60 hover:text-[#9ABA1B] p-2 transition-colors inline-block" title="Edit"><Edit2 className="w-5 h-5" /></button>
                          <button onClick={() => requestDelete(prop)} className="text-[#171717]/60 hover:text-red-600 p-2 transition-colors inline-block" title="Delete Property"><Trash2 className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171717] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9ABA1B]" />
          <span className="text-sm font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-[2rem] border border-black/10 dark:border-white/10 shadow-2xl w-full max-w-md p-6 sm:p-8 relative">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-5">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-[#171717] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Delete Property?
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-[#171717] dark:text-white">"{propertyToDelete.title}"</strong>? 
              This will also remove all associated valuations for this property.
            </p>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 rounded-xl text-xs leading-relaxed">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!isDeleting) {
                    setPropertyToDelete(null);
                    setDeleteError(null);
                  }
                }}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#F5F8E8] rounded-[2rem] border border-black/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-[#171717]/40 hover:text-[#171717] transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold mb-8 text-[#171717]">{formData.id ? 'Edit Property' : 'Add Property'}</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Type Selection */}
              <div className="bg-black/5 p-6 rounded-2xl space-y-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-3">Property Type</label>
                  <div className="flex gap-4">
                    {(['land', 'house'] as const).map(type => (
                      <label key={type} className="flex-1 cursor-pointer">
                        <input type="radio" name="property_type" value={type} checked={formData.property_type === type} onChange={e => setFormData({...formData, property_type: e.target.value as any, property_type_needs_review: false})} className="sr-only" />
                        <div className={`text-center py-3 px-4 rounded-xl font-bold border-2 transition-all ${formData.property_type === type ? 'border-[#9ABA1B] bg-[#9ABA1B]/10 text-[#9ABA1B]' : 'border-transparent bg-white text-[#171717]/60 hover:bg-white/80'}`}>
                          {type === 'land' ? 'Land' : 'House'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-3">Acquisition Type</label>
                  <div className="flex gap-4">
                    {(['investment', 'ownership'] as const).map(type => (
                      <label key={type} className="flex-1 cursor-pointer">
                        <input type="radio" name="acquisition_type" value={type} checked={formData.acquisition_type === type} onChange={e => setFormData({...formData, acquisition_type: e.target.value as any})} className="sr-only" />
                        <div className={`text-center py-3 px-4 rounded-xl font-bold border-2 transition-all ${formData.acquisition_type === type ? 'border-[#9ABA1B] bg-[#9ABA1B]/10 text-[#9ABA1B]' : 'border-transparent bg-white text-[#171717]/60 hover:bg-white/80'}`}>
                          {type === 'investment' ? 'Investment (Fixed-Return)' : 'Ownership'}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.acquisition_type === 'ownership' && (
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-3">Ownership Sub-type</label>
                    <div className="flex gap-4">
                      {(['co-ownership', 'full-ownership'] as const).map(type => (
                        <label key={type} className="flex-1 cursor-pointer">
                          <input type="radio" name="ownership_subtype" value={type} checked={formData.ownership_subtype === type} onChange={e => setFormData({...formData, ownership_subtype: e.target.value as any})} className="sr-only" />
                          <div className={`text-center py-3 px-4 rounded-xl font-bold border-2 transition-all ${formData.ownership_subtype === type ? 'border-[#9ABA1B] bg-[#9ABA1B]/10 text-[#9ABA1B]' : 'border-transparent bg-white text-[#171717]/60 hover:bg-white/80'}`}>
                            {type === 'co-ownership' ? 'Fractional Co-Ownership' : 'Buy-to-Own'}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shared Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Title</label>
                  <input type="text" required value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Slug</label>
                  <input type="text" required value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Location</label>
                  <input type="text" required value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Public Filter Category (Legacy)</label>
                  <select required value={formData.category || 'residential'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="mixed_use">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Status (Offering)</label>
                  <select required value={formData.status || 'open'} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Website Visibility</label>
                  <select 
                    value={modalIsPublished ? 'published' : 'unpublished'} 
                    onChange={e => setModalIsPublished(e.target.value === 'published')} 
                    className={`w-full px-4 py-3 font-semibold border rounded-xl transition-colors ${
                      modalIsPublished 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 focus:ring-2 focus:ring-emerald-500' 
                        : 'bg-amber-50 border-amber-300 text-amber-900 focus:ring-2 focus:ring-amber-500'
                    }`}
                  >
                    <option value="published">Published (Visible to Visitors)</option>
                    <option value="unpublished">Unpublished (Hidden from Website)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">Documentation Charges (₦)</label>
                  <input type="number" required min="0" value={formData.documentation_charges || 0} onChange={e => setFormData({...formData, documentation_charges: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                </div>
              </div>

              {/* Investment-only Fields */}
              {formData.acquisition_type === 'investment' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#171717]/5 p-6 rounded-2xl">
                  <div className="col-span-1 md:col-span-2 mb-2">
                    <h3 className="font-bold text-[#171717]">Investment Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Returns (%)</label>
                    <input type="number" required step="0.1" min="0" value={formData.returns_percent || 0} onChange={e => setFormData({...formData, returns_percent: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Duration (Months)</label>
                    <input type="number" required min="1" value={formData.duration_months || 0} onChange={e => setFormData({...formData, duration_months: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Min Investment (₦)</label>
                    <input type="number" required min="0" value={formData.min_investment || 0} onChange={e => setFormData({...formData, min_investment: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Payout Style</label>
                    <select required value={formData.payout_style || 'after_maturity'} onChange={e => setFormData({...formData, payout_style: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors">
                      <option value="after_maturity">After Maturity</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Full Ownership Fields */}
              {formData.acquisition_type === 'ownership' && formData.ownership_subtype === 'full-ownership' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#171717]/5 p-6 rounded-2xl">
                  <div className="col-span-1 md:col-span-2 mb-2">
                    <h3 className="font-bold text-[#171717]">Full Ownership Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Duration (Months)</label>
                    <input type="number" required min="0" value={formData.duration_months || 0} onChange={e => setFormData({...formData, duration_months: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Payment Method</label>
                    <select required value={formData.payment_method || 'full_payment'} onChange={e => setFormData({...formData, payment_method: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors">
                      <option value="full_payment">Full Payment</option>
                      <option value="down_payment_spread">Down Payment + Spread</option>
                      <option value="halal_mortgage">Halal Mortgage</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Co-ownership Fields */}
              {formData.acquisition_type === 'ownership' && formData.ownership_subtype === 'co-ownership' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#171717]/5 p-6 rounded-2xl">
                  <div className="col-span-1 md:col-span-2 mb-2">
                    <h3 className="font-bold text-[#171717]">Fractional Co-Ownership Details</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Total Slots</label>
                    <input type="number" required min="1" value={formData.total_units || 0} onChange={e => setFormData({...formData, total_units: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Slots Sold</label>
                    <input type="number" required min="0" value={formData.units_sold || 0} onChange={e => setFormData({...formData, units_sold: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Price per Slot (₦)</label>
                    <input type="number" required min="0" value={formData.price_per_slot || 0} onChange={e => setFormData({...formData, price_per_slot: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">Payment Method</label>
                    <select required value={formData.payment_method || 'full_payment'} onChange={e => setFormData({...formData, payment_method: e.target.value as any})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors">
                      <option value="full_payment">Full Payment</option>
                      <option value="down_payment_spread">Down Payment + Spread</option>
                      <option value="halal_mortgage">Halal Mortgage</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Property Image Upload Section */}
              <div className="pt-2">
                <ImageUploadDropzone 
                  images={Array.isArray(formData.image_urls) ? formData.image_urls : []}
                  onChange={(newImages) => setFormData({ ...formData, image_urls: newImages })}
                />
              </div>

              {/* Property Video Media Assets Section */}
              <div className="pt-4 border-t border-black/5">
                <PropertyVideoManager 
                  videos={modalVideos} 
                  onChange={setModalVideos} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2">Description</label>
                <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors h-32 resize-none"></textarea>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" className="px-8 py-3 bg-[#171717] hover:bg-gray-800 text-white rounded-full font-bold transition-colors">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Valuations Modal */}
      {isValuationModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#F5F8E8] rounded-[2rem] border border-black/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setIsValuationModalOpen(false)} className="absolute top-8 right-8 text-[#171717]/40 hover:text-[#171717] transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#171717]">Manage Valuations</h2>
            
            <form onSubmit={handleSaveValuation} className="flex gap-4 mb-8 items-end">
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#171717] mb-2">Date</label>
                <input type="date" required value={valuationForm.recorded_date} onChange={e => setValuationForm({...valuationForm, recorded_date: e.target.value})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold text-[#171717] mb-2">Value (₦)</label>
                <input type="number" required value={valuationForm.value} onChange={e => setValuationForm({...valuationForm, value: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-black/5 focus:ring-2 focus:ring-[#9ABA1B] rounded-xl transition-colors" />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#9ABA1B] hover:bg-[#85A316] text-white rounded-xl font-bold transition-colors h-[52px]">Add</button>
            </form>

            <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-black/5 text-sm font-bold text-[#171717]/60">
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
                        <button 
                          onClick={() => handleDeleteValuation(val.id)} 
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg transition-colors"
                          title="Delete Valuation"
                        >
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
