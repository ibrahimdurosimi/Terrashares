import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'motion/react';

export function InvestmentCalculator() {
  const [amount, setAmount] = useState<number>(500000);
  const [duration, setDuration] = useState<number>(5);
  const expectedReturnRate = 0.18; // 18% annual return
  
  const futureValue = amount * Math.pow((1 + expectedReturnRate), duration);
  const totalProfit = futureValue - amount;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] max-w-xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Calculator className="w-48 h-48" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#9B8924]/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#9B8924]" />
          </div>
          <h3 className="text-2xl text-[#0A0A0A]" style={{ fontFamily: 'Georgia, serif' }}>Investment Calculator</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-[#0A0A0A]/60 uppercase tracking-wider">Initial Investment (₦)</label>
              <span className="font-bold text-[#0A0A0A]">₦{amount.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="50000" 
              max="10000000" 
              step="50000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9B8924]"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-[#0A0A0A]/60 uppercase tracking-wider">Duration (Years)</label>
              <span className="font-bold text-[#0A0A0A]">{duration} Years</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#9B8924]"
            />
          </div>
          
          <div className="mt-8 bg-[#FAF8F5] rounded-2xl p-6 border border-black/5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-[#0A0A0A]/50 uppercase tracking-wider mb-1">Expected Return</p>
                <p className="text-2xl font-black text-[#9B8924]">18% <span className="text-sm text-[#0A0A0A]/40 font-normal">/yr</span></p>
              </div>
              <div>
                <p className="text-xs font-bold text-[#0A0A0A]/50 uppercase tracking-wider mb-1">Total Profit</p>
                <p className="text-2xl font-black text-[#0A0A0A]">₦{totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-black/5">
              <p className="text-xs font-bold text-[#0A0A0A]/50 uppercase tracking-wider mb-1">Estimated Future Value</p>
              <motion.div 
                key={futureValue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-[#0A0A0A]" style={{ fontFamily: 'Georgia, serif' }}
              >
                ₦{futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
