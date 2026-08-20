import { Link } from 'react-router-dom';
import { Building2, Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { NotificationsDropdown } from './NotificationsDropdown';
import { AnimatePresence, motion } from 'motion/react';

export function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { name: 'Properties', to: '/properties' },
    { name: 'About', to: '/about' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#171717]/90 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5 py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between transition-colors">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Building2 className="h-6 w-6 text-[#9ABA1B]" />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Terrashare
              </span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">
                Our Products <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col z-50">
                <Link to="/properties" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Buy</Link>
                <Link to="/properties?category=residential" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Completed Home</Link>
                <Link to="/properties?category=mixed_use" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Ongoing Projects</Link>
                <Link to="/properties?category=land" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Off-Plan Sales</Link>
                <Link to="/properties?category=commercial" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Halal Mortgage</Link>
              </div>
            </div>
            <Link to="/about" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">Contact</Link>
  
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-[#9ABA1B] hover:opacity-70 transition-opacity">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 z-10">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#171717] dark:text-white"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {session ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <NotificationsDropdown userId={session.user.id} />
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-[#171717] dark:bg-white px-6 text-sm font-semibold text-white dark:text-[#171717] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                
                <a
                  href="https://wa.me/2348097701222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-[#171717] dark:bg-white px-6 text-sm font-semibold text-white dark:text-[#171717] hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Join now
                </a>
              </>
            )}

            {/* Mobile menu toggle */}
            <button 
              className="lg:hidden p-2 text-[#171717] dark:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-[#171717] border-b border-black/5 dark:border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              
                <div className="py-2">
                  <div className="text-lg font-semibold text-[#171717] dark:text-white mb-2">Our Products</div>
                  <div className="pl-4 flex flex-col gap-2">
                    <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Buy</Link>
                    <Link to="/properties?category=residential" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Completed Home</Link>
                    <Link to="/properties?category=mixed_use" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Ongoing Projects</Link>
                    <Link to="/properties?category=land" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Off-Plan Sales</Link>
                    <Link to="/properties?category=commercial" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Halal Mortgage</Link>
                  </div>
                </div>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#171717] dark:text-white hover:text-[#9ABA1B] transition-colors py-2">About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#171717] dark:text-white hover:text-[#9ABA1B] transition-colors py-2">Contact</Link>
  
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-bold text-[#9ABA1B] py-2"
                >
                  Admin
                </Link>
              )}
              
              <div className="pt-4 flex flex-col gap-3 border-t border-black/5 dark:border-white/5">
                {session ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full h-12 items-center justify-center rounded-full bg-[#171717] dark:bg-white text-base font-semibold text-white dark:text-[#171717]"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    
                    <a
                      href="https://wa.me/2348097701222"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full h-12 items-center justify-center rounded-full bg-[#171717] dark:bg-white text-base font-semibold text-white dark:text-[#171717]"
                    >
                      Join now
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
