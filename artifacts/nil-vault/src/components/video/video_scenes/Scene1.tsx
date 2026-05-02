import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene1() {
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
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "circOut" }}
    >
      <motion.div 
        className="absolute left-0 top-1/2 w-full h-[2px] bg-[#E8B84B] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      
      <div className="relative z-20 text-center flex flex-col items-center gap-4 bg-[#070707] px-12 py-8 border border-white/5">
        <motion.h1 
          className="text-[8vw] font-black uppercase text-white leading-none tracking-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          initial={{ y: 50, opacity: 0, rotateX: 30 }}
          animate={{ y: phase >= 1 ? 0 : 50, opacity: phase >= 1 ? 1 : 0, rotateX: phase >= 1 ? 0 : 30 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        >
          480,000 <span className="text-[#E8B84B]">Athletes.</span>
        </motion.h1>
        
        <motion.p 
          className="text-4xl text-[#888] italic"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: phase >= 2 ? 0 : 20, opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          Zero systems.
        </motion.p>
      </div>
    </motion.div>
  );
}