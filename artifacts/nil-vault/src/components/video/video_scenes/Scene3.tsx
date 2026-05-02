import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 7000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const stages = ["Inquiry", "Negotiating", "Signed", "Posted", "Paid"];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10 px-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-6xl mb-12 flex justify-between items-end border-b border-white/10 pb-4">
        <h2 className="text-5xl font-black uppercase font-['Barlow_Condensed']">
          The <span className="text-[#E8B84B]">Pipeline</span>
        </h2>
      </div>

      <div className="w-full max-w-6xl flex gap-4 h-[400px]">
        {stages.map((stage, i) => (
          <div key={stage} className="flex-1 bg-[#0f0f0f] border border-white/5 relative overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 font-mono text-xs uppercase tracking-widest text-[#888]">
              0{i + 1} // {stage}
            </div>
            
            {/* The Deal Card */}
            <motion.div 
              className="m-4 bg-[#161616] p-4 border border-[#E8B84B]/30 shadow-[0_0_15px_rgba(232,184,75,0.1)] z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: phase > i ? 1 : 0, 
                y: phase > i ? 0 : 20,
                scale: phase === i + 1 ? 1.05 : 1
              }}
              transition={{ type: "spring" }}
            >
              <div className="flex gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="font-bold text-lg mb-1">Nike Elite</div>
              <div className="text-[#E8B84B] font-mono text-sm">$4,500</div>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}