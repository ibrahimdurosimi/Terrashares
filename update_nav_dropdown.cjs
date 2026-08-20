const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Add ChevronDown to lucide-react imports if not there
if (!content.includes('ChevronDown')) {
  content = content.replace('import { Building2, Sun, Moon, Menu, X, Bell } from \'lucide-react\';', 'import { Building2, Sun, Moon, Menu, X, Bell, ChevronDown } from \'lucide-react\';');
}

// Replace the simple navLinks rendering with one that supports dropdowns
content = content.replace(
  '{navLinks.map((link) => (\n              <Link key={link.to} to={link.to} className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">\n                {link.name}\n              </Link>\n            ))}',
  `
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">
                Our Products <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col z-50">
                <Link to="/properties" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Buy</Link>
                <Link to="/properties?type=completed" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Completed Home</Link>
                <Link to="/properties?type=ongoing" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Ongoing Projects</Link>
                <Link to="/properties?type=offplan" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Off-Plan Sales</Link>
                <Link to="/properties?type=halal" className="px-4 py-2 text-sm text-[#171717] dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#9ABA1B]">Halal Mortgage</Link>
              </div>
            </div>
            <Link to="/about" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">Contact</Link>
  `
);

// Do the same for mobile nav
content = content.replace(
  '{navLinks.map((link) => (\n                <Link \n                  key={link.to} \n                  to={link.to} \n                  onClick={() => setMobileMenuOpen(false)}\n                  className="text-lg font-semibold text-[#171717] dark:text-white hover:text-[#9ABA1B] dark:hover:text-[#9ABA1B] transition-colors py-2"\n                >\n                  {link.name}\n                </Link>\n              ))}',
  `
                <div className="py-2">
                  <div className="text-lg font-semibold text-[#171717] dark:text-white mb-2">Our Products</div>
                  <div className="pl-4 flex flex-col gap-2">
                    <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Buy</Link>
                    <Link to="/properties?type=completed" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Completed Home</Link>
                    <Link to="/properties?type=ongoing" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Ongoing Projects</Link>
                    <Link to="/properties?type=offplan" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Off-Plan Sales</Link>
                    <Link to="/properties?type=halal" onClick={() => setMobileMenuOpen(false)} className="text-[#171717]/70 dark:text-white/70 hover:text-[#9ABA1B]">Halal Mortgage</Link>
                  </div>
                </div>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#171717] dark:text-white hover:text-[#9ABA1B] transition-colors py-2">About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#171717] dark:text-white hover:text-[#9ABA1B] transition-colors py-2">Contact</Link>
  `
);

fs.writeFileSync('src/components/Navbar.tsx', content);
