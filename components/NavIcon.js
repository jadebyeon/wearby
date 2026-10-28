import Icon from "@/components/Icon";
import { NAV_ICONS } from "@/data/navIcons";

export default function NavIcon({ name, active }) {
  const data = NAV_ICONS[name];
  const size = active ? 40 : 28;

  if (!data || data.paths.length === 0) {
    return <Icon name={name} size={size} />;
  }

  return (
    <svg
      className="nav-svg"
      width={size}
      height={size}
      viewBox={data.viewBox}
      fill="none"
      aria-hidden="true"
    >
      {data.paths.map((d, i) => (
        <path key={i} d={d} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}