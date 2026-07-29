const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// 1. Add imports
content = content.replace(
  "import { HowItWorks } from '../components/HowItWorks';",
  "import { HowItWorks } from '../components/HowItWorks';\nimport { InvestmentCalculator } from '../components/InvestmentCalculator';\nimport { SocialProofToast } from '../components/SocialProofToast';\nimport { AnimatedHeroText } from '../components/AnimatedHeroText';\nimport { AnimatedCounter } from '../components/AnimatedCounter';\nimport { motion } from 'motion/react';"
);

// 2. Add SocialProofToast to the return root
content = content.replace(
  "<div className=\"flex flex-col min-h-screen\">",
  "<div className=\"flex flex-col min-h-screen\">\n      <SocialProofToast />"
);

// 3. Update Hero headline
const heroText = /Invest in property,<br\/>\s*build your <span className="text-\[#9B8924\] italic" style=\{\{ fontFamily: 'Georgia, serif' \}\}>future\.<\/span>/s;
content = content.replace(heroText, "Invest in <AnimatedHeroText /><br/>build your <span className=\"text-[#9B8924] italic\" style={{ fontFamily: 'Georgia, serif' }}>future.</span>");

// 4. Update Stats numbers
const statsHtml = /<div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-\[#0A0A0A\]\/10 py-8">.*?<\/div>\s*<\/div>\s*<\/div>/s;
content = content.replace(statsHtml, `<div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[#0A0A0A]/10 py-8 relative">
              {/* Floating element */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-[#F7D0BC]/40 blur-md"></motion.div>
              
              <div className="text-center border-r border-[#0A0A0A]/10 px-4">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.props} />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Properties</div>
              </div>
              <div className="text-center md:border-r border-[#0A0A0A]/10 px-4">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.invested} prefix="$" isCurrency={true} />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Invested</div>
              </div>
              <div className="text-center border-r border-[#0A0A0A]/10 px-4 mt-8 md:mt-0">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.members} />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Members</div>
              </div>
              <div className="text-center px-4 mt-8 md:mt-0">
                <div className="text-3xl md:text-5xl font-black text-[#0A0A0A] mb-1">
                  <AnimatedCounter value={stats.avgRoi} suffix="%" />
                </div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#0A0A0A]/50">Avg Returns</div>
              </div>
            </div>
          )}
        </div>
      </div>`);

// 5. Add Investment Calculator section
const aboutSectionRegex = /\{\/\*\ 8\.\ About TerraShare section \*\/\}/s;
content = content.replace(aboutSectionRegex, `{/* 7.5 Investment Calculator */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-20 bg-white overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[15vw] font-black text-[#0A0A0A]/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
          CALCULATE
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <p className="text-[#9B8924] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">Project Returns</p>
            <h2 className="text-4xl md:text-5xl text-[#0A0A0A] mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              See how your money grows
            </h2>
            <p className="text-lg text-[#0A0A0A]/60 mb-8 leading-relaxed">
              Real estate offers some of the most stable, high-yield returns. Use our demo calculator to project potential earnings over time based on historical performance.
            </p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="w-16 h-16 bg-[#F7D0BC]/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#9B8924]" />
            </motion.div>
          </div>
          <div>
            <InvestmentCalculator />
          </div>
        </div>
      </section>

      {/* 8. About TerraShare section */}`);

// Compact paddings globally
content = content.replace(/py-20/g, 'py-16');

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx successfully!");
