import { useState } from "react";
import { pastMemories } from "@/data/pastMemories";
import Star from "@/components/Star";
import NavBar from "@/components/NavBar";
import Character from "@/components/Character";
import { memoryLabel } from "@/lib/memories";

export default function WelcomeScreen({ onDress, onCreateAi, drafts = [], onOpenDraft, memories = [], onOpenMemory, onNavigate, onSeeMore, onSeeSaved }) {
  const [samples] = useState(pastMemories);
  const savedDays = new Set(memories.map((memory) => new Date(memory.savedAt).toDateString()));
  const recentMemories = [
    ...memories,
    ...samples.filter((memory) => !savedDays.has(new Date(memory.savedAt).toDateString())),
  ].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

  // Past outfits fill the panel like a collage. With no records yet, empty Ears keep the shape.
  const collagePool = recentMemories.length ? recentMemories : Array.from({ length: 4 }, () => ({}));
  const collage = Array.from({ length: 36 }, (_, i) => collagePool[(i * 2 + Math.floor(i / 6)) % collagePool.length]);

  return (
    <main className="screen welcome">
      <header className="home-top">
        <h1 className="home-title">Home</h1>
      </header>

      <section className="home-panel" aria-label="Today">
        <div className="home-collage-wrap" aria-hidden="true">
          <div className="home-collage">
            {[0, 1, 2, 3, 4].map((col) => {
              const tiles = collage.slice(col * 6, col * 6 + 6);
              return (
                <div key={col} className={col % 2 ? "collage-col down" : "collage-col up"}>
                  <div className="collage-track">
                    {[...tiles, ...tiles].map((m, i) => (
                      <span
                        key={i}
                        className="collage-tile"
                        style={m.background ? { backgroundImage: `url("${m.background}")` } : undefined}
                      >
                        {m.image && !m.outfit ? <img className="memory-photo" src={m.image} alt="" /> : <Character outfit={m.outfit || {}} />}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="home-panel-shade" aria-hidden="true" />
        <div className="home-panel-text">
          <h2 className="home-panel-title">Dress Ear today</h2>
          <p className="text-body home-panel-sub">Haven&apos;t picked an outfit yet?</p>
          <div className="home-panel-actions">
            <button type="button" className="hero-cta" onClick={onDress}>Start</button>
            <button type="button" className="hero-round" aria-label="Create a piece with AI" onClick={() => (onCreateAi ? onCreateAi() : onDress())}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M10.5 4l1.9 5.6L18 11.5l-5.6 1.9L10.5 19l-1.9-5.6L3 11.5l5.6-1.9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 3l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="memories">
        <div className="memories-heading">
          <h2 className="text-h3">Records</h2>
          {recentMemories.length > 8 && <button type="button" className="memories-more" aria-label="See all records" onClick={onSeeMore}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>}
        </div>
        {recentMemories.length === 0 ? (
          <div className="memory-empty-row">
            <button type="button" className="memory-empty" onClick={onDress}>
              <span className="memory-empty-box">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
                  <path d="M12 3v18M3 12h18" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-small">Add memories</span>
            </button>
            <div className="memory-empty-note">
              <img src="/character/faces/face-calm.svg" alt="" />
              <p className="text-small">No memories yet</p>
            </div>
          </div>
        ) : (
          <ul className="memory-list" tabIndex={0} aria-label="Records, scroll sideways">
            {recentMemories.slice(0, 8).map((m) => {
              const label = memoryLabel(m.savedAt);
              return (
                <li key={m.id}>
                  <button type="button" className="memory-open" onClick={() => onOpenMemory(m)} aria-label={`Open memory from ${label}`}>
                    <span className="memory-thumb" style={m.background ? { backgroundImage: `url("${m.background}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                      {m.image && !m.outfit ? <img className="memory-photo" src={m.image} alt="" /> : <Character outfit={m.outfit} />}
                      {m.rating ? <span className="memory-rating-corner"><span className="memory-star"><Star filled /></span>{m.rating}</span> : null}
                      <span className="memory-date">{label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {drafts.length > 0 && (
        <section className="memories" aria-label="Saved Memories">
          <div className="memories-heading">
            <h2 className="text-h3">Saved Memories</h2>
            {drafts.length > 8 && <button type="button" className="memories-more" aria-label="See all saved memories" onClick={onSeeSaved}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>}
          </div>
          <ul className="memory-list" tabIndex={0} aria-label="Saved Memories, scroll sideways">
            {drafts.slice(0, 8).map((draft) => (
              <li key={draft.id}>
                <button type="button" className="memory-open" onClick={() => onOpenDraft(draft)} aria-label={`Edit saved memory from ${memoryLabel(draft.savedAt)}`}>
                  <span className="memory-thumb" style={draft.background ? { backgroundImage: `url("${draft.background}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                    <Character outfit={draft.outfit} />
                    <span className="memory-date">{memoryLabel(draft.savedAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NavBar active="home" onNavigate={onNavigate} />
    </main>
  );
}