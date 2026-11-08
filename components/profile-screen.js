"use client";

import { useRef, useState } from "react";
import NavBar from "@/components/NavBar";

const NAME_KEY = "wearby.profile.name";
function loadName() {
  try {
    return window.localStorage.getItem(NAME_KEY)?.trim() || "Your Name";
  } catch {
    return "Your Name";
  }
}

export default function ProfileScreen({ onNavigate }) {
  const [name, setName] = useState(loadName);
  const [draft, setDraft] = useState(name);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const editButton = useRef(null);
  const featureDialog = useRef(null);
  const [feature, setFeature] = useState("");

  function openFeature(label) {
    setFeature(label);
    featureDialog.current?.showModal();
  }

  function closeEditor() {
    setEditing(false);
    setError("");
    requestAnimationFrame(() => editButton.current?.focus());
  }

  function saveName(event) {
    event.preventDefault();
    const nextName = draft.trim();
    if (!nextName) {
      setError("Please enter your name.");
      return;
    }
    try {
      if (nextName === "Your Name") window.localStorage.removeItem(NAME_KEY);
      else window.localStorage.setItem(NAME_KEY, nextName);
      setName(nextName);
      closeEditor();
    } catch {
      setError("Could not save. Please try again.");
    }
  }

  return (
    <main className="screen profile">
      <div className="profile-scroll">
        <h1 className="pf-title">Profile</h1>

        <section className="pf-hero" aria-label="You">
          <div className="pf-avatar">
            <img src="/character/faces/face-calm.svg" alt="" />
            <button ref={editButton} className="pf-edit" type="button" aria-label="Edit name" onClick={() => { setDraft(name); setEditing(true); }}>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 4.992 13.224 7.008H7.992c-.528 0-.984.432-.984.984v8.016c0 .528.432.984.984.984h2.544c.312.048.624.048.936 0h4.536c.528 0 .984-.432.984-.984v-4.224l1.944-2.16.072.048v6.312c0 1.68-1.344 3.024-3 3.024H8.016c-1.68 0-3.024-1.344-3.024-3.024V7.992c0-1.656 1.344-3 3.024-3H15Zm1.272 1.632 1.344 1.488-4.896 5.568c-.216.24-.888.552-2.04.936-.024.024-.072.024-.12 0-.096-.024-.168-.144-.12-.24.312-1.128.6-1.824.816-2.064l5.016-5.688Zm.648-.768 1.368-1.536c.36-.408.984-.432 1.392-.048.408.36.432 1.008.072 1.416l-1.488 1.68-1.344-1.512Z" /></svg>
            </button>
          </div>
          <h2 className="pf-name">{name}</h2>
          <p className="text-body pf-sub">A little about you</p>
        </section>

        {editing && (
          <form className="profile-form pf-card" onSubmit={saveName}>
            <label className="text-body" htmlFor="profile-name">Name</label>
            <input autoFocus id="profile-name" className="text-body profile-input" autoComplete="given-name" maxLength={40} value={draft}
              aria-invalid={error ? true : undefined} aria-describedby={error ? "profile-error" : undefined}
              onChange={(event) => { setDraft(event.target.value); setError(""); }}
              onKeyDown={(event) => { if (event.key === "Escape") closeEditor(); }} />
            {error && <p id="profile-error" className="text-body profile-error" role="alert">{error}</p>}
            <div className="profile-actions">
              <button className="text-body profile-button" type="submit">Save</button>
              <button className="text-body profile-button" type="button" onClick={closeEditor}>Cancel</button>
            </div>
          </form>
        )}

        <section className="pf-card" aria-label="Premium">
          <button className="pf-premium" type="button" onClick={() => openFeature("Wearby Premium")}>
            <span className="pf-premium-title"><ProfileIcon name="crown" />Try Wearby Premium</span>
            <span className="text-body">A little more for your daily outfits.</span>
          </button>
        </section>

        <section className="pf-card" aria-labelledby="pf-support">
          <h2 id="pf-support" className="pf-card-title">Support</h2>
          <ul className="pf-list">
            {[["Share with a friend", "megaphone"], ["Rate and review", "like"], ["Contact us", "chat"]].map(([label, icon]) => (
              <li key={label}>
                <button className="pf-row" type="button" onClick={() => openFeature(label)}>
                  <ProfileIcon name={icon} />
                  <span>{label}</span>
                  <svg className="pf-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <NavBar active="profile" onNavigate={onNavigate} />
      <dialog ref={featureDialog} className="feature-notice" aria-labelledby="feature-notice-title" aria-describedby="feature-notice-description">
        <div className="feature-notice-content">
          <div className="feature-notice-message">
            <div className="feature-notice-ear" role="img" aria-label="Ear">
              <img src="/character/faces/face-surprised.svg" alt="" className="notice-surprised" />
              <img src="/character/faces/face-wink.svg" alt="" className="notice-wink" />
            </div>
            <h2 id="feature-notice-title" className="text-h3">Coming soon</h2>
            <p id="feature-notice-description" className="text-body">{feature} is not ready yet.</p>
          </div>
          <form method="dialog">
            <button autoFocus className="text-body feature-notice-back" type="submit">Go back</button>
          </form>
        </div>
      </dialog>
    </main>
  );
}

function ProfileIcon({ name }) {
  const paths = {
    person: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="9" r="3" /><path d="M5 19c1-6 13-6 14 0" /></>,
    crown: <><path d="m3 6 4 4 5-7 5 7 4-4-2 13H5Z" /><path d="M5 22h14" /></>,
    upload: <><path d="M7 18H6a4 4 0 0 1-1-8 7 7 0 0 1 14-1 4.5 4.5 0 0 1 0 9h-2" /><path d="M12 22V11m-4 4 4-4 4 4" /></>,
    megaphone: <><path d="m3 10 11-3 6-4v18l-6-4-11-3Zm4 5 2 6h4l-2-5M14 7v10" /></>,
    like: <><path d="M8 10 13 3c3 0 3 2 1 7h5c2 0 2 2 1 5l-2 6H8ZM3 10h5v11H3Z" /></>,
    chat: <path d="M21 11a9 9 0 0 1-9 9c-2 0-3 0-4-1l-5 3 1-6a9 9 0 1 1 17-5Z" />,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
