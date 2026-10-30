"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import { pastMemories } from "@/data/pastMemories";
import { resolveClothing } from "@/lib/custom-clothes";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLORS = ["#a9b3a1", "#bfaebf", "#f2c49b", "#9ca9b5", "#356230", "#ddd6ca"];

export default function InsightsScreen({ memories = [], onNavigate }) {
  const [today] = useState(() => new Date());
  const [year, setYear] = useState(today.getFullYear());
  const savedDays = new Set(memories.map((m) => new Date(m.savedAt).toDateString()));
  // Preview-only records for earlier months. Never written to localStorage.
  const samples = pastMemories(today);
  const monthlySamples = [6, 9, 4, 12, 8, 15, 10, 7, 13, 9, 6, 11];
  const annualSamples = monthlySamples.flatMap((count, month) =>
    month < today.getMonth() ? Array.from({ length: count }, (_, i) => ({
      ...samples[(month + i) % samples.length],
      id: `annual-sample-${month}-${i}`,
      savedAt: new Date(today.getFullYear(), month, i + 1, 12).toISOString(),
    })) : []
  );
  const records = [...memories, ...[...samples, ...annualSamples].filter((m) => !savedDays.has(new Date(m.savedAt).toDateString()))];
  const years = [...new Set([today.getFullYear(), ...records.map((m) => new Date(m.savedAt).getFullYear())])].sort((a, b) => b - a);
  const selected = records.filter((m) => new Date(m.savedAt).getFullYear() === year);
  const months = Array(12).fill(0);
  const ratings = Array(5).fill(0);
  const wears = new Map();
  const clothing = new Map();
  for (const memory of selected) {
    months[new Date(memory.savedAt).getMonth()] += 1;
    if (Number.isInteger(memory.rating) && memory.rating >= 1 && memory.rating <= 5) ratings[memory.rating - 1] += 1;
    for (const id of new Set(Object.values(memory.outfit || {}))) {
      const item = resolveClothing(id);
      if (item) { clothing.set(item.id, item); wears.set(item.id, (wears.get(item.id) || 0) + 1); }
    }
  }
  const ranked = [...wears].map(([id, count]) => ({ ...clothing.get(id), count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const top = ranked.slice(0, 5);
  const other = ranked.slice(5).reduce((sum, item) => sum + item.count, 0);
  const slices = [...top, ...(other ? [{ id: "other", label: "Other", count: other }] : [])];
  const totalWears = slices.reduce((sum, item) => sum + item.count, 0);
  let angle = 0;
  const gradient = slices.map((item, i) => {
    const start = angle;
    angle += item.count / totalWears * 360;
    return `${COLORS[i]} ${start}deg ${angle}deg`;
  }).join(", ");
  const rated = ratings.reduce((a, b) => a + b, 0);
  const average = rated ? (ratings.reduce((sum, n, i) => sum + n * (i + 1), 0) / rated).toFixed(1) : "—";

  return (
    <main className="screen insights annual-insights">
      <div className="annual-scroll">
        <header className="annual-header">
          <div><h1 className="text-h2">Insights</h1>
          <p className="text-body">Your year in outfits</p></div>
          <details className="annual-year-picker" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
          }} onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false;
              event.currentTarget.querySelector("summary").focus();
            }
          }}>
            <summary className="cal-today" aria-label={`Year, ${year}`}>{year}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
            <div className="annual-year-options" role="group" aria-label="Choose year">
              {years.map((value) => <button className="text-body" type="button" key={value} aria-pressed={year === value} onClick={(event) => {
                setYear(value);
                const picker = event.currentTarget.closest("details");
                picker.open = false;
                picker.querySelector("summary").focus();
              }}>{value}</button>)}
            </div>
          </details>
        </header>
        <section className="annual-card" aria-labelledby="monthly-title">
          <h2 className="text-body" id="monthly-title">{selected.length} outfits</h2>
          <div className="annual-months" role="img" aria-label={MONTHS.map((month, i) => `${month} ${months[i]}`).join(", ")}>
            {MONTHS.map((month, i) => (
              <div className="annual-month" key={month} aria-hidden="true">
                <div className="annual-bar-space" title={`${month}: ${months[i]} outfits`}><span className="annual-bar" style={{ height: `${months[i] / Math.max(1, ...months) * 100}%` }}>{months[i] > 0 && <span className="text-small annual-count">{months[i]}</span>}</span></div>
              </div>
            ))}
          </div>
        </section>
        <section className="annual-card" aria-labelledby="rating-title">
          <h2 className="text-body" id="rating-title">Average rating</h2>
          <div className="annual-rating">
            <p className="text-h2">{average}</p>
            <ul className="annual-ratings" aria-label="Rating distribution">
              {[5, 4, 3, 2, 1].map((n) => <li key={n} aria-label={`${n} stars, ${ratings[n - 1]} outfits`}><span className="text-small">{n}</span><span className="annual-rating-track"><span style={{ width: `${ratings[n - 1] / Math.max(1, ...ratings) * 100}%` }} /></span><span className="text-small">{ratings[n - 1]}</span></li>)}
            </ul>
          </div>
        </section>
        <section className="annual-card" aria-labelledby="worn-title">
          <h2 className="text-body" id="worn-title">Most worn</h2>
          {top.length ? <>
            <div className="annual-pie-layout">
              <div className="annual-pie" style={{ background: `conic-gradient(${gradient})` }} role="img" aria-label={slices.map((item) => `${item.label}, ${item.count} times`).join(", ")} />
              <ul className="annual-legend">{slices.map((item, i) => <li key={item.id}><i style={{ background: COLORS[i] }} /><span className="text-small">{item.label}</span><span className="text-small">{item.count}</span></li>)}</ul>
            </div>
          </> : <p className="text-body">No clothes saved yet.</p>}
        </section>
        <ol className="annual-ranking">
          {top.map((item, i) => <li className="annual-card" key={item.id}><span className="text-h3">{i + 1}</span><div><h3 className="text-body">{item.label}</h3><p className="text-body">{item.count} {item.count === 1 ? "time" : "times"}</p></div><img src={item.src} alt="" /></li>)}
        </ol>
      </div>
      <NavBar active="insights" onNavigate={onNavigate} />
    </main>
  );
}
