import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { Database } from '../types/database';

type FAQ = Database['public']['Tables']['faqs']['Row'];

export function FAQAccordion() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (data && data.length > 0) {
        setFaqs(data);
        setOpenId(data[0].id);
      } else {
        // Fallback dummy data if table is empty
        const dummyFaqs: FAQ[] = [
          { id: '1', question: 'What is the minimum investment?', answer: 'The minimum investment varies by property but typically starts at $5,000 for fractional ownership opportunities.', sort_order: 1, created_at: '' },
          { id: '2', question: 'When do I receive my returns?', answer: 'Returns are distributed either monthly or after maturity depending on the specific terms of the property. Check the "Payout Style" on each property detail page.', sort_order: 2, created_at: '' },
          { id: '3', question: 'Are my investments liquid?', answer: 'Real estate is generally an illiquid asset. Investments are meant to be held for the full target duration (typically 12-60 months).', sort_order: 3, created_at: '' },
        ];
        setFaqs(dummyFaqs);
        setOpenId(dummyFaqs[0].id);
      }
    }
    fetchFaqs();
  }, []);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openId === faq.id;
        return (
          <div 
            key={faq.id} 
            className={cn(
              "border rounded-[2rem] overflow-hidden transition-colors duration-300 shadow-sm",
              isOpen ? "border-[#9B8924] bg-white/60 backdrop-blur-sm" : "border-black/5 bg-white/40 backdrop-blur-sm hover:bg-white/60"
            )}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  "text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                  isOpen ? "bg-[#9B8924] text-white" : "bg-[#0A0A0A]/10 text-[#0A0A0A]/50"
                )}>
                  {index + 1}
                </span>
                <span className="font-semibold text-lg text-[#0A0A0A]">{faq.question}</span>
              </div>
              <ChevronDown className={cn(
                "w-5 h-5 text-[#0A0A0A]/40 transition-transform duration-300 shrink-0",
                isOpen && "rotate-180 text-[#9B8924]"
              )} />
            </button>
            
            <div 
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 pt-0 text-[#0A0A0A]/70 pl-[3.25rem] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
