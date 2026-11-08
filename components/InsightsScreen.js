"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import { pastMemories } from "@/data/pastMemories";
import { resolveClothing } from "@/lib/custom-clothes";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// A piece\u2019s color is the last word of its file name, like tee-black or jeans-blue.
const COLOR_ALIAS = { whitelong: "white", sunwhite: "white", sunblack: "black", blackmini: "black", denim: "blue", sunyellow: "yellow" };
const COLOR_INFO = {
  black: ["Black", "#2d2d2d"], white: ["White", "#f7f4ee"], gray: ["Gray", "#8d8d8d"], charcoal: ["Charcoal", "#4b4b4f"],
  ivory: ["Ivory", "#e9e0c8"], beige: ["Beige", "#d9c7a8"], camel: ["Camel", "#c19a6b"], brown: ["Brown", "#7a5a44"],
  red: ["Red", "#b94a43"], pink: ["Pink", "#e6a9b5"], orange: ["Orange", "#e5953f"], yellow: ["Yellow", "#e8c95a"],
  green: ["Green", "#7b9a6c"], blue: ["Blue", "#7ea0bb"], navy: ["Navy", "#2f3a55"],
};
// Black words on a pale circle, white words on a dark one.
function inkOn(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#2d2d2d" : "#ffffff";
}
function colorOf(item) {
  if (item.kind) return null; // an AI piece keeps its template\u2019s name, not its own color
  const word = String(item.name || "").split("-").pop();
  const key = COLOR_ALIAS[word] || word;
  return COLOR_INFO[key] ? key : null;
}
const SLOT_NAMES = { head: "Head", face: "Face", top: "Top", bottom: "Bottom", outer: "Outer", socks: "Socks", shoes: "Shoes" };

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
  const colorWears = new Map();
  for (const memory of selected) {
    months[new Date(memory.savedAt).getMonth()] += 1;
    if (Number.isInteger(memory.rating) && memory.rating >= 1 && memory.rating <= 5) ratings[memory.rating - 1] += 1;
    for (const id of new Set(Object.values(memory.outfit || {}))) {
      const item = resolveClothing(id);
      if (item) {
        clothing.set(item.id, item);
        wears.set(item.id, (wears.get(item.id) || 0) + 1);
        const color = colorOf(item);
        if (color) colorWears.set(color, (colorWears.get(color) || 0) + 1);
      }
    }
  }
  const ranked = [...wears].map(([id, count]) => ({ ...clothing.get(id), count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const top = ranked.slice(0, 5);
  const topColor = [...colorWears].sort((a, b) => b[1] - a[1])[0];
  const rated = ratings.reduce((a, b) => a + b, 0);
  const average = rated ? (ratings.reduce((sum, n, i) => sum + n * (i + 1), 0) / rated).toFixed(1) : "—";

  return (
    <main className="screen insights annual-insights">
      <div className="annual-scroll">
        <header className="annual-header">
          <div><h1 className="text-h2">Insights</h1></div>
          <details className="memo-sort" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
          }} onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false;
              event.currentTarget.querySelector("summary").focus();
            }
          }}>
            <summary className="memo-sort-btn" aria-label={`Year, ${year}`}>{year}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
            <div className="memo-sort-menu" role="group" aria-label="Choose year">
              {years.map((value, i) => (
                <span key={value}>
                  {i > 0 && <hr />}
                  <button type="button" aria-pressed={year === value} onClick={(event) => {
                    setYear(value);
                    const picker = event.currentTarget.closest("details");
                    picker.open = false;
                    picker.querySelector("summary").focus();
                  }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: year === value ? 1 : 0 }}><path d="m5 12.5 4.5 4.5L19 7" /></svg>{value}</button>
                </span>
              ))}
            </div>
          </details>
        </header>
        <section className="annual-card" aria-labelledby="monthly-title">
          <h2 className="ins-label" id="monthly-title">Outfits</h2>
          <p className="ins-big"><span className="ins-num ins-sage">{selected.length}</span></p>
          <div className="annual-months" role="img" aria-label={MONTHS.map((month, i) => `${month} ${months[i]}`).join(", ")}>
            {MONTHS.map((month, i) => (
              <div className="annual-month" key={month} aria-hidden="true">
                <div className="annual-bar-space" title={`${month}: ${months[i]} outfits`}><span className="annual-bar" style={{ height: `${months[i] / Math.max(1, ...months) * 100}%` }}></span></div>
                <span className="ins-mo">{i + 1}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="ins-pair">
          <section className="annual-card" aria-labelledby="rating-title">
            <h2 className="ins-label" id="rating-title">Average rating</h2>
            <p className="ins-big"><span className="ins-num ins-lilac">{average}</span></p>
            <div className="ins-rbars" role="img" aria-label={[5, 4, 3, 2, 1].map((n) => `${n} stars, ${ratings[n - 1]} outfits`).join(", ")}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} aria-hidden="true"><i style={{ height: `${Math.max(6, ratings[n - 1] / Math.max(1, ...ratings) * 100)}%` }} /><b>{n}</b></span>
              ))}
            </div>
          </section>
          <section className="annual-card" aria-labelledby="color-title">
            <h2 className="ins-label" id="color-title">Top color</h2>
            {topColor ? <>
              <span className="ins-badge" style={{ "--c": COLOR_INFO[topColor[0]][1], "--ink": inkOn(COLOR_INFO[topColor[0]][1]) }}>{COLOR_INFO[topColor[0]][0]}</span>
              <p className="ins-badge-note">{topColor[1]} times</p>
            </> : <p className="ins-note">No clothes saved yet.</p>}
          </section>
        </div>

        {top.length > 0 && (
          <section className="annual-card rank-card" aria-labelledby="worn-title">
            <h2 className="ins-label rank-title" id="worn-title">Most worn</h2>
            <ol className="rank-list">
              {top.map((item, i) => (
                <li className={i === 0 ? "rank-row first" : "rank-row"} key={item.id}>
                  <span className="rank-num">{i + 1}</span>
                  <span className="rank-pic"><img src={item.src} alt="" /></span>
                  <span className="rank-text">
                    <span className="rank-name">{item.label}</span>
                    <span className="rank-sub">{SLOT_NAMES[String(item.id).split("-")[0]] || "Piece"}</span>
                  </span>
                  <span className="rank-count">{item.count} {item.count === 1 ? "time" : "times"}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
      <NavBar active="insights" onNavigate={onNavigate} />
    </main>
  );
}
