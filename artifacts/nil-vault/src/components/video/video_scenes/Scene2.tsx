import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-[1024px] h-[432px]">
        <motion.div 
          className="absolute top-10 left-10 p-6 bg-[#0f0f0f] border border-[#161616] max-w-md shadow-2xl"
          initial={{ opacity: 0, x: -100, rotate: -10 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, x: phase >= 1 ? 0 : -100, rotate: phase >= 1 ? -5 : -10 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="font-mono text-sm text-[#E8B84B] mb-2 uppercase tracking-widest">Problem 01</div>
          <div className="text-3xl font-black font-['Barlow_Condensed'] uppercase leading-none">Brand deals in your DMs.</div>
        </motion.div>

        <motion.div 
          className="absolute bottom-20 right-10 p-6 bg-[#0f0f0f] border border-[#161616] max-w-md shadow-2xl"
          initial={{ opacity: 0, x: 100, rotate: 10 }}
          animate={{ opacity: phase >= 2 ? 1 : 0, x: phase >= 2 ? 0 : 100, rotate: phase >= 2 ? 4 : 10 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="font-mono text-sm text-[#E8B84B] mb-2 uppercase tracking-widest">Problem 02</div>
          <div className="text-3xl font-black font-['Barlow_Condensed'] uppercase leading-none">Contracts in your camera roll.</div>
        </motion.div>

        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-[#E8B84B] text-black max-w-xl shadow-[0_0_50px_rgba(232,184,75,0.3)] z-20"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: phase >= 3 ? 1 : 0, scale: phase >= 3 ? 1 : 0.5 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className="font-mono text-xs mb-2 uppercase tracking-widest">Problem 03</div>
          <div className="text-5xl font-black font-['Barlow_Condensed'] uppercase leading-none">Deadlines in your head.</div>
        </motion.div>
      </div>
    </motion.div>
  );
}