const fs = require('fs');
let content = fs.readFileSync('src/components/WhyLoveCarousel.tsx', 'utf8');

content = content.replace(
  'className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"',
  'className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar items-stretch"'
);

content = content.replace(
  'className="snap-start shrink-0 w-[280px] md:w-[320px] bg-white dark:bg-[#171717] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 hover:-translate-y-1 transition-transform duration-300"',
  'className="snap-start shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] bg-white dark:bg-[#171717] rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 hover:-translate-y-1 transition-transform duration-300 flex flex-col h-auto"'
);

content = content.replace(
  '<p className="text-[#171717]/60 dark:text-white/60 leading-relaxed">{adv.desc}</p>',
  '<p className="text-[#171717]/60 dark:text-white/60 leading-relaxed text-sm sm:text-base flex-grow">{adv.desc}</p>'
);

fs.writeFileSync('src/components/WhyLoveCarousel.tsx', content);
