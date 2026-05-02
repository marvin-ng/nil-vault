import { useState, useEffect, useRef } from "react";

type Durations = Record<string, number>;

export function useVideoPlayer({ durations }: { durations: Durations }) {
  const keys = Object.keys(durations);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      (window as any).startRecording?.();
    }
    const key = keys[idxRef.current];
    const ms = durations[key];
    const t = setTimeout(() => {
      const next = (idxRef.current + 1) % keys.length;
      if (next === 0 && idxRef.current === keys.length - 1) {
        (window as any).stopRecording?.();
      }
      idxRef.current = next;
      setIdx(next);
    }, ms);
    return () => clearTimeout(t);
  }, [idx, keys, durations]);

  return { currentScene: keys[idx] };
}