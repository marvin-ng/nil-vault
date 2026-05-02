import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <div className="text-center mb-10">
        <h2 className="text-6xl font-black uppercase font-['Barlow_Condensed'] mb-2">
          FTC <span className="text-[#E8B84B]">Compliance</span>
        </h2>
        <p className="font-serif italic text-xl text-[#888]">Paste your caption. Know in seconds.</p>
      </div>

      <div className="w-full max-w-2xl bg-[#0f0f0f] border border-white/10 p-8 relative overflow-hidden">
        {/* Scanning effect */}
        <motion.div 
          className="absolute left-0 right-0 h-1 bg-[#E8B84B] shadow-[0_0_20px_#E8B84B] z-20"
          initial={{ top: "0%", opacity: 0 }}
          animate={{ 
            top: phase >= 2 && phase < 3 ? ["0%", "100%", "0%"] : phase >= 3 ? "100%" : "0%",
            opacity: phase >= 2 && phase < 3 ? 1 : 0
          }}
          transition={{ duration: 1.5, ease: "linear" }}
        />

        <div className="font-mono text-sm text-[#888] mb-4">Caption Draft:</div>
        <motion.div 
          className="text-lg leading-relaxed text-white/80 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          So excited to announce my partnership with @Nike! The new Alphafly 3 is incredible for my morning runs. Thanks for the gear! 
          <motion.span 
            className="text-[#E8B84B] font-bold"
            animate={{ opacity: phase >= 3 ? 1 : 0.5 }}
          > #ad #sponsored #nike</motion.span>
        </motion.div>

        <motion.div 
          className="flex items-center gap-3 bg-[#161616] p-4 border border-green-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-green-500" />
          </div>
          <div>
            <div className="font-bold text-green-500">Compliance Passed</div>
            <div className="font-mono text-xs text-[#888]">FTC guidelines met. Safe to post.</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}