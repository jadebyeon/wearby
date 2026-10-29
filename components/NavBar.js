import NavIcon from "@/components/NavIcon";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "insights", label: "Insights", icon: "insights" },
  { id: "profile", label: "Profile", icon: "profile" },
];

export default function NavBar({ active, onNavigate }) {
  return (
    <nav className="navbar" aria-label="Main">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            className={isActive ? "nav-item active" : "nav-item"}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onNavigate?.(item.id)}
          >
            {isActive && <span className="nav-active-disc" aria-hidden="true" />}
            <span className="nav-icon-box" style={{ viewTransitionName: `nav-icon-${item.id}` }}>
              <NavIcon name={item.icon} active={isActive} />
            </span>
            <span className="text-small nav-label" style={{ viewTransitionName: `nav-label-${item.id}` }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}