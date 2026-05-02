import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <motion.div 
          className="text-8xl font-black uppercase font-['Barlow_Condensed'] tracking-widest mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: phase >= 1 ? 1 : 0.8, opacity: phase >= 1 ? 1 : 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
        >
          NIL <span className="text-[#E8B84B] drop-shadow-[0_0_30px_rgba(232,184,75,0.5)]">Vault</span>
        </motion.div>
        
        <motion.div 
          className="font-serif italic text-3xl text-[#888] mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: phase >= 2 ? 0 : 20, opacity: phase >= 2 ? 1 : 0 }}
        >
          Your back office.
        </motion.div>

        <motion.div 
          className="inline-block bg-[#E8B84B] text-black font-mono uppercase tracking-widest text-sm font-bold py-4 px-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: phase >= 3 ? 0 : 20, opacity: phase >= 3 ? 1 : 0 }}
        >
          Join the Waitlist →
        </motion.div>
      </div>
    </motion.div>
  );
}