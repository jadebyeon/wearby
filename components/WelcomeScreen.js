import { useState } from "react";
import { pastMemories } from "@/data/pastMemories";
import Icon from "@/components/Icon";
import NavBar from "@/components/NavBar";
import Character from "@/components/Character";
import { memoryLabel } from "@/lib/memories";

export default function WelcomeScreen({ onDress, drafts = [], onOpenDraft, memories = [], onOpenMemory, onNavigate, onSeeMore }) {
  const [samples] = useState(pastMemories);
  const savedDays = new Set(memories.map((memory) => new Date(memory.savedAt).toDateString()));
  const recentMemories = [
    ...memories,
    ...samples.filter((memory) => !savedDays.has(new Date(memory.savedAt).toDateString())),
  ].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

  return (
    <main className="screen welcome">
      <header className="welcome-header">
        <div>
          <h1 className="text-h2 welcome-title">Welcome :)</h1>
          <p className="text-body welcome-sub">What did Ear wear today?</p>
        </div>
      </header>

      <button type="button" className="dress-card" onClick={onDress}>
        <span className="text-h3">Dress Ear today</span>
        <span className="text-body dress-card-sub">
          Haven&apos;t picked an outfit yet?
        </span>
        <span className="dress-card-plus">
          <Icon name="plus" size={56} />
        </span>
      </button>

      <section className="badge-card draft-card" aria-label="Saved drafts">
        <p className="text-body">You have {drafts.length} clothes saved</p>
        <div className="draft-previews">
          {drafts.map((draft, index) => <button type="button" key={draft.id} className="draft-preview" aria-label={`Edit saved outfit ${index + 1}`} onClick={() => onOpenDraft(draft)} style={draft.background ? { backgroundImage: `url("${draft.background}")` } : undefined}>
            <Character outfit={draft.outfit} />
          </button>)}
        </div>
      </section>

      <section className="memories">
        <div className="memories-heading">
          <h2 className="text-h3">Recent Memories</h2>
          <button type="button" className="text-body memories-more" onClick={onSeeMore}>See more</button>
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
          <ul className="memory-list" tabIndex={0} aria-label="Recent memories, scroll sideways">
            {recentMemories.map((m) => {
              const label = memoryLabel(m.savedAt);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    className="memory-open"
                    onClick={() => onOpenMemory(m)}
                    aria-label={`Open memory from ${label}`}
                  >
                    <span className="memory-thumb" style={m.background ? { backgroundImage: `url("${m.background}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                      {m.image && !m.outfit ? <img className="memory-photo" src={m.image} alt="" /> : <Character outfit={m.outfit} />}
                    </span>
                    <span className="text-small">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <NavBar active="home" onNavigate={onNavigate} />
    </main>
  );
}