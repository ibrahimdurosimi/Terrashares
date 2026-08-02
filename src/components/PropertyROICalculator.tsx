import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'motion/react';

interface PropertyROICalculatorProps {
  minInvestment: number;
  returnsPercent: number;
  durationMonths: number;
}

export function PropertyROICalculator({ minInvestment, returnsPercent, durationMonths }: PropertyROICalculatorProps) {
  const [amount, setAmount] = useState<number>(minInvestment);

  // Simple ROI calculation: (amount * returnsPercent / 100)
  // Assuming returnsPercent is the total return over the duration, or is it annualized?
  // Let's assume returnsPercent is the total return over the duration based on "This property offers a projected return of X% over a duration of Y months."
  
  const totalProfit = amount * (returnsPercent / 100);
  const futureValue = amount + totalProfit;

  return (
    <div className="bg-[#F8F9FA] dark:bg-white/5 rounded-3xl p-6 md:p-8 border border-black/5 dark:border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-5 pointer-events-none">
        <Calculator className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#9ABA1B]/10 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-[#9ABA1B]" />
          </div>
          <h3 className="text-xl font-bold text-[#171717] dark:text-white">Calculate Your Returns</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-[#171717]/60 dark:text-white/60 uppercase tracking-wider">Investment Amount (₦)</label>
              <span className="font-bold text-[#171717] dark:text-white">₦{amount.toLocaleString()}</span>
            </div>
            
            <input 
              type="range" 
              min={minInvestment} 
              max={minInvestment * 20 > 100000000 ? minInvestment * 20 : 100000000} 
              step={minInvestment}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#9ABA1B]"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Min: ₦{minInvestment.toLocaleString()}</span>
              <span className="text-xs text-gray-500">Max: ₦{(minInvestment * 20 > 100000000 ? minInvestment * 20 : 100000000).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#171717] rounded-2xl p-4 border border-black/5 dark:border-white/5">
              <p className="text-xs font-bold text-[#171717]/50 dark:text-white/50 uppercase tracking-wider mb-1">Expected Return</p>
              <p className="text-xl font-black text-[#9ABA1B]">{returnsPercent}% <span className="text-xs text-[#171717] dark:text-white/40 font-normal">in {durationMonths}mo</span></p>
            </div>
            <div className="bg-white dark:bg-[#171717] rounded-2xl p-4 border border-black/5 dark:border-white/5">
              <p className="text-xs font-bold text-[#171717]/50 dark:text-white/50 uppercase tracking-wider mb-1">Total Profit</p>
              <p className="text-xl font-black text-[#171717] dark:text-white">₦{totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
          
          <div className="bg-[#9ABA1B]/10 dark:bg-[#9ABA1B]/5 rounded-2xl p-6 border border-[#9ABA1B]/20">
            <p className="text-xs font-bold text-[#9ABA1B] uppercase tracking-wider mb-1">Estimated Future Value</p>
            <motion.div 
              key={futureValue}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-black text-[#171717] dark:text-white" style={{ fontFamily: 'Georgia, serif' }}
            >
              ₦{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
