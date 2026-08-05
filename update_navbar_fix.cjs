const fs = require('fs');
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(
  '<header className={\\`fixed top-0 z-50 w-full transition-all duration-300 \\${scrolled ? \'bg-white/90 dark:bg-[#171717]/90 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5 py-2\' : \'bg-transparent py-4\'}\\`}>',
  '<header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? \'bg-white/90 dark:bg-[#171717]/90 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5 py-2\' : \'bg-transparent py-4\'}`}>'
);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
