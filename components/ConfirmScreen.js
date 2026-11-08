"use client";

import { useEffect, useRef, useState } from "react";
import Character from "@/components/Character";
import Confetti from "@/components/Confetti";
import Star from "@/components/Star";
import { ChevronLeft, Trash, useGlassTone } from "@/components/GlassIcons";
import { memoryLabel } from "@/lib/memories";

// memory.background is a CSS image url (set later by the Dress Up background picker).
export default function ConfirmScreen({ memory, justSaved, onBack, canEdit = false, onEdit, onDelete }) {
  const { surfaceRef, darkGlass } = useGlassTone(memory.background);
  const [showSaved, setShowSaved] = useState(Boolean(justSaved));
  useEffect(() => {
    if (!showSaved) return;
    const t = setTimeout(() => setShowSaved(false), 3500);
    return () => clearTimeout(t);
  }, [showSaved]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const actions = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event) => { if (!actions.current?.contains(event.target)) { setMenuOpen(false); setConfirmDelete(false); } };
    const onKey = (event) => { if (event.key === "Escape") { setMenuOpen(false); setConfirmDelete(false); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", onKey); };
  }, [menuOpen]);

  async function share() {
    const text = [`My Wearby memory · ${memoryLabel(memory.savedAt)}`, `${memory.rating}/5 stars`, memory.keep, memory.leave].filter(Boolean).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "Wearby memory", text });
      else await navigator.clipboard.writeText(text);
    } catch { /* cancelled or blocked: nothing to do */ }
  }

  const { outfit, rating, keep, leave, savedAt, background } = memory;
  const style = background ? { backgroundImage: `url("${background}")` } : undefined;

  return (
    <main ref={surfaceRef} className={`screen confirm${darkGlass ? " dark-glass" : ""}`} style={style}>
      <header className="confirm-top">
        <button type="button" className="glass-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft />
          <span className="btn-label">Back</span>
        </button>
        <div className="confirm-actions" ref={actions}>
          <div className="glass-group confirm-pill">
            <button type="button" className="group-btn" onClick={share}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 15V3m-4 4 4-4 4 4M7 10H5v10h14V10h-2" /></svg>
              <span className="btn-label">Share</span>
            </button>
            {canEdit && (
              <button type="button" className="group-btn" aria-label="More" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => { setMenuOpen((open) => !open); setConfirmDelete(false); }}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="3.8" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="20.2" cy="12" r="2" /></svg>
                <span className="btn-label">More</span>
              </button>
            )}
          </div>
          {menuOpen && (
            <div className="confirm-menu" role="menu">
              <button type="button" role="menuitem" onClick={onEdit}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 4.992 13.224 7.008H7.992c-.528 0-.984.432-.984.984v8.016c0 .528.432.984.984.984h2.544c.312.048.624.048.936 0h4.536c.528 0 .984-.432.984-.984v-4.224l1.944-2.16.072.048v6.312c0 1.68-1.344 3.024-3 3.024H8.016c-1.68 0-3.024-1.344-3.024-3.024V7.992c0-1.656 1.344-3 3.024-3H15Zm1.272 1.632 1.344 1.488-4.896 5.568c-.216.24-.888.552-2.04.936-.024.024-.072.024-.12 0-.096-.024-.168-.144-.12-.24.312-1.128.6-1.824.816-2.064l5.016-5.688Zm.648-.768 1.368-1.536c.36-.408.984-.432 1.392-.048.408.36.432 1.008.072 1.416l-1.488 1.68-1.344-1.512Z" /></svg>
                Edit
              </button>
              <hr />
              <button type="button" role="menuitem" className="delete" onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}>
                <Trash size={18} />
                {confirmDelete ? "Confirm Delete" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </header>

      {justSaved && <Confetti />}

      {showSaved && (
        <p className="saved-chip text-body" role="status">
          <img src="/character/faces/face-happy.svg" alt="" />
          Saved!
        </p>
      )}

      {memory.image && !outfit ? (
        <img className="past-memory-detail" src={memory.image} alt={`Memory from ${memoryLabel(savedAt)}, ${rating} stars`} />
      ) : (
      <>
      <div className="confirm-stage">
        <Character outfit={outfit} />
      </div>

      <section className="confirm-note" aria-label="Your reflection">
        <p className="confirm-row confirm-rating">
          <span className="confirm-label">Rating:</span>
          <span className="confirm-stars" role="img" aria-label={`${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="confirm-star">
                <Star filled={n <= rating} />
              </span>
            ))}
          </span>
        </p>
        {(keep || memory.isSample) && <p className="confirm-row confirm-text">{keep || "\u00a0"}</p>}
        {(leave || memory.isSample) && <p className="confirm-row confirm-text">{leave || "\u00a0"}</p>}
        {memory.surprise && <p className="confirm-row confirm-text">{memory.surprise}</p>}
      </section>
      </>
      )}
    </main>
  );
}
