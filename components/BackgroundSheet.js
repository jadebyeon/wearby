"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { Camera, Picture } from "@/components/GlassIcons";
import { BACKGROUNDS } from "@/data/backgrounds";
import { photoToBackground } from "@/lib/image";

export default function BackgroundSheet({ current, onPick, onClose }) {
  const [view, setView] = useState("menu");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onPick(await photoToBackground(file));
      onClose();
    } catch {
      setError("This photo could not be opened. Please try another one.");
      setBusy(false);
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="action-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Choose a background"
        onClick={(e) => e.stopPropagation()}
      >
        {view === "menu" ? (
          <>
            <h2 className="action-title text-body">Choose an action</h2>
            <ul className="action-list">
              <li>
                <label className="action-row">
                  <Camera size={28} />
                  <span className="text-body">Take a photo</span>
                  <input
                    ref={firstRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="visually-hidden"
                    onChange={handleFile}
                  />
                </label>
              </li>
              <li>
                <label className="action-row">
                  <Picture size={28} />
                  <span className="text-body">Choose from gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="visually-hidden"
                    onChange={handleFile}
                  />
                </label>
              </li>
              <li>
                <button type="button" className="action-row" onClick={() => setView("defaults")}>
                  <Picture size={28} />
                  <span className="text-body">Default backgrounds</span>
                </button>
              </li>
            </ul>
            {busy && <p className="action-note text-small">Preparing your photo...</p>}
            {error && (
              <p className="action-note action-error text-small" role="alert">
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="action-head">
              <button
                type="button"
                className="action-back"
                onClick={() => setView("menu")}
                aria-label="Back to actions"
              >
                <Icon name="back" size={24} />
              </button>
              <h2 className="action-title text-body">Default backgrounds</h2>
            </div>
            <div className="bg-grid">
              <button
                type="button"
                className="bg-tile bg-none"
                aria-pressed={!current}
                onClick={() => {
                  onPick(null);
                  onClose();
                }}
              >
                <span className="text-small">None</span>
              </button>
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="bg-tile"
                  aria-pressed={current === b.src}
                  aria-label={b.name}
                  onClick={() => {
                    onPick(b.src);
                    onClose();
                  }}
                >
                  <img src={b.src} alt="" />
                </button>
              ))}
            </div>
            {BACKGROUNDS.length === 0 && (
              <p className="action-note text-small">No default backgrounds yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
