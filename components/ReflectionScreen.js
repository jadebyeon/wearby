"use client";

import { useState } from "react";
import Star from "@/components/Star";
import { ChevronLeft, Check } from "@/components/GlassIcons";

function formatNow(d) {
  const p = (n) => String(n).padStart(2, "0");
  const h = d.getHours() % 12 || 12;
  const ampm = d.getHours() < 12 ? "AM" : "PM";
  return `${d.getFullYear()}. ${p(d.getMonth() + 1)}. ${p(d.getDate())}. ${h}:${p(d.getMinutes())} ${ampm}`;
}

export default function ReflectionScreen({
  reflection,
  setReflection,
  onBack,
  onSave,
  saveFailed,
  onCloseError,
}) {
  // Only shown after a tap, so it is never server-rendered
  const [now] = useState(() => formatNow(new Date()));
  const { rating, keep, leave } = reflection;

  const update = (patch) => setReflection((prev) => ({ ...prev, ...patch }));

  return (
    <main className="screen reflection">
      <header className="reflection-top">
        <button type="button" className="glass-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft />
          <span className="btn-label">Back</span>
        </button>
          <button type="button" className="glass-btn reflection-next" onClick={onSave} aria-label="Next">
            <Check />
            <span className="btn-label">Next</span>
          </button>
      </header>

      <div className="reflection-body">
        <h1 className="text-h2 reflection-title">Save today :)</h1>
        <p className="text-body reflection-date">{now || " "}</p>

        <fieldset className="reflection-field">
          <legend className="text-body">Today’s Outfit Rating:</legend>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className="star"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={rating === n}
                onClick={() => update({ rating: rating === n ? 0 : n })}
              >
                <Star filled={n <= rating} />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="reflection-field">
          <span className="text-body">One thing I’d keep from today:</span>
          <span className="bubble">
            <textarea
              className="text-body"
              placeholder="Write your thoughts"
              value={keep}
              onChange={(e) => update({ keep: e.target.value })}
            />
          </span>
        </label>

        <label className="reflection-field">
          <span className="text-body">One thing I can leave here:</span>
          <span className="bubble">
            <textarea
              className="text-body"
              placeholder="Write your thoughts"
              value={leave}
              onChange={(e) => update({ leave: e.target.value })}
            />
          </span>
        </label>
      </div>
      {saveFailed && (
        <div className="notice-backdrop">
          <div className="notice" role="alertdialog" aria-label="Could not save">
            <img className="notice-face" src="/character/faces/face-sad.svg" alt="" />
            <h2 className="text-h3">Could not save</h2>
            <p className="text-body notice-text">
              Your browser has no room left. What you wrote is still here, so you can try again.
            </p>
            <div className="notice-actions">
              <button type="button" className="notice-btn" onClick={onSave}>
                Try again
              </button>
              <button type="button" className="notice-btn notice-btn-quiet" onClick={onCloseError}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
