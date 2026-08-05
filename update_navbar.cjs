const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Add Menu, X to lucide-react imports
if (!content.includes('Menu,')) {
    content = content.replace("import { Building2, Sun, Moon } from 'lucide-react';", "import { Building2, Sun, Moon, Menu, X } from 'lucide-react';\nimport { AnimatePresence, motion } from 'motion/react';");
}

// Add state for mobile menu
if (!content.includes('const [mobileMenuOpen')) {
    content = content.replace('const [scrolled, setScrolled] = useState(false);', 'const [scrolled, setScrolled] = useState(false);\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);');
}

// Update the return statement to include the mobile menu toggle button and the mobile menu itself
const oldNav = `<nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/properties" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">Properties</Link>
            <Link to="/about" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-semibold text-[#171717] dark:text-white/80 hover:text-[#9ABA1B] dark:hover:text-white transition-colors">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-[#9ABA1B] hover:opacity-70 transition-opacity">Admin</Link>
            )}
          </nav>`;

if (content.includes(oldNav)) {
    // We keep the old nav as is, and add a toggle button inside the right-side flex container, and a mobile menu below the header
}

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
