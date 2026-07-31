import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { format } from 'date-fns';

type Notification = Database['public']['Tables']['notifications']['Row'];

export function NotificationsDropdown({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userId]);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) {
      setNotifications(data as any);
      setUnreadCount((data as any[]).filter(n => !n.is_read).length);
    }
  };

  const markAsRead = async (id: string) => {
    await (supabase as any).from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await (supabase as any).from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'property_update': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'payout': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'document': return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#0A0A0A] dark:text-white"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 z-50">
          <div className="p-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#111]/90 backdrop-blur-md">
            <h3 className="font-bold text-[#0A0A0A] dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-[#9B8924] hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors ${notification.is_read ? 'hover:bg-gray-50 dark:hover:bg-white/5' : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(notification.type)}`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm ${notification.is_read ? 'text-[#0A0A0A]/80 dark:text-white/80' : 'font-bold text-[#0A0A0A] dark:text-white'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block">
                        {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
