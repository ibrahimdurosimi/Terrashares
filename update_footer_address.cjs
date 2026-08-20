const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

content = content.replace(
  '<p className="text-[#171717]/60 dark:text-white/60 leading-relaxed mb-8 max-w-sm">\n              A real estate technology platform connecting capital providers, buyers, and everyday Nigerians to affordable property ownership.\n            </p>',
  '<p className="text-[#171717]/60 dark:text-white/60 leading-relaxed mb-6 max-w-sm">\n              A real estate technology platform connecting capital providers, buyers, and everyday Nigerians to affordable property ownership.\n            </p>\n            <div className="mb-8 text-sm text-[#171717]/80 dark:text-white/80">\n              <p className="font-bold mb-1">Office Address:</p>\n              <p>Block C270, opposite Providus Bank,<br/>Ikota Shopping Complex, Ajah.</p>\n            </div>'
);

fs.writeFileSync('src/components/Footer.tsx', content);
