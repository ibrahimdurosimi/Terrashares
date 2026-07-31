import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

type Property = Database['public']['Tables']['properties']['Row'];
type User = Database['public']['Tables']['users']['Row'];
type Investment = Database['public']['Tables']['investments']['Row'];

export default function AdminNotifications() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [targetType, setTargetType] = useState<'all' | 'property'>('all');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'property_update' | 'payout' | 'document' | 'system'>('system');

  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase.from('properties').select('id, title');
      if (data) setProperties(data as any);
      setLoading(false);
    }
    fetchProperties();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);

    try {
      let userIds: string[] = [];

      if (targetType === 'all') {
        // Fetch all user IDs
        const { data: users } = await supabase.from('users').select('id');
        if (users) {
          userIds = (users as any[]).map(u => u.id);
        }
      } else if (targetType === 'property' && selectedProperty) {
        // Fetch users invested in this property
        const { data: investments } = await supabase
          .from('investments')
          .select('user_id')
          .eq('property_id', selectedProperty);
        
        if (investments) {
          userIds = Array.from(new Set((investments as any[]).map(i => i.user_id)));
        }
      }

      if (userIds.length > 0) {
        const notifications = userIds.map(userId => ({
          user_id: userId,
          title,
          message,
          type: notificationType,
        }));

        const { error } = await supabase.from('notifications').insert(notifications as any);
        if (error) throw error;
      }

      setSuccess(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to send notifications', error);
      alert('Failed to send notifications. Make sure the notifications table is created in Supabase.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Bell className="w-8 h-8 text-[#9B8924]" />
        <h1 className="text-3xl font-black text-[#0A0A0A] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
          Send Notifications
        </h1>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 shadow-sm border border-black/5 dark:border-white/5">
        {success && (
          <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">Notifications sent successfully!</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Target Audience</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10"
              >
                <option value="all">All Users</option>
                <option value="property">Investors of specific property</option>
              </select>
            </div>

            {targetType === 'property' && (
              <div>
                <label className="block text-sm font-bold mb-2">Select Property</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10"
                >
                  <option value="">-- Choose a property --</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Notification Type</label>
              <select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value as any)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10"
              >
                <option value="system">System Announcement</option>
                <option value="property_update">Property Update</option>
                <option value="payout">Investment Payout</option>
                <option value="document">New Document</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10"
                placeholder="E.g. Q3 Dividend Payout"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 resize-none"
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="h-12 px-8 rounded-full bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send Notification'}
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
