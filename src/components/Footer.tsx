import { Link } from 'react-router-dom';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#F5F8E8] dark:bg-[#111] pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Newsletter Box */}
        <div className="bg-[#171717] rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl">
          {/* Background large text */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-black text-white/5 pointer-events-none select-none" style={{ fontFamily: 'Georgia, serif' }}>
            NEWS
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Stay updated with real estate.
            </h3>
            <p className="text-white/70 mb-8 leading-relaxed max-w-lg">
              Subscribe to our newsletter for the latest property updates, investment insights, and new project announcements from Terrashare.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-grow">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-[#9ABA1B] transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="bg-[#9ABA1B] text-white font-bold py-3 px-8 rounded-full hover:bg-[#85A316] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Building2 className="h-7 w-7 text-[#9ABA1B]" />
              <span className="text-2xl text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Terrashare
              </span>
            </Link>
            <p className="text-[#171717]/60 dark:text-white/60 leading-relaxed mb-8 max-w-sm">
              A real estate technology platform connecting capital providers, buyers, and everyday Nigerians to affordable property ownership.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#171717]/5 flex items-center justify-center text-[#171717] dark:text-white hover:bg-[#171717] hover:text-white transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#171717]/5 flex items-center justify-center text-[#171717] dark:text-white hover:bg-[#171717] hover:text-white transition-colors"><Mail className="h-4 w-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#171717]/5 flex items-center justify-center text-[#171717] dark:text-white hover:bg-[#171717] hover:text-white transition-colors"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-[#171717] dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>Company</h3>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">About us</Link></li>
                <li><Link to="/properties" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Properties</Link></li>
                <li><Link to="/contact" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Contact</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-[#171717] dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>Products</h3>
              <ul className="space-y-4">
                <li><Link to="/properties" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">All Services</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Home Ownership</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Fractional Ownership</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Land Ownership</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-[#171717] dark:text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>Contact</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-[#171717] dark:text-white/40 font-bold tracking-widest uppercase mb-1">PHONE</p>
                  <p className="text-sm text-[#171717] dark:text-white/80">+234 805 659 9547</p>
                </div>
                <div>
                  <p className="text-xs text-[#171717] dark:text-white/40 font-bold tracking-widest uppercase mb-1">EMAIL</p>
                  <p className="text-sm text-[#171717] dark:text-white/80">hello@terrashare.ng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-black/5 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#171717]/50 dark:text-white/50">
            &copy; {new Date().getFullYear()} Terrashare Technologies Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-[#171717]/50 dark:text-white/50 hover:text-[#171717] dark:text-white">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-[#171717]/50 dark:text-white/50 hover:text-[#171717] dark:text-white">Terms of Use</Link>
            <Link to="#" className="text-sm text-[#171717]/50 dark:text-white/50 hover:text-[#171717] dark:text-white">Legal</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#171717]/5 rounded-2xl p-6 md:p-8 mt-4 border border-black/[0.03] dark:border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-[#171717]/60 dark:text-white/60" />
            <h4 className="text-lg text-[#171717] dark:text-white font-medium" style={{ fontFamily: 'Georgia, serif' }}>Disclaimer of liability</h4>
          </div>
          <p className="text-xs md:text-sm text-[#171717]/60 dark:text-white/60 leading-relaxed mb-4">
            Terrashare accepts no responsibility should any damages be caused to a person as a result of the use that is made of information provided in, or taken from, this site or as a result of reliance on the information available on the site.
          </p>
          <p className="text-xs md:text-sm text-[#171717]/60 dark:text-white/60 leading-relaxed">
            This disclaimer of liability also applies to any damages or injury caused by any failure of performance, error, omission, interruption, deletion, defect, delay in operation or transmission, computer virus, communication line failure, theft or destruction, or unauthorized access to, alteration of, or use of information under any cause of action. Terrashare is a technology intermediary and does not operate as a licensed lender or bank. All financing products are originated and provided by licensed capital partners.
          </p>
        </div>

      </div>
    </footer>
  );
}
