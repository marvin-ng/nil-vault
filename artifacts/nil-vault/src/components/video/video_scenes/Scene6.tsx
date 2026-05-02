import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
      <motion.div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: 110,
          textTransform: "uppercase", letterSpacing: 8,
          lineHeight: 0.9,
          color: "#EBEBEB",
          textShadow: phase >= 1 ? "0 0 80px rgba(232,184,75,0.35), 0 0 160px rgba(232,184,75,0.15)" : "none",
          transition: "text-shadow 1.2s ease",
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: phase >= 1 ? 1 : 0.85, opacity: phase >= 1 ? 1 : 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 1.2 }}
      >
        NIL <span style={{ color: "#E8B84B" }}>Vault</span>
      </motion.div>

      <motion.div
        style={{
          fontFamily: "'Lora', serif",
          fontSize: 32, fontStyle: "italic",
          color: "#888", marginTop: 28, lineHeight: 1.4,
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 16 }}
        transition={{ duration: 0.7 }}
      >
        The back office you never had.
      </motion.div>

      <motion.div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13, letterSpacing: 2,
          textTransform: "uppercase",
          color: "#E8B84B",
          marginTop: 14,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 10 }}
        transition={{ duration: 0.6 }}
      >
        Free for athletes. Always.
      </motion.div>

      <motion.div
        style={{
          marginTop: 52,
          background: "#E8B84B",
          color: "#000",
          fontFamily: "'DM Mono', monospace",
          fontSize: 13, fontWeight: 700,
          letterSpacing: 3, textTransform: "uppercase",
          padding: "18px 48px",
          display: "inline-block",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={phase >= 4 ? {
          opacity: 1, y: 0,
          boxShadow: [
            "0 0 0px rgba(232,184,75,0)",
            "0 0 32px rgba(232,184,75,0.5)",
            "0 0 12px rgba(232,184,75,0.25)",
            "0 0 32px rgba(232,184,75,0.5)",
            "0 0 12px rgba(232,184,75,0.25)",
          ],
        } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
      >
        → Join the Waitlist
      </motion.div>
    </motion.div>
  );
}
