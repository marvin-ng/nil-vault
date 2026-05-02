import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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

const DESIGN_W = 1280;
const DESIGN_H = 720;

export default function VideoTemplate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      setScale(containerRef.current.offsetWidth / DESIGN_W);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#070707" }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: DESIGN_W,
        height: DESIGN_H,
        transformOrigin: "top left",
        transform: `scale(${scale})`,
        fontFamily: "'Lora', serif",
        color: "#EBEBEB",
        overflow: "hidden",
      }}>
        {/* Persistent Background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <motion.div
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              opacity: 0.1,
              filter: "blur(80px)",
              background: "radial-gradient(circle, #E8B84B, transparent)",
            }}
            animate={{ x: ["-20%", "80%", "10%"], y: ["-10%", "60%", "20%"], scale: [1, 1.5, 0.8] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }} />
        </div>

        {/* NIL Vault logo */}
        <motion.div
          style={{
            position: "absolute", top: 36, left: 48, zIndex: 50,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: 28, letterSpacing: 6,
            textTransform: "uppercase", color: "#EBEBEB",
          }}
          animate={{ opacity: currentScene === "close" ? 0 : 1 }}
        >
          NIL <span style={{ color: "#E8B84B" }}>Vault</span>
        </motion.div>

        {/* Ghost word */}
        <motion.div
          style={{
            position: "absolute", top: -80, left: -40, zIndex: 0,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: 380, lineHeight: 1,
            textTransform: "uppercase", letterSpacing: -8,
            WebkitTextStroke: "1px rgba(255,255,255,0.5)",
            color: "transparent", opacity: 0.05,
            userSelect: "none", pointerEvents: "none",
          }}
          animate={{
            x: ["0%", "-10%", "-5%", "-20%", "0%", "10%"][Object.keys(SCENE_DURATIONS).indexOf(currentScene)] ?? 0,
            y: ["0%", "5%", "10%", "-5%", "-10%", "0%"][Object.keys(SCENE_DURATIONS).indexOf(currentScene)] ?? 0,
          }}
          transition={{ duration: 2, ease: "circOut" }}
        >
          {["480K", "CHAOS", "DEALS", "COMPLIANCE", "TRACKER", "VAULT"][Object.keys(SCENE_DURATIONS).indexOf(currentScene)]}
        </motion.div>

        <AnimatePresence initial={false} mode="wait">
          {currentScene === "hook" && <Scene1 key="hook" />}
          {currentScene === "problem" && <Scene2 key="problem" />}
          {currentScene === "pipeline" && <Scene3 key="pipeline" />}
          {currentScene === "compliance" && <Scene4 key="compliance" />}
          {currentScene === "income" && <Scene5 key="income" />}
          {currentScene === "close" && <Scene6 key="close" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
