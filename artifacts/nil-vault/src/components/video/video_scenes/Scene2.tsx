import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  "Brand deals living in your DMs.",
  "Contracts buried in your camera roll.",
  "Deadlines you didn't know you missed.",
];

function TypewriterLine({ text, delay }: { text: string; delay: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <div style={{ minHeight: 72, display: "flex", alignItems: "center" }}>
      {started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 52,
            textTransform: "uppercase",
            color: "#EBEBEB",
            lineHeight: 1,
            letterSpacing: 1,
          }}
        >
          {displayed}
          <span style={{ opacity: displayed.length < text.length ? 1 : 0, color: "#E8B84B" }}>|</span>
        </motion.div>
      )}
    </div>
  );
}

export function Scene2() {
  return (
    <motion.div
      style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        justifyContent: "center", paddingLeft: 96, paddingRight: 96,
      }}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, letterSpacing: 4,
          textTransform: "uppercase", color: "#E8B84B",
          marginBottom: 40,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        The Problem
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {LINES.map((line, i) => (
          <TypewriterLine key={line} text={line} delay={400 + i * 1800} />
        ))}
      </div>

      <motion.div
        style={{
          marginTop: 56,
          width: 64, height: 2,
          background: "#E8B84B",
        }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 6.2, duration: 0.6 }}
      />
    </motion.div>
  );
}
