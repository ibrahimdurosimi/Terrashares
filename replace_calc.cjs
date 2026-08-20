const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldSection = `      {/* 7.5 Investment Calculator */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-white dark:bg-[#171717] overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[15vw] font-black text-[#171717]/[0.02] dark:text-white/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
          CALCULATE
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
          <div>
            <p className="text-[#9ABA1B] font-bold text-[16px] leading-[18px] tracking-[0.2em] uppercase mb-4">Project Returns</p>
            <h2 className="text-3xl md:text-5xl text-[#171717] dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              See how your money grows
            </h2>
            <p className="text-[20px] font-sans leading-[26.25px] text-[#171717]/60 dark:text-white/60 mb-8">
              Real estate offers some of the most stable, high-yield returns. Use our demo calculator to project potential earnings over time based on historical performance.
            </p>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="w-16 h-16 bg-[#9ABA1B]/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-[#9ABA1B]" />
            </motion.div>
          </div>
          <div>
            <InvestmentCalculator />
          </div>
        </div>
      </section>`;

const newSection = `      {/* 7.5 Chat With Our Team */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-20 bg-white dark:bg-[#171717] overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 text-[15vw] font-black text-[#171717]/[0.02] dark:text-white/[0.02] pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
          CONNECT
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <div>
            <p className="text-[#9ABA1B] font-bold text-[16px] leading-[18px] tracking-[0.2em] uppercase mb-4">Human Touch</p>
            <h2 className="text-3xl md:text-5xl text-[#171717] dark:text-white mb-6 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              We're real people,<br/>here to help.
            </h2>
            <p className="text-[18px] sm:text-[20px] font-sans leading-relaxed text-[#171717]/60 dark:text-white/60 mb-8 max-w-lg">
              Investing in real estate is a big decision. That's why our expert team is always available to answer your questions, guide you through properties, and ensure you feel completely secure.
            </p>
            <div className="flex gap-4 items-center">
              <a 
                href="https://wa.me/2348097701222" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#9ABA1B] text-[#171717] rounded-full font-bold shadow-xl shadow-[#9ABA1B]/20 hover:bg-[#85A316] transition-colors inline-flex items-center gap-2"
              >
                Chat With Our Team
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop" 
                alt="Our Team" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex -space-x-4 mb-3">
                  <img src="https://i.pravatar.cc/100?img=33" alt="Team member" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                  <img src="https://i.pravatar.cc/100?img=47" alt="Team member" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                  <img src="https://i.pravatar.cc/100?img=12" alt="Team member" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#9ABA1B] flex items-center justify-center text-white font-bold text-sm shadow-md">+12</div>
                </div>
                <p className="text-white font-medium text-sm drop-shadow-sm">Our support team replies in under 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>`;

content = content.replace(oldSection, newSection);

fs.writeFileSync('src/pages/Home.tsx', content);
