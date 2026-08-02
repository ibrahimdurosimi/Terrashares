import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdmin(false);
        return;
      }
      
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      setIsAdmin(data ? (data as any).role === 'admin' : false);
    }
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const links = [
    { name: 'Properties', path: '/admin/properties' },
    { name: 'Leads', path: '/admin/leads' },
    { name: 'Investments', path: '/admin/investments' },
    { name: 'Notifications', path: '/admin/notifications' },
    { name: 'FAQs', path: '/admin/faqs' },
  ];

  return (
    <div className="flex flex-col md:flex-row pb-24">
      <div className="w-full md:w-64 bg-[#171717] text-white p-6 shrink-0 md:min-h-[calc(100vh-80px)] rounded-r-3xl my-8 md:my-0 shadow-xl border border-black/5">
        <h2 className="text-xl font-bold mb-8 text-[#9ABA1B]">Admin Panel</h2>
        <nav className="space-y-2">
          {links.map(link => {
            const active = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl transition-colors ${
                  active ? 'bg-[#9ABA1B] text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
