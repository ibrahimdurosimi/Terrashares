import { Home, Globe, Briefcase, Users, Heart } from 'lucide-react';

const items = [
  {
    text: "First-time buyers looking for a safe place to start",
    icon: <Home className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Diaspora Nigerians ready to invest back home",
    icon: <Globe className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Entrepreneurs growing a property portfolio",
    icon: <Briefcase className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Families buying their forever home",
    icon: <Users className="w-8 h-8 text-[#9B8924]" />
  },
  {
    text: "Everyday people tired of waiting for \"someday\"",
    icon: <Heart className="w-8 h-8 text-[#9B8924]" />
  }
];

export function WhoIsItFor() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className={`bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] dark:border-white/5 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between ${idx === 3 ? 'md:col-span-2 lg:col-span-1' : ''} ${idx === 4 ? 'md:col-span-2 lg:col-span-2' : ''}`}
        >
          <div className="w-16 h-16 bg-[#FAF8F5] dark:bg-[#111] rounded-2xl flex items-center justify-center mb-6">
            {item.icon}
          </div>
          <p className="font-bold text-[#0A0A0A] dark:text-white text-xl leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}
