import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function Navbar() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#9B8924]" />
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Terrashares
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">Home</Link>
            <Link to="/properties" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">Properties</Link>
            <Link to="/about" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">About</Link>
            <Link to="/contact" className="text-sm font-medium text-[#0A0A0A] hover:opacity-70 transition-opacity">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-900 hover:text-[#9B8924] transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#0A0A0A] hover:opacity-70 transition-opacity hidden sm:block"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#9B8924] px-6 text-sm font-semibold text-white shadow-lg shadow-[#9B8924]/20 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[#9B8924] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
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
