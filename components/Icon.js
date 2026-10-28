export default function Icon({ name, size = 24 }) {
  return (
    <span
      className="icon"
      aria-hidden="true"
      style={{ "--icon": `url(/icons/${name}.svg)`, width: size, height: size }}
    />
  );
}