export default function Star({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M12 2.8l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.7 6.2 20.1l1.5-6.4L2.8 9.4l6.5-.6z"
        fill={filled ? "var(--secondary-peach)" : "none"}
        stroke="var(--secondary-peach)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
