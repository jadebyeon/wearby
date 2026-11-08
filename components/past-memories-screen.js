"use client";

import { useEffect, useRef, useState } from "react";
import { pastMemories } from "@/data/pastMemories";
import { memoryMeta, updateMemoryMeta, memoryLabel } from "@/lib/memories";
import Character from "@/components/Character";
import Star from "@/components/Star";
import NavBar from "@/components/NavBar";
import { Trash } from "@/components/GlassIcons";

function ActionIcon({ kind }) {
  if (kind === "delete") return <Trash size={18} />;
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "pin" ? <><path d="M8 3h8l-1 7 3 5H6l3-5-1-7Z" /><path d="M12 15v6" /></> : <path d="M12 15V2m-4 4 4-4 4 4M7 10H4v12h16V10h-3" />}
  </svg>;
}

function Tile({ memory }) {
  return (
    <span className="past-thumb" style={memory.background ? { backgroundImage: `url("${memory.background}")` } : undefined}>
      {memory.image && !memory.outfit ? <img src={memory.image} alt="" /> : <Character outfit={memory.outfit} />}
      {memory.rating ? <span className="past-tile-rating"><span className="past-tile-star"><Star filled /></span>{memory.rating}</span> : null}
      <span className="past-tile-date">{memoryLabel(memory.savedAt)}</span>
    </span>
  );
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
        <div className="memory-preview-actions" role="menu">
          <button type="button" role="menuitem" onClick={() => update({ pinned: !memoryMeta(memory.id).pinned })}><ActionIcon kind="pin" />{memoryMeta(memory.id).pinned ? "Unpin Memory" : "Pin Memory"}</button>
          <hr />
          <button type="button" role="menuitem" onClick={share}><ActionIcon kind="share" />Share Memory</button>
          <hr />
          <button type="button" role="menuitem" className="memory-delete" onClick={() => confirmDelete ? update({ deleted: true }) : setConfirmDelete(true)}><ActionIcon kind="delete" />{confirmDelete ? "Confirm Delete" : "Delete"}</button>
          {message && <p className="text-small" role="status">{message}</p>}
        </div>
        <button type="button" className="preview-card" onClick={onOpen} aria-label="Open memory">
          <span className="preview-art" style={memory.background ? { backgroundImage: `url("${memory.background}")` } : undefined}>
            {memory.image && !memory.outfit ? <img src={memory.image} alt="" /> : <Character outfit={memory.outfit} />}
          </span>
          {memory.rating ? <span className="preview-stars" role="img" aria-label={`${memory.rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} className="preview-star"><Star filled={n <= memory.rating} /></span>)}</span> : null}
          <span className="preview-date">{memoryLabel(memory.savedAt)}</span>
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
          <div className="past-title-row">
            <h1 className="past-title">Records</h1>
            <details className="memo-sort" onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
            }} onKeyDown={(event) => {
              if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary").focus(); }
            }}>
              <summary className="memo-sort-btn" aria-label="Sort memories by date">{order === "oldest" ? "Oldest" : "Newest"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
              <div className="memo-sort-menu" role="group" aria-label="Sort order">
                {["newest", "oldest"].map((value, i) => (
                  <span key={value}>
                    {i > 0 && <hr />}
                    <button type="button" aria-pressed={order === value} onClick={(event) => {
                      onOrderChange(value);
                      const picker = event.currentTarget.closest("details");
                      picker.open = false;
                      picker.querySelector("summary").focus();
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ opacity: order === value ? 1 : 0 }}><path d="m5 12.5 4.5 4.5L19 7" /></svg>
                      {value === "newest" ? "Newest" : "Oldest"}
                    </button>
                  </span>
                ))}
              </div>
            </details>
          </div>
          <p className="text-body past-sub">{records.length} {records.length === 1 ? "memory" : "memories"} recorded</p>
        </header>
        <ul className="past-grid">
          {records.map((memory) => (
            <li key={memory.id}>
              <button type="button" className="past-tile" onPointerDown={(event) => startPress(event, memory)}
                onPointerMove={(event) => { if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 10) cancelPress(); }}
                onPointerUp={cancelPress} onPointerCancel={cancelPress} onPointerLeave={cancelPress}
                onContextMenu={(event) => { event.preventDefault(); cancelPress(); suppressClick.current = true; setPreview(memory); }}
                onKeyDown={(event) => { if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) { event.preventDefault(); setPreview(memory); } }}
                onClick={(event) => { if (suppressClick.current && event.detail !== 0) { suppressClick.current = false; return; } onOpenMemory(memory); }} aria-label={`Open memory from ${memoryLabel(memory.savedAt)}, ${memory.rating} stars`}>
                <Tile memory={memory} />
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
