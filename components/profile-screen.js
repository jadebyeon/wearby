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
        <header className="profile-header">
          <div className="profile-heading-row">
            <h1 className="text-h2 profile-title">{name}</h1>
            <button ref={editButton} className="profile-edit" type="button" aria-label="Edit name" onClick={() => { setDraft(name); setEditing(true); }}>
              <ProfileIcon name="person" />
            </button>
          </div>
          <p className="text-body profile-subtitle">A little about you</p>
          {editing && (
            <form className="profile-form" onSubmit={saveName}>
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
        </header>

        <div className="profile-sections">
          <button className="profile-premium" type="button" onClick={() => openFeature("Wearby Premium")} >
            <span className="text-h3 profile-premium-title"><ProfileIcon name="crown" />Try Wearby Premium</span>
            <span className="text-body">A little more for your daily outfits.</span>
          </button>
          <button className="text-body profile-backup" type="button" onClick={() => openFeature("Share with a friend")}>
            <span>Share with a friend</span><ProfileIcon name="megaphone" />
          </button>
          <button className="text-body profile-backup" type="button" onClick={() => openFeature("Rate and review")}>
            <span>Rate and review</span><ProfileIcon name="like" />
          </button>
          <button className="text-body profile-backup" type="button" onClick={() => openFeature("Contact us")}>
            <span>Contact us</span><ProfileIcon name="chat" />
          </button>
        </div>
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
