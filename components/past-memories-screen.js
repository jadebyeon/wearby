"use client";

import { useState } from "react";
import { pastMemories } from "@/data/pastMemories";
import { memoryLabel } from "@/lib/memories";
import Character from "@/components/Character";
import Star from "@/components/Star";
import NavBar from "@/components/NavBar";

export default function PastMemoriesScreen({ memories = [], order, onOrderChange, onOpenMemory, onNavigate }) {
  const [samples] = useState(pastMemories);
  const savedDays = new Set(memories.map((memory) => new Date(memory.savedAt).toDateString()));
  const records = [...memories, ...samples.filter((memory) => !savedDays.has(new Date(memory.savedAt).toDateString()))]
    .sort((a, b) => order === "oldest" ? new Date(a.savedAt) - new Date(b.savedAt) : new Date(b.savedAt) - new Date(a.savedAt));

  return (
    <main className="screen past-memories">
      <div className="past-scroll">
        <header className="past-header">
          <h1 className="text-h2">Past Memories</h1>
          <p className="text-body">{records.length} outfits saved</p>
        </header>
        <div className="past-sort">
          <details className="annual-year-picker past-sort-picker" onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
          }} onKeyDown={(event) => {
            if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); }
          }}>
            <summary className="cal-today" aria-label="Sort memories by date">{order === "oldest" ? "Oldest first" : "Newest first"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
            <div className="annual-year-options" role="group" aria-label="Sort order">
              {["newest", "oldest"].map((value) => <button type="button" className="text-body" key={value} aria-pressed={order === value} onClick={(event) => {
                onOrderChange(value);
                const picker = event.currentTarget.closest("details");
                picker.open = false;
                picker.querySelector("summary").focus();
              }}>{value === "newest" ? "Newest first" : "Oldest first"}</button>)}
            </div>
          </details>
        </div>
        <ul className="past-grid">
          {records.map((memory) => (
            <li key={memory.id}>
              <button type="button" className="past-card" onClick={() => onOpenMemory(memory)} aria-label={`Open memory from ${memoryLabel(memory.savedAt)}, ${memory.rating} stars`}>
                <span className="past-card-top">
                  <span className="past-thumb" style={memory.background ? { backgroundImage: `url("${memory.background}")` } : undefined}>
                    {memory.image && !memory.outfit ? <img src={memory.image} alt="" /> : <Character outfit={memory.outfit} />}
                  </span>
                  <span className="past-stars" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => <span key={n}><Star filled={n <= memory.rating} /></span>)}
                  </span>
                </span>
                <span className="text-small past-date">{memoryLabel(memory.savedAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <NavBar active="home" onNavigate={onNavigate} />
    </main>
  );
}
