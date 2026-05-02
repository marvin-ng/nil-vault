import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (phase >= 1) {
      const interval = setInterval(() => {
        setCounter(c => Math.min(c + 154, 7725));
      }, 30);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10 px-20 gap-20"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex-1 max-w-lg">
        <h2 className="text-6xl font-black uppercase font-['Barlow_Condensed'] mb-4 leading-none">
          Track <span className="text-[#E8B84B]">Every</span><br />Dollar.
        </h2>
        <p className="font-serif italic text-xl text-[#888]">NIL income is self-employment income. Know what you owe before tax season.</p>
      </div>

      <div className="flex-1 bg-[#0f0f0f] border border-white/10 p-8 shadow-2xl relative overflow-hidden">
        <div className="font-mono text-xs uppercase tracking-widest text-[#888] mb-2">Season Total</div>
        <div className="text-6xl font-black font-['DM_Mono'] text-[#E8B84B] mb-8">
          ${counter.toLocaleString()}
        </div>

        <div className="space-y-4">
          {[
            { brand: "Nike Elite", amount: 4500, date: "Oct 12" },
            { brand: "Ascent Protein", amount: 1200, date: "Sep 28" },
            { brand: "Local Dealership", amount: 2025, date: "Sep 15" },
          ].map((payment, i) => (
            <motion.div 
              key={i}
              className="flex justify-between items-center bg-[#161616] p-4 border border-white/5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: phase >= i + 2 ? 1 : 0, x: phase >= i + 2 ? 0 : 50 }}
              transition={{ type: "spring" }}
            >
              <div>
                <div className="font-bold">{payment.brand}</div>
                <div className="font-mono text-xs text-[#888]">{payment.date}</div>
              </div>
              <div className="font-mono text-[#E8B84B]">+${payment.amount.toLocaleString()}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}