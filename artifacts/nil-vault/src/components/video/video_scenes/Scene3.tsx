import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STAGES = ["Inquiry", "Negotiating", "Signed", "Posted", "Paid"];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 1900),
      setTimeout(() => setPhase(5), 2400),
      setTimeout(() => setPhase(6), 3200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const cardStage = Math.max(0, phase - 5);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 64px",
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7 }}
    >
      <div style={{ marginBottom: 36 }}>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: 4,
            textTransform: "uppercase", color: "#E8B84B",
            marginBottom: 12,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Deal Pipeline
        </motion.div>
        <motion.h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: 60,
            textTransform: "uppercase", lineHeight: 0.93,
            color: "#fff", margin: 0,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Every deal.{" "}
          <em style={{ color: "#E8B84B" }}>One pipeline.</em>
        </motion.h2>
      </div>

      <div style={{ display: "flex", gap: 6, height: 320 }}>
        {STAGES.map((stage, i) => {
          const isActive = phase >= i + 1;
          const hasCard = phase >= 6 && cardStage >= i;

          return (
            <motion.div
              key={stage}
              style={{
                flex: 1,
                background: "#0f0f0f",
                border: `1px solid ${isActive ? "rgba(232,184,75,0.2)" : "rgba(255,255,255,0.04)"}`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: isActive ? 1 : 0.15, y: isActive ? 0 : 24 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div style={{
                padding: "14px 16px 10px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, letterSpacing: 3,
                  textTransform: "uppercase",
                  color: isActive ? "#E8B84B" : "#444",
                  marginBottom: 4,
                }}>
                  0{i + 1}
                </div>
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: 18,
                  textTransform: "uppercase",
                  color: isActive ? "#EBEBEB" : "#333",
                }}>
                  {stage}
                </div>
              </div>

              <div style={{ flex: 1, padding: 12, position: "relative" }}>
                {hasCard && (
                  <motion.div
                    style={{
                      background: "#161616",
                      border: "1px solid rgba(232,184,75,0.35)",
                      padding: "12px 14px",
                      boxShadow: "0 0 16px rgba(232,184,75,0.12)",
                    }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                    </div>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700, fontSize: 15,
                      color: "#EBEBEB", marginBottom: 4,
                    }}>
                      Nike Elite
                    </div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12, color: "#E8B84B",
                    }}>
                      $4,500
                    </div>
                  </motion.div>
                )}
              </div>

              {i < STAGES.length - 1 && isActive && (
                <div style={{
                  position: "absolute", right: -10, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#E8B84B", fontSize: 18,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, zIndex: 2,
                }}>
                  ›
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
