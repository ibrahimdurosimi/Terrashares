const fs = require('fs');

function replaceLogo(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /<Building2 className="h-7 w-7 text-\[\#9ABA1B\]" \/>\s*<span className="text-xl md:text-2xl text-\[\#171717\] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>\s*Terrashare\s*<\/span>/g,
    '<img src="/logo.png" alt="Terrashare" className="h-8 md:h-10 object-contain" onError={(e) => { e.currentTarget.style.display = \'none\'; e.currentTarget.nextElementSibling.style.display = \'flex\'; }} /><div className="hidden items-center gap-2" style={{display: "none"}}><Building2 className="h-7 w-7 text-[#9ABA1B]" /><span className="text-xl md:text-2xl text-[#171717] dark:text-white" style={{ fontFamily: \'Georgia, serif\' }}>Terrashare</span></div>'
  );
  content = content.replace(
    /<Building2 className="h-7 w-7 text-\[\#9ABA1B\]" \/>\s*<span className="text-2xl text-\[\#171717\] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}>\s*Terrashare\s*<\/span>/g,
    '<img src="/logo.png" alt="Terrashare" className="h-10 object-contain" onError={(e) => { e.currentTarget.style.display = \'none\'; e.currentTarget.nextElementSibling.style.display = \'flex\'; }} /><div className="hidden items-center gap-2" style={{display: "none"}}><Building2 className="h-7 w-7 text-[#9ABA1B]" /><span className="text-2xl text-[#171717] dark:text-white" style={{ fontFamily: \'Georgia, serif\' }}>Terrashare</span></div>'
  );
  fs.writeFileSync(filePath, content);
}

replaceLogo('src/components/Navbar.tsx');
replaceLogo('src/components/Footer.tsx');
