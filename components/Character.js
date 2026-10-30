import { resolveClothing } from "@/lib/custom-clothes";
import { PLACEMENT, placementFor } from "@/data/clothes";

export default function Character({ outfit }) {
  const worn = Object.entries(outfit)
    .map(([slot, id]) => ({ slot, item: resolveClothing(id) }))
    .filter(({ slot, item }) => item && PLACEMENT[slot]);

  const label = worn.length
    ? `Ear wearing ${worn.map(({ item }) => item.name.replace("-", " ")).join(", ")}`
    : "Ear without clothes";

  return (
    <div className="character" role="img" aria-label={label}>
      <img className="character-base" src="/character/ear.svg" alt="" />
      {worn.map(({ slot, item }) => {
        const p = placementFor(slot, item.name);
        return (
          <img
            key={item.id}
            className="character-item"
            src={item.src}
            alt=""
            style={{
              ...(p.center
                ? { left: "50%", transform: "translateX(-50%)" }
                : { left: `${p.left}%` }),
              ...(p.hem != null ? { height: `${p.hem - p.top}%` } : {}),
              ...(p.bottom != null ? { bottom: `${p.bottom}%` } : { top: `${p.top}%` }),
              width: `${p.width}%`,
              zIndex: p.z,
              ...(p.clipPath ? { clipPath: p.clipPath } : {}),
            }}
          />
        );
      })}
    </div>
  );
}