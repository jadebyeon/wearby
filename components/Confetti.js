"use client";

import { useEffect, useState } from "react";

const COLORS = ["#f2c49b", "#a9b3a1", "#346332", "#bfaebf", "#f5f0e8", "#9ca9b5", "#0e0c2e"];
const COUNT = 54;
const SHOW_MS = 5200;

// Small paper pieces fall once from the top, then the layer is removed.
export default function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const long = 8 + Math.random() * 16;
      return {
        id: i,
        left: Math.random() * 100,
        width: long,
        height: 5 + Math.random() * 9,
        color: COLORS[i % COLORS.length],
        slant: Math.random() > 0.5,
        delay: Math.random() * 0.9,
        duration: 2.6 + Math.random() * 1.8,
        sway: (Math.random() - 0.5) * 120,
        spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540),
        start: Math.random() * 360,
      };
    }),
  );
  const [visible, setVisible] = useState(true);

  // The layer is removed after the pieces have fallen. People who turn motion off see none (CSS).
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), SHOW_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={p.slant ? "confetti-piece slant" : "confetti-piece"}
          style={{
            left: `${p.left}%`,
            width: p.width,
            height: p.height,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--sway": `${p.sway}px`,
            "--spin": `${p.spin}deg`,
            "--start": `${p.start}deg`,
          }}
        />
      ))}
    </div>
  );
}
