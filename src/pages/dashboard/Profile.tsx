import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { session } } = await (supabase as any).auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      
      const { data }: any = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (data) {
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setLocation(data.location || '');
        // Note: theme is handled by ThemeProvider automatically on login
      }
      setLoading(false);
    }
    
    fetchProfile();
  }, [navigate]);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    const { error } = await (supabase as any)
      .from('users')
      .update({ full_name: fullName, phone, location } as any)
      .eq('id', user.id);
      
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Profile updated successfully', type: 'success' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111] flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B8924]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111] py-12 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm p-8 md:p-10 transition-colors">
          <form onSubmit={handleSave} className="space-y-6">
            {message.text && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                message.type === 'error' 
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="pb-6 border-b border-gray-100 dark:border-white/10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Preference</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      theme === 'light' 
                        ? 'border-[#0A0A0A] dark:border-white bg-gray-50 dark:bg-white/5' 
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Sun className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark' 
                        ? 'border-[#0A0A0A] dark:border-white bg-gray-50 dark:bg-white/5' 
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      theme === 'system' 
                        ? 'border-[#0A0A0A] dark:border-white bg-gray-50 dark:bg-white/5' 
                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <Monitor className={`w-6 h-6 mb-2 ${theme === 'system' ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${theme === 'system' ? 'text-[#0A0A0A] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>System</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                  <div className="mt-2">
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-[#9B8924] focus:bg-white dark:focus:bg-[#222] text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-[#9B8924] focus:bg-white dark:focus:bg-[#222] text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-[#9B8924] focus:bg-white dark:focus:bg-[#222] text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="h-12 px-8 flex justify-center items-center rounded-full bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
