// One small card, built like the home cards: a value on top, a muted label under it.
// The numbers come from props. A chart can sit on the right as children.
export default function InsightCard({ value, label, children }) {
  return (
    <section className="ins-card" aria-label={label}>
      <div className="ins-card-text">
        <p className="ins-value">{value}</p>
        <p className="ins-label">{label}</p>
      </div>
      {children && <div className="ins-chart">{children}</div>}
    </section>
  );
}
