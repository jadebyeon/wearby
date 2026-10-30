"use client";

import { useEffect, useRef, useState } from "react";
import { pastMemories } from "@/data/pastMemories";
import { memoryMeta, updateMemoryMeta, memoryLabel } from "@/lib/memories";
import Character from "@/components/Character";
import Star from "@/components/Star";
import NavBar from "@/components/NavBar";

function ActionIcon({ kind }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "pin" ? <><path d="M8 3h8l-1 7 3 5H6l3-5-1-7Z" /><path d="M12 15v6" /></> : kind === "share" ? <><path d="M12 15V2m-4 4 4-4 4 4M7 10H4v12h16V10h-3" /></> : <><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7" /></>}
  </svg>;
}

function MemoryPreview({ memory, onClose, onOpen, onUpdate }) {
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  async function share() {
    const text = [`My Wearby memory · ${memoryLabel(memory.savedAt)}`, `${memory.rating}/5 stars`, memory.keep, memory.leave].filter(Boolean).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "Wearby memory", text });
      else { await navigator.clipboard.writeText(text); setMessage("Memory copied!"); }
    } catch (error) { if (error.name !== "AbortError") setMessage("Couldn’t share. Try again."); }
  }
  function update(changes) {
    if (updateMemoryMeta(memory.id, changes)) { onUpdate(); onClose(); }
    else setMessage("Couldn’t save. Try again.");
  }
  const dialog = useRef(null);
  useEffect(() => {
    const node = dialog.current;
    node.showModal();
    return () => node.close();
  }, []);
  return (
    <dialog ref={dialog} className="memory-preview" aria-label={`Memory preview from ${memoryLabel(memory.savedAt)}`} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="memory-preview-content">
        <div className="memory-preview-actions">
          <button type="button" className="text-body" onClick={() => update({ pinned: !memoryMeta(memory.id).pinned })}>{memoryMeta(memory.id).pinned ? "Unpin Memory" : "Pin Memory"}<ActionIcon kind="pin" /></button>
          <button type="button" className="text-body" onClick={share}>Share Memory<ActionIcon kind="share" /></button>
          <button type="button" className="text-body memory-delete" onClick={() => confirmDelete ? update({ deleted: true }) : setConfirmDelete(true)}>{confirmDelete ? "Confirm Delete" : "Delete"}<ActionIcon kind="delete" /></button>
          {message && <p className="text-small" role="status">{message}</p>}
        </div>
        <button type="button" className="past-card" onClick={onOpen} aria-label="Open memory">
          <span className="past-card-top">
            <span className="past-thumb" style={memory.background ? { backgroundImage: `url("${memory.background}")` } : undefined}>
              {memory.image && !memory.outfit ? <img src={memory.image} alt="Saved outfit" /> : <Character outfit={memory.outfit} />}
            </span>
            <span className="past-stars" aria-label={`${memory.rating} stars`}>
              {[1, 2, 3, 4, 5].map((n) => <span key={n}><Star filled={n <= memory.rating} /></span>)}
            </span>
          </span>
          <span className="text-small past-date">{memoryLabel(memory.savedAt)}</span>
        </button>
      </div>
    </dialog>
  );
}

export default function PastMemoriesScreen({ memories = [], order, onOrderChange, onOpenMemory, onNavigate, onMemoriesChange }) {
  const [, refresh] = useState(0);
  const [preview, setPreview] = useState(null);
  const press = useRef(null);
  const suppressClick = useRef(false);
  function cancelPress() {
    clearTimeout(press.current?.timer);
    press.current = null;
  }
  useEffect(() => () => clearTimeout(press.current?.timer), []);
  function startPress(event, memory) {
    cancelPress();
    suppressClick.current = false;
    if (!event.isPrimary || event.button !== 0) return;
    press.current = { x: event.clientX, y: event.clientY, timer: setTimeout(() => {
      suppressClick.current = true;
      setPreview(memory);
    }, 500) };
  }
  const [samples] = useState(pastMemories);
  const savedDays = new Set(memories.map((memory) => new Date(memory.savedAt).toDateString()));
  const records = [...memories, ...samples.filter((memory) => !savedDays.has(new Date(memory.savedAt).toDateString()))]
    .filter((memory) => !memoryMeta(memory.id).deleted)
    .sort((a, b) => Number(!!memoryMeta(b.id).pinned) - Number(!!memoryMeta(a.id).pinned) || (order === "oldest" ? new Date(a.savedAt) - new Date(b.savedAt) : new Date(b.savedAt) - new Date(a.savedAt)));

  return (
    <main className="screen past-memories">
      <div className="past-surface">
      <div className="past-scroll">
        <header className="past-header">
          <h1 className="text-h2">Past Memories</h1>
          <p className="text-body">You have recorded {records.length} memories!</p>
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
              <button type="button" className="past-card" onPointerDown={(event) => startPress(event, memory)}
                onPointerMove={(event) => { if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 10) cancelPress(); }}
                onPointerUp={cancelPress} onPointerCancel={cancelPress} onPointerLeave={cancelPress}
                onContextMenu={(event) => { event.preventDefault(); cancelPress(); suppressClick.current = true; setPreview(memory); }}
                onKeyDown={(event) => { if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) { event.preventDefault(); setPreview(memory); } }}
                onClick={(event) => { if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; } onOpenMemory(memory); }} aria-label={`Open memory from ${memoryLabel(memory.savedAt)}, ${memory.rating} stars`}>
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
      </div>
      {preview && <MemoryPreview onUpdate={() => { refresh((n) => n + 1); onMemoriesChange?.(); }} memory={preview} onClose={() => setPreview(null)} onOpen={() => { setPreview(null); onOpenMemory(preview); }} />}
    </main>
  );
}
