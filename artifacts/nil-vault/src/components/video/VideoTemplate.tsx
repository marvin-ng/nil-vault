import { motion, AnimatePresence } from "framer-motion";
import { useVideoPlayer } from "@/lib/video";
import { Scene1 } from "./video_scenes/Scene1";
import { Scene2 } from "./video_scenes/Scene2";
import { Scene3 } from "./video_scenes/Scene3";
import { Scene4 } from "./video_scenes/Scene4";
import { Scene5 } from "./video_scenes/Scene5";
import { Scene6 } from "./video_scenes/Scene6";

const SCENE_DURATIONS = {
  hook: 5000,
  problem: 7000,
  pipeline: 8000,
  compliance: 7000,
  income: 8000,
  close: 8000,
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070707] text-[#EBEBEB]" style={{ fontFamily: "'Lora', serif" }}>
      {/* Persistent Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #E8B84B, transparent)' }}
          animate={{ 
            x: ['-20%', '80%', '10%'], 
            y: ['-10%', '60%', '20%'], 
            scale: [1, 1.5, 0.8] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      </div>

      {/* Persistent UI Elements */}
      <motion.div 
        className="absolute top-10 left-12 z-50 font-black text-2xl tracking-widest text-[#EBEBEB] uppercase"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        animate={{ opacity: currentScene === 'close' ? 0 : 1 }}
      >
        NIL <span className="text-[#E8B84B]">Vault</span>
      </motion.div>

      {/* Ghost text background */}
      <motion.div 
        className="absolute -top-20 -left-10 z-0 text-[30vw] font-black uppercase leading-none opacity-5 tracking-tighter"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", WebkitTextStroke: "1px rgba(255,255,255,0.5)", color: "transparent" }}
        animate={{ 
          x: ['0%', '-10%', '-5%', '-20%', '0%', '10%'][Object.keys(SCENE_DURATIONS).indexOf(currentScene)] || 0,
          y: ['0%', '5%', '10%', '-5%', '-10%', '0%'][Object.keys(SCENE_DURATIONS).indexOf(currentScene)] || 0,
        }}
        transition={{ duration: 2, ease: "circOut" }}
      >
        {["480K", "CHAOS", "DEALS", "COMPLIANCE", "TRACKER", "VAULT"][Object.keys(SCENE_DURATIONS).indexOf(currentScene)]}
      </motion.div>

      <AnimatePresence initial={false} mode="wait">
        {currentScene === 'hook' && <Scene1 key="hook" />}
        {currentScene === 'problem' && <Scene2 key="problem" />}
        {currentScene === 'pipeline' && <Scene3 key="pipeline" />}
        {currentScene === 'compliance' && <Scene4 key="compliance" />}
        {currentScene === 'income' && <Scene5 key="income" />}
        {currentScene === 'close' && <Scene6 key="close" />}
      </AnimatePresence>
    </div>
  );
}