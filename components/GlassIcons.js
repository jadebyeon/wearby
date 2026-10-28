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
