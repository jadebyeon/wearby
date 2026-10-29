"use client";

import { useEffect, useState } from "react";
import Character from "@/components/Character";
import Confetti from "@/components/Confetti";
import Star from "@/components/Star";
import { ChevronLeft, useGlassTone } from "@/components/GlassIcons";
import { memoryLabel } from "@/lib/memories";

// memory.background is a CSS image url (set later by the Dress Up background picker).
export default function ConfirmScreen({ memory, justSaved, onBack }) {
  const { surfaceRef, darkGlass } = useGlassTone(memory.background);
  const [showSaved, setShowSaved] = useState(Boolean(justSaved));
  useEffect(() => {
    if (!showSaved) return;
    const t = setTimeout(() => setShowSaved(false), 3500);
    return () => clearTimeout(t);
  }, [showSaved]);

  const { outfit, rating, keep, leave, savedAt, background } = memory;
  const style = background ? { backgroundImage: `url("${background}")` } : undefined;

  return (
    <main ref={surfaceRef} className={`screen confirm${darkGlass ? " dark-glass" : ""}`} style={style}>
      <header className="confirm-top">
        <button type="button" className="glass-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft />
          <span className="btn-label">Back</span>
        </button>
        <p className="text-body glass-pill glass-date">{memoryLabel(savedAt)}</p>
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
