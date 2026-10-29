"use client";

import { useEffect, useRef, useState } from "react";

// Thin line icons (1.5 stroke, round ends) for the round glass buttons.
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ size = 24, children }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base}>
      {children}
    </svg>
  );
}

export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="M15 19.5L7.5 12L15 4.5" />
  </Svg>
);

export const Bookmark = (p) => (
  <Svg {...p}>
    <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14L12 16l-6.5 4V6A1.5 1.5 0 0 1 7 4.5Z" />
  </Svg>
);

export const Picture = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9" cy="9.5" r="1.5" />
    <path d="M4.5 17l4.5-4.5 3.5 3.5 2.5-2.5 4.5 4.5" />
  </Svg>
);

export const Check = (p) => (
  <Svg {...p}>
    <path d="M5.5 12.5l4.5 4.5L18.5 7" />
  </Svg>
);

export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4.5 8h15M4.5 12h15M4.5 16h15" />
  </Svg>
);

export const Camera = (p) => (
  <Svg {...p}>
    <path d="M4 7h4l2-3h4l2 3h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.5" r="4" />
  </Svg>
);

// Sample the visible header crop, including cover scaling, after image load/resize.
export function useGlassTone(source) {
  const surfaceRef = useRef(null);
  const [tone, setTone] = useState({ source: null, dark: false });
  useEffect(() => {
    if (!source || !surfaceRef.current) return;
    let cancelled = false;
    const img = new Image();
    const sample = () => {
      if (cancelled || !img.naturalWidth || !surfaceRef.current) return;
      try {
        const { width, height } = surfaceRef.current.getBoundingClientRect();
        const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
        const canvas = document.createElement("canvas");
        canvas.width = 64; canvas.height = 16;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 64, 16);
        const cropX = (img.naturalWidth - width / scale) / 2;
        const cropY = (img.naturalHeight - height / scale) / 2;
        ctx.drawImage(img, cropX, cropY, width / scale, Math.min(90, height) / scale, 0, 0, 64, 16);
        const pixels = ctx.getImageData(0, 0, 64, 16).data;
        let light = 0;
        for (let i = 0; i < pixels.length; i += 4) light += .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
        setTone({ source, dark: light / (64 * 16) < 145 });
      } catch { setTone({ source, dark: false }); }
    };
    img.onload = sample;
    img.src = source;
    const observer = new ResizeObserver(sample);
    observer.observe(surfaceRef.current);
    return () => { cancelled = true; observer.disconnect(); img.onload = null; };
  }, [source]);
  return { surfaceRef, darkGlass: tone.source === source && tone.dark };
}
