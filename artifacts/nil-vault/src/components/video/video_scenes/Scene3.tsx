import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLUMNS = [
  {
    stage: "Inquiry",
    deals: [
      { brand: "Gatorade", amount: "$2,000", badge: "New", badgeColor: "#E8B84B", badgeBg: "rgba(232,184,75,0.12)" },
      { brand: "Under Armour", amount: "$800", badge: "New", badgeColor: "#E8B84B", badgeBg: "rgba(232,184,75,0.12)" },
    ],
  },
  {
    stage: "Negotiating",
    deals: [
      { brand: "Ascent Protein", amount: "$1,200", badge: "3 days", badgeColor: "#E8B84B", badgeBg: "rgba(232,184,75,0.12)" },
    ],
  },
  {
    stage: "Signed",
    deals: [
      { brand: "Local Ford", amount: "$400", badge: "On track", badgeColor: "#22c55e", badgeBg: "rgba(34,197,94,0.1)" },
      { brand: "State Farm", amount: "$650", badge: "On track", badgeColor: "#22c55e", badgeBg: "rgba(34,197,94,0.1)" },
    ],
  },
  {
    stage: "Posted",
    deals: [
      { brand: "Campus Cuts", amount: "$200", badge: "Awaiting $", badgeColor: "#f59e0b", badgeBg: "rgba(245,158,11,0.1)" },
    ],
  },
  {
    stage: "Paid",
    deals: [
      { brand: "Nike Elite", amount: "$4,500", badge: "Closed", badgeColor: "#22c55e", badgeBg: "rgba(34,197,94,0.1)" },
    ],
  },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1100),
      setTimeout(() => setPhase(4), 1500),
      setTimeout(() => setPhase(5), 1900),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 56px",
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.7 }}
    >
      <div style={{ marginBottom: 24 }}>
        <motion.div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: 4,
            textTransform: "uppercase", color: "#E8B84B",
            marginBottom: 10,
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
            fontWeight: 900, fontSize: 54,
            textTransform: "uppercase", lineHeight: 0.93,
            color: "#fff", margin: 0,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Every deal.{" "}
          <em style={{ color: "#E8B84B", fontStyle: "italic" }}>One pipeline.</em>
        </motion.h2>
      </div>

      <div style={{ display: "flex", gap: 8, height: 340 }}>
        {COLUMNS.map((col, i) => {
          const isActive = phase >= i + 1;

          return (
            <motion.div
              key={col.stage}
              style={{
                flex: 1,
                background: "#0f0f0f",
                border: `1px solid ${isActive ? "rgba(232,184,75,0.18)" : "rgba(255,255,255,0.04)"}`,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: isActive ? 1 : 0.12, y: isActive ? 0 : 28 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{
                padding: "12px 14px 9px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9, letterSpacing: 3,
                    textTransform: "uppercase",
                    color: isActive ? "#E8B84B" : "#333",
                    marginBottom: 3,
                  }}>
                    0{i + 1}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    textTransform: "uppercase",
                    color: isActive ? "#EBEBEB" : "#2a2a2a",
                  }}>
                    {col.stage}
                  </div>
                </div>
                {isActive && (
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: "#555",
                    background: "#1a1a1a",
                    padding: "2px 7px",
                  }}>
                    {col.deals.length}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, padding: "8px 8px 0", display: "flex", flexDirection: "column", gap: 6, overflowY: "hidden" }}>
                {col.deals.map((deal, di) => (
                  <motion.div
                    key={deal.brand}
                    style={{
                      background: "#141414",
                      borderLeft: "2px solid rgba(232,184,75,0.4)",
                      padding: "11px 12px 10px",
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 + di * 0.15 }}
                  >
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700, fontSize: 15,
                      color: "#EBEBEB", lineHeight: 1.2,
                      marginBottom: 4,
                    }}>
                      {deal.brand}
                    </div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 12, color: "#E8B84B",
                      fontWeight: 600,
                      marginBottom: 8,
                    }}>
                      {deal.amount}
                    </div>
                    <div style={{
                      display: "inline-block",
                      background: deal.badgeBg,
                      color: deal.badgeColor,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 9, letterSpacing: 1,
                      padding: "3px 7px",
                      textTransform: "uppercase",
                    }}>
                      {deal.badge}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
