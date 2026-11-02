"use client";

import { useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import Character from "@/components/Character";
import Star from "@/components/Star";
import { pastMemories } from "@/data/pastMemories";
import { ChevronLeft } from "@/components/GlassIcons";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const keyOf = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const dayClass = (isToday, isSelected) =>
  isSelected ? "cal-num selected" : isToday ? "cal-num today" : "cal-num";

export default function CalendarScreen({ memories, onNavigate }) {
  const [today] = useState(() => new Date());
  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });
  const [selected, setSelected] = useState(null); // the memory shown at the bottom

  // The newest memory of each day (memories are saved newest first)
  const byDay = useMemo(() => {
    const map = new Map();
    // Real saved memories win over the prototype past records
    for (const mem of [...memories, ...pastMemories(today)]) {
      const k = keyOf(new Date(mem.savedAt));
      if (!map.has(k)) map.set(k, mem);
    }
    return map;
  }, [memories, today]);

  const first = new Date(view.y, view.m, 1);
  const offset = (first.getDay() + 6) % 7; // the week starts on Monday
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  const todayKey = keyOf(today);
  const savedThisMonth = Array.from({ length: days }, (_, i) => i + 1).filter(
    (d) => byDay.has(`${view.y}-${view.m}-${d}`),
  ).length;

  function shift(n) {
    const d = new Date(view.y, view.m + n, 1);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setSelected(null);
  }

  const selDate = selected ? new Date(selected.savedAt) : null;

  return (
    <main className="screen calendar">
      <div className="cal-scroll">
        <header className="cal-head">
          <div>
            <div className="cal-title-row">
              <h1 className="text-h2 cal-title">
                {view.y}.{String(view.m + 1).padStart(2, "0")}
              </h1>
              <div className="cal-arrows">
                <button
                  type="button"
                  className="cal-arrow"
                  onClick={() => shift(-1)}
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="cal-arrow cal-arrow-next"
                  onClick={() => shift(1)}
                  aria-label="Next month"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
            <p className="text-body cal-sub">
              {savedThisMonth === 0
                ? "No outfits saved this month"
                : `${savedThisMonth} outfit${savedThisMonth > 1 ? "s" : ""} saved this month`}
            </p>
          </div>
          <details className="annual-year-picker" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
          }} onKeyDown={(event) => {
            if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); }
          }}>
            <summary className="cal-today" aria-label={`Year, ${view.y}`}>{view.y}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
            <div className="annual-year-options" role="group" aria-label="Choose year">
              {[...new Set([view.y, today.getFullYear(), today.getFullYear() - 1, ...memories.map((m) => new Date(m.savedAt).getFullYear())])].sort((a, b) => b - a).map((year) => <button type="button" className="text-body" key={year} aria-pressed={view.y === year} onClick={(event) => {
                setView((prev) => ({ ...prev, y: year })); setSelected(null);
                const picker = event.currentTarget.closest("details"); picker.open = false; picker.querySelector("summary").focus();
              }}>{year}</button>)}
            </div>
          </details>
        </header>

        <div className="cal-grid cal-week" aria-hidden="true">
          {WEEK.map((w) => (
            <span key={w} className="text-small">
              {w}
            </span>
          ))}
        </div>

        <div className="cal-grid cal-days">
          {cells.map((d, i) => {
            if (d === null) return <span key={`e${i}`} />;
            const k = `${view.y}-${view.m}-${d}`;
            const mem = byDay.get(k);
            const isToday = k === todayKey;
            const label = `${MONTHS[view.m]} ${d}${mem ? `, saved, ${mem.rating} stars` : ""}`;
            const inner = mem ? (
              <span
                className="cal-thumb"
                style={mem.background ? { backgroundImage: `url("${mem.background}")` } : undefined}
              >
                {mem.image && !mem.outfit ? (
                  <img className="memory-photo" src={mem.image} alt="" />
                ) : (
                  <Character outfit={mem.outfit} />
                )}
              </span>
            ) : (
              <span className={dayClass(isToday, false)}>{d}</span>
            );
            return mem ? (
              <button
                key={k}
                type="button"
                className="cal-day"
                aria-label={`${label}. Show below`}
                aria-pressed={selected?.id === mem.id}
                onClick={() => setSelected(mem)}
              >
                {inner}
              </button>
            ) : (
              <div key={k} className="cal-day" role="img" aria-label={label}>
                {inner}
              </div>
            );
          })}
        </div>

        {selected && (
          <section className="cal-detail" aria-label="Saved outfit">
            {selected.image && !selected.outfit ? (
              <img
                className="cal-photo"
                src={selected.image}
                alt={`Memory from ${MONTHS[selDate.getMonth()]} ${selDate.getDate()}, ${selected.rating} stars`}
              />
            ) : (
              <>
                <div
                  className="cal-preview"
                  style={
                    selected.background
                      ? { backgroundImage: `url("${selected.background}")` }
                      : undefined
                  }
                >
                  <Character outfit={selected.outfit} />
                </div>
                <div className="cal-note">
                  <p className="confirm-row confirm-rating">
                    <span className="confirm-label">Rating:</span>
                    <span
                      className="confirm-stars"
                      role="img"
                      aria-label={`${selected.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span key={n} className="confirm-star">
                          <Star filled={n <= selected.rating} />
                        </span>
                      ))}
                    </span>
                  </p>
                  {selected.keep && (
                    <p className="confirm-row confirm-text">{selected.keep}</p>
                  )}
                  {selected.leave && (
                    <p className="confirm-row confirm-text">{selected.leave}</p>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </div>

      <NavBar active="calendar" onNavigate={onNavigate} />
    </main>
  );
}
