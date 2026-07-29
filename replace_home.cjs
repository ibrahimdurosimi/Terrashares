const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Imports
content = content.replace("import { WhoIsItForCarousel } from '../components/WhoIsItForCarousel';", "import { WhoIsItFor } from '../components/WhoIsItFor';\nimport { WhyLoveCarousel } from '../components/WhyLoveCarousel';\nimport { HowItWorks } from '../components/HowItWorks';");

// Section 7 (Steps) replace with HowItWorks
const stepsRegex = /\{\/\*\ 7\.\ Steps section \*\/\}.*?(?=\{\/\*\ 9\.\ Who Is It For)/s;
content = content.replace(stepsRegex, "{/* 7. How It Works */}\n      <HowItWorks />\n\n      ");

// "Who Is It For?" - replace <WhoIsItForCarousel /> with <WhoIsItFor />
content = content.replace("<WhoIsItForCarousel />", "<WhoIsItFor />");

// "Why People Love TerraShare" - replace the grid with WhyLoveCarousel
const whyLoveRegex = /<div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/s;
content = content.replace(whyLoveRegex, `<div className="lg:col-span-7">\n              <WhyLoveCarousel />\n            </div>\n          </div>\n        </div>\n      </section>`);

// FAQ - remove "SPEAK WITH OUR EXPERT"
const expertRegex = /<div className="bg-white p-8 md:p-10 rounded-3xl border border-black\/\[0\.03\] shadow-\[0_8px_30px_rgb\(0,0,0,0\.04\)\] text-center md:text-left">.*?<\/div>\s*<\/div>\s*<div className="lg:col-span-7">/s;
content = content.replace(expertRegex, '</div>\n\n          <div className="lg:col-span-7">');

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Replaced successfully!");
