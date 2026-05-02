import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PAYMENTS = [
  { brand: "Nike Elite", amount: 4500, date: "Oct 12" },
  { brand: "Ascent Protein", amount: 1200, date: "Sep 28" },
  { brand: "Local Dealership", amount: 2025, date: "Sep 15" },
];

export function Scene5() {
  const [phase, setPhase] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => setPhase(4), 3200),
      setTimeout(() => setPhase(5), 4400),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  useEffect(() => {
    if (phase >= 1) {
      let current = 0;
      const target = 7725;
      const duration = 1400;
      const steps = 60;
      const increment = target / steps;
      const interval = setInterval(() => {
        current = Math.min(current + increment, target);
        setCounter(Math.round(current));
        if (current >= target) clearInterval(interval);
      }, duration / steps);
      return () => clearInterval(interval);
    }
  }, [phase]);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", alignItems: "center",
        padding: "0 80px", gap: 64,
      }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.7 }}
    >
      <div style={{ flex: "0 0 340px" }}>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: 4,
            textTransform: "uppercase", color: "#E8B84B",
            marginBottom: 16,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Income Tracker
        </motion.div>
        <motion.h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900, fontSize: 62,
            textTransform: "uppercase", lineHeight: 0.93,
            color: "#fff", margin: "0 0 16px",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Track Every Dollar.
        </motion.h2>
        <motion.p
          style={{
            fontFamily: "'Lora', serif",
            fontSize: 18, color: "#888",
            lineHeight: 1.7, fontStyle: "italic",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          NIL income is self-employment income. Know what you owe before tax season hits.
        </motion.p>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 32px 24px",
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: 3,
            textTransform: "uppercase", color: "#666",
            marginBottom: 8,
          }}>
            Season Total
          </div>
          <motion.div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontWeight: 900, fontSize: 72,
              color: "#E8B84B", lineHeight: 1,
              marginBottom: 28,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
          >
            ${counter.toLocaleString()}
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PAYMENTS.map((p, i) => (
              <motion.div
                key={p.brand}
                style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center",
                  background: "#161616",
                  padding: "14px 18px",
                  borderLeft: "2px solid rgba(232,184,75,0.3)",
                }}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: phase >= i + 2 ? 1 : 0, x: phase >= i + 2 ? 0 : 40 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              >
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 18,
                    color: "#EBEBEB",
                  }}>
                    {p.brand}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10, color: "#666",
                    letterSpacing: 1,
                  }}>
                    {p.date}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 16, color: "#E8B84B",
                  fontWeight: 600,
                }}>
                  +${p.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderTop: "none",
            padding: "16px 32px",
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: phase >= 5 ? 1 : 0, y: phase >= 5 ? 0 : 8 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, color: "rgba(239,68,68,0.8)",
            letterSpacing: 2, textTransform: "uppercase",
          }}>
            Q3 Tax Due
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 20, fontWeight: 700,
            color: "rgba(239,68,68,0.85)",
          }}>
            $1,180
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
