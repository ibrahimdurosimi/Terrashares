const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const oldList = `<ul className="space-y-4">
                <li><Link to="/properties" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">All Services</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Home Ownership</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Fractional Ownership</Link></li>
                <li><Link to="#" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Land Ownership</Link></li>
              </ul>`;

const newList = `<ul className="space-y-4">
                <li><Link to="/properties?category=all" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Buy</Link></li>
                <li><Link to="/properties?category=residential" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Completed Home</Link></li>
                <li><Link to="/properties?category=mixed_use" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Ongoing Projects</Link></li>
                <li><Link to="/properties?category=land" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Off-Plan Sales</Link></li>
                <li><Link to="/properties" className="text-[#171717]/60 dark:text-white/60 hover:text-[#9ABA1B] transition-colors text-sm">Halal Mortgage</Link></li>
              </ul>`;

content = content.replace(oldList, newList);
fs.writeFileSync('src/components/Footer.tsx', content);
