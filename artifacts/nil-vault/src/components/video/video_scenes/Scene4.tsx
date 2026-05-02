import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 120px",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: "circOut" }}
    >
      <motion.div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, letterSpacing: 4,
          textTransform: "uppercase", color: "#E8B84B",
          marginBottom: 36,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        FTC Compliance
      </motion.div>

      <div style={{ width: "100%", maxWidth: 680 }}>
        <motion.div
          style={{
            background: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "32px 36px",
            position: "relative",
            overflow: "hidden",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: 3,
            textTransform: "uppercase", color: "#666",
            marginBottom: 16,
          }}>
            Caption Draft
          </div>

          <motion.div
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 22, color: "#EBEBEB",
              lineHeight: 1.6, marginBottom: 28,
              fontStyle: "italic",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            "Check out my new protein bar!"
          </motion.div>

          <AnimatePresence mode="wait">
            {phase < 3 && phase >= 2 && (
              <motion.div
                key="warning"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  padding: "16px 20px",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ fontSize: 22, lineHeight: 1 }}>⚠</div>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 20,
                    textTransform: "uppercase", color: "#ef4444",
                    marginBottom: 4,
                  }}>
                    Missing #ad disclosure.
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11, color: "#888", letterSpacing: 1,
                  }}>
                    FTC requires clear sponsorship disclosure before posting.
                  </div>
                </div>
              </motion.div>
            )}

            {phase >= 3 && (
              <motion.div
                key="fixed"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  padding: "16px 20px",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
              >
                <motion.div
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(34,197,94,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                >
                  <div style={{ color: "#22c55e", fontSize: 18, fontWeight: 700 }}>✓</div>
                </motion.div>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 20,
                    textTransform: "uppercase", color: "#22c55e",
                    marginBottom: 4,
                  }}>
                    Fixed. Post with confidence.
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11, color: "#E8B84B", letterSpacing: 1,
                  }}>
                    Add: #ad #sponsored — FTC compliant ✓
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
