"use client";

import { useEffect, useState } from "react";
import Character from "@/components/Character";
import Confetti from "@/components/Confetti";
import Star from "@/components/Star";
import { ChevronLeft } from "@/components/GlassIcons";
import { memoryLabel } from "@/lib/memories";

// memory.background is a CSS image url (set later by the Dress Up background picker).
export default function ConfirmScreen({ memory, justSaved, onBack }) {
  const [showSaved, setShowSaved] = useState(Boolean(justSaved));
  useEffect(() => {
    if (!showSaved) return;
    const t = setTimeout(() => setShowSaved(false), 3500);
    return () => clearTimeout(t);
  }, [showSaved]);

  const { outfit, rating, keep, leave, savedAt, background } = memory;
  const style = background ? { backgroundImage: `url("${background}")` } : undefined;

  return (
    <main className="screen confirm" style={style}>
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
        {keep && <p className="confirm-row confirm-text">{keep}</p>}
        {leave && <p className="confirm-row confirm-text">{leave}</p>}
      </section>
    </main>
  );
}
