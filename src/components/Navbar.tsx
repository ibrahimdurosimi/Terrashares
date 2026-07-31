import { Link } from 'react-router-dom';
import { Building2, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

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
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
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
    
    setIsAdmin(data ? (data as any).role === 'admin' : false);
  }

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5 py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between transition-colors">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#9B8924]" />
              <span className="text-2xl font-bold tracking-tight text-[#0A0A0A] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Terrashare
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/properties" className="text-sm font-semibold text-[#0A0A0A] dark:text-white/80 hover:text-[#9B8924] dark:hover:text-white transition-colors">Properties</Link>
            <Link to="/about" className="text-sm font-semibold text-[#0A0A0A] dark:text-white/80 hover:text-[#9B8924] dark:hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-semibold text-[#0A0A0A] dark:text-white/80 hover:text-[#9B8924] dark:hover:text-white transition-colors">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-[#9B8924] hover:opacity-70 transition-opacity">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-4 z-10">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#0A0A0A] dark:text-white"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {session ? (
              <Link
                to="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-white px-6 text-sm font-semibold text-white dark:text-[#0A0A0A] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex h-10 items-center justify-center rounded-full border-2 border-[#0A0A0A]/10 dark:border-white/10 px-6 text-sm font-semibold text-[#0A0A0A] dark:text-white hover:border-[#0A0A0A] dark:hover:border-white transition-colors hidden sm:flex"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-white px-6 text-sm font-semibold text-white dark:text-[#0A0A0A] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
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
