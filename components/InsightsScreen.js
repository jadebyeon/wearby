"use client";

import { useState } from "react";
import NavBar from "@/components/NavBar";
import InsightCard from "@/components/InsightCard";
import { INSIGHTS_SAMPLE } from "@/data/insightsSample";

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TYPE_COLORS = ["#aa8bd0", "#a9b3a1", "#f2c49b"];

export default function InsightsScreen({ data = INSIGHTS_SAMPLE, onNavigate }) {
  const [range, setRange] = useState("30d");
  const d = data[range];

  const total = d.types.reduce((n, t) => n + t.count, 0) || 1;
  const shares = d.types.map((t) => Math.round((t.count / total) * 100));
  const maxStars = Math.max(1, ...d.ratingCounts);
  const topDay = d.weekdays.indexOf(Math.max(...d.weekdays));

  return (
    <main className="screen insights">
      <div className="ins-sheet">
        <h1 className="visually-hidden">Insights</h1>

        <section className="sum-card" aria-label="Summary">
          <img
            className="sum-sticker"
            src="/character/faces/face-laugh.svg"
            alt=""
          />
          <p className="ins-value">{d.saved}</p>
          <p className="ins-label">Outfits {d.label}</p>

          <ul className="sum-metrics">
            {d.types.map((t, i) => (
              <li key={t.name}>
                <i style={{ background: TYPE_COLORS[i] }} />
                <span className="sum-metric-name">{t.name}</span>
                <b>{t.count}</b>
              </li>
            ))}
          </ul>

          <div
            className="sum-bar"
            role="img"
            aria-label={`Share of ${d.types.map((t, i) => `${t.name} ${shares[i]} percent`).join(", ")}`}
          >
            {shares.map((p, i) => (
              <span
                key={i}
                style={{ width: `${p}%`, background: TYPE_COLORS[i] }}
              >
                {p}%
              </span>
            ))}
          </div>
        </section>

        <InsightCard value={d.avgRating} label="Average rating">
          <ul
            className="stars-dist"
            aria-label={`Outfits by stars: ${d.ratingCounts.map((c, i) => `${5 - i} stars ${c}`).join(", ")}`}
          >
            {d.ratingCounts.map((c, i) => (
              <li key={i}>
                <span>{5 - i}</span>
                <span className="dist-track">
                  <span
                    className="dist-fill"
                    style={{ width: `${(c / maxStars) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </InsightCard>

        <InsightCard value={d.streak} label="Streak" />

        <InsightCard value={DAY_NAMES[topDay]} label="Busiest day" />
      </div>

      <div className="ins-toggle-zone">
        <div className="ins-toggle" role="group" aria-label="Time range">
          {[
            ["7d", "7 days"],
            ["30d", "30 days"],
          ].map(([id, text]) => (
            <button
              key={id}
              type="button"
              className="ins-toggle-btn"
              aria-pressed={range === id}
              onClick={() => setRange(id)}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      <NavBar active="insights" onNavigate={onNavigate} />
    </main>
  );
}
