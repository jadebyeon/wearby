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

function Svg({ size = 24, viewBox = "0 0 24 24", children }) {
  return (
    <svg viewBox={viewBox} width={size} height={size} aria-hidden="true" {...base}>
      {children}
    </svg>
  );
}

export const ChevronLeft = (p) => (
  <Svg viewBox="3 3.75 16.5 16.5" {...p}>
    <path d="M15 19.5L7.5 12L15 4.5" />
  </Svg>
);

export const Bookmark = (p) => (
  <Svg viewBox="3.5 3.75 17 17" {...p}>
    <path d="M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14L12 16l-6.5 4V6A1.5 1.5 0 0 1 7 4.5Z" />
  </Svg>
);

export const Picture = (p) => (
  <Svg viewBox="3.25 3.25 17.5 17.5" {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <circle cx="9" cy="9.5" r="1.5" />
    <path d="M4.5 17l4.5-4.5 3.5 3.5 2.5-2.5 4.5 4.5" />
  </Svg>
);

export const Check = (p) => (
  <Svg viewBox="4.75 4.75 14.5 14.5" {...p}>
    <path d="M5.5 12.5l4.5 4.5L18.5 7" />
  </Svg>
);

export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4.5 8h15M4.5 12h15M4.5 16h15" />
  </Svg>
);

// Camera and trash come from the icon files camera.svg and delete.svg, drawn here in the current text color.
export const Camera = ({ size = 24 }) => (
  <svg viewBox="1.2 1.2 21.6 21.6" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M20.25 5.8125H17.0625L16.3031 3.68438C16.2507 3.53875 16.1545 3.41288 16.0278 3.32395C15.9011 3.23502 15.7501 3.18736 15.5953 3.1875H8.40469C8.08828 3.1875 7.80469 3.38672 7.69922 3.68438L6.9375 5.8125H3.75C2.71406 5.8125 1.875 6.65156 1.875 7.6875V18.375C1.875 19.4109 2.71406 20.25 3.75 20.25H20.25C21.2859 20.25 22.125 19.4109 22.125 18.375V7.6875C22.125 6.65156 21.2859 5.8125 20.25 5.8125ZM20.4375 18.375C20.4375 18.4781 20.3531 18.5625 20.25 18.5625H3.75C3.64688 18.5625 3.5625 18.4781 3.5625 18.375V7.6875C3.5625 7.58438 3.64688 7.5 3.75 7.5H8.12578L8.52656 6.37969L9.06328 4.875H14.9344L15.4711 6.37969L15.8719 7.5H20.25C20.3531 7.5 20.4375 7.58438 20.4375 7.6875V18.375ZM12 9C9.92813 9 8.25 10.6781 8.25 12.75C8.25 14.8219 9.92813 16.5 12 16.5C14.0719 16.5 15.75 14.8219 15.75 12.75C15.75 10.6781 14.0719 9 12 9ZM12 15C10.7578 15 9.75 13.9922 9.75 12.75C9.75 11.5078 10.7578 10.5 12 10.5C13.2422 10.5 14.25 11.5078 14.25 12.75C14.25 13.9922 13.2422 15 12 15Z" />
  </svg>
);

export const Trash = ({ size = 18 }) => (
  <svg viewBox="0 0 12 12" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.56262 2C4.56262 1.93294 4.60181 1.8188 4.71037 1.71025C4.81892 1.60169 4.93306 1.5625 5.00012 1.5625H7.00012C7.06718 1.5625 7.18132 1.60169 7.28987 1.71025C7.39843 1.8188 7.43762 1.93294 7.43762 2V2.43749H4.56262V2ZM3.99712 3.56249L4.00012 3.5625L4.00313 3.56249H7.9971L8.0001 3.5625L8.0031 3.56249H8.9376V9.99997C8.9376 10.067 8.89845 10.1812 8.78985 10.2898C8.68132 10.3983 8.56717 10.4375 8.50012 10.4375H3.50012C3.43306 10.4375 3.31892 10.3983 3.21037 10.2898C3.10181 10.1812 3.06262 10.067 3.06262 9.99997V3.56249H3.99712ZM3.43762 2.43749V2C3.43762 1.56706 3.64843 1.1812 3.91487 0.914752C4.18132 0.648308 4.56718 0.4375 5.00012 0.4375H7.00012C7.43306 0.4375 7.8189 0.648308 8.08538 0.914752C8.35185 1.1812 8.5626 1.56706 8.5626 2V2.43749H9.5001H10.5C10.8106 2.43749 11.0625 2.68933 11.0625 2.99999C11.0625 3.31065 10.8106 3.56249 10.5 3.56249H10.0626V9.99997C10.0626 10.4329 9.85185 10.8188 9.58537 11.0852C9.3189 11.3517 8.9331 11.5625 8.50012 11.5625H3.50012C3.06718 11.5625 2.68132 11.3517 2.41487 11.0852C2.14843 10.8188 1.93762 10.4329 1.93762 9.99997V3.56249H1.5C1.18934 3.56249 0.9375 3.31065 0.9375 2.99999C0.9375 2.68933 1.18934 2.43749 1.5 2.43749H2.50012H3.43762ZM4.99988 4.9375C5.31054 4.9375 5.56238 5.18934 5.56238 5.5V8.49997C5.56238 8.81069 5.31054 9.06247 4.99988 9.06247C4.68922 9.06247 4.43738 8.81069 4.43738 8.49997V5.5C4.43738 5.18934 4.68922 4.9375 4.99988 4.9375ZM7.56262 5.5C7.56262 5.18934 7.31078 4.9375 7.00012 4.9375C6.68946 4.9375 6.43762 5.18934 6.43762 5.5V8.49997C6.43762 8.81069 6.68946 9.06247 7.00012 9.06247C7.31078 9.06247 7.56262 8.81069 7.56262 8.49997V5.5Z" />
  </svg>
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
