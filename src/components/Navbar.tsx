import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdmin(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdmin(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(session: any) {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    setIsAdmin(data?.role === 'admin');
  }

  return (
    <header className="absolute top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#9B8924]" />
              <span className="text-xl font-bold tracking-tight text-[#0A0A0A]">
                Terrashares
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">Home</Link>
            <Link to="/properties" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">Properties</Link>
            <Link to="/about" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">About</Link>
            <Link to="/contact" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-[#9B8924] hover:opacity-70 transition-opacity">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-4 z-10">
            {session ? (
              <Link
                to="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A0A0A] px-6 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0A0A0A]/10 px-6 text-sm font-semibold text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors hidden sm:flex"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A0A0A] px-6 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
