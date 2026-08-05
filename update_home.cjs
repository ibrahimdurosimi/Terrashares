const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Adjust hero text sizes
content = content.replace(
  'className="text-5xl md:text-7xl font-black leading-[1.1] mb-8 max-w-4xl tracking-tight text-[#171717] dark:text-white"',
  'className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] mb-6 md:mb-8 max-w-4xl tracking-tight text-[#171717] dark:text-white"'
);

content = content.replace(
  'className="text-[20px] leading-[30px] font-sans text-center font-normal text-[#171717] dark:text-gray-300 no-underline not-italic w-[650px] max-w-full mb-12"',
  'className="text-lg md:text-[20px] leading-[28px] md:leading-[30px] font-sans text-center font-normal text-[#171717] dark:text-gray-300 no-underline not-italic w-[650px] max-w-full mb-8 md:mb-12 px-2"'
);

// Other headings in Home
content = content.replace(
  'className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-6 leading-[1.1]"',
  'className="text-3xl md:text-5xl text-[#171717] dark:text-white mb-6 leading-[1.1]"'
);
content = content.replace(
  'className="text-5xl md:text-6xl text-[#171717] dark:text-white leading-[1.1] mb-6"',
  'className="text-3xl sm:text-4xl md:text-6xl text-[#171717] dark:text-white leading-[1.1] mb-6"'
);
content = content.replace(
  'className="text-4xl md:text-5xl text-[#171717] dark:text-white mb-8 leading-[1.1]"',
  'className="text-3xl md:text-5xl text-[#171717] dark:text-white mb-8 leading-[1.1]"'
);
content = content.replace(
  'className="text-4xl md:text-5xl text-white mb-8 leading-[1.1]"',
  'className="text-3xl md:text-5xl text-white mb-6 md:mb-8 leading-[1.1]"'
);

// Gap adjustments
content = content.replace(
  'className="grid lg:grid-cols-2 gap-16 mb-20 items-center"',
  'className="grid lg:grid-cols-2 gap-8 md:gap-16 mb-12 md:mb-20 items-center"'
);
content = content.replace(
  'className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10"',
  'className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10"'
);

fs.writeFileSync('src/pages/Home.tsx', content, 'utf8');
