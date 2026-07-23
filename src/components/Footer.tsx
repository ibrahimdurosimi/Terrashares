import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-16 pb-8 relative overflow-hidden">
      <div 
        className="absolute left-1/2 -translate-x-1/2 bottom-0 text-[15vw] md:text-[200px] font-black pointer-events-none select-none text-transparent"
        style={{ WebkitTextStroke: '2px rgba(255,255,255,0.03)' }}
      >
        TERRASHARES
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-[#9B8924]" />
              <span className="text-xl font-bold tracking-tight text-white">
                Terrashares
              </span>
            </Link>
            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest leading-relaxed mt-4">
              Secure property investment for the modern digital landscape. Building sustainable portfolios one unit at a time.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#F7D0BC]">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm">About Us</Link></li>
              <li><Link to="/properties" className="text-white/60 hover:text-white transition-colors text-sm">Properties</Link></li>
              <li><Link to="/invest" className="text-white/60 hover:text-white transition-colors text-sm">How it works</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#F7D0BC]">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="/faqs" className="text-white/60 hover:text-white transition-colors text-sm">FAQs</Link></li>
              <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#F7D0BC]">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-white/60 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-8 border-t border-white/10 text-[10px] text-white/30 font-medium uppercase tracking-tighter text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} Terrashares Investment Platform</p>
          <p>Regulated Asset Management</p>
        </div>
      </div>
    </footer>
  );
}
