"use client";

import { useEffect, useRef, useState } from "react";
import Character from "@/components/Character";
import { photoToBackground } from "@/lib/image";

export default function AiShirtDialog({ outfit, onWear, onClose }) {
  const dialog = useRef(null);
  const controller = useRef(null);
  const photoInput = useRef(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [reading, setReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  useEffect(() => {
    dialog.current.showModal();
    return () => controller.current?.abort();
  }, []);

  // Simulated estimate only. Never claim completion before the response arrives.
  useEffect(() => {
    if (!busy) return;
    const started = Date.now();
    const timer = setInterval(() => {
      setProgress(Math.min(95, Math.round(5 + 90 * (1 - Math.exp(-(Date.now() - started) / 12000)))));
    }, 500);
    return () => clearInterval(timer);
  }, [busy]);

  async function choosePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 10000000) {
      setError("Choose a JPG, PNG or WebP under 10 MB."); return;
    }
    setReading(true);
    try {
      const data = await photoToBackground(file);
      if (data.length > 2000000) throw new Error();
      setPhoto(data);
    } catch { setError("Could not open this photo. Try another one."); }
    finally { setReading(false); }
  }

  async function generate(event) {
    event.preventDefault();
    if (busy || reading) return;
    setFailed(false);
    setProgress(5);
    setBusy(true);
    setError("");
    controller.current = new AbortController();
    try {
      const response = await fetch("/api/generate-shirt", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, photo }), signal: controller.current.signal,
      });
      const data = await response.json();
      if (!response.ok || !data.item) throw new Error(data.error || "Could not create this item. Please try again.");
      setProgress(100);
      setResult(data.item);
    } catch (e) {
      if (e.name !== "AbortError") {
        setError(e.message || "Could not connect. Please try again.");
        setFailed(true);
      }
    } finally { setBusy(false); }
  }

  return (
    <dialog ref={dialog} className="ai-shirt-dialog" aria-labelledby="ai-shirt-title" onCancel={(e) => { e.preventDefault(); onClose(); }}>
      <header className="ai-shirt-header">
        <h2 id="ai-shirt-title" className="text-h3">{busy ? "Creating…" : failed ? "Couldn’t create it" : result ? "Ready to wear" : "Create with AI"}</h2>
        <button className="ai-close" type="button" aria-label="Close" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      </header>
      {busy ? (
        <div className="ai-state ai-progress-state" key="busy">
          <p className="text-small" role="status">Making your item…</p>
          <div className="ai-progress" role="progressbar" aria-label="Estimated progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="text-small">Estimated {progress}%</p>
          <button type="button" className="profile-button text-body" onClick={onClose}>Cancel</button>
        </div>
      ) : failed ? (
        <div className="ai-state ai-error-state" key="error">
          <img src="/character/faces/face-sad.svg" alt="" />
          <p className="text-small" role="alert">{error}</p>
          <div className="ai-shirt-actions">
            <button type="button" className="profile-button text-body" onClick={() => { setFailed(false); setError(""); }}>Edit input</button>
            <button type="button" className="profile-button text-body ai-shirt-primary" onClick={generate}>Try again</button>
          </div>
        </div>
      ) : result ? (
        <div className="ai-state" key="ready">
          <div className="ai-shirt-preview"><Character outfit={{ ...outfit, [result.slot]: result }} /></div>

          <p className="text-small">AI colors on a Wearby shape.</p>
          <div className="ai-shirt-actions">
            <button className="profile-button text-body" onClick={() => { setResult(null); setError(""); }}>Try again</button>
            <button className="profile-button text-body ai-shirt-primary" onClick={() => onWear(result)}>Wear it</button>
          </div>
        </div>
      ) : (
        <form className="ai-state" key="input" onSubmit={generate}>
          <p className="text-small">Add a photo or a few words.</p>
          <button type="button" className="profile-button text-body" disabled={busy || reading} onClick={() => photoInput.current.click()}>{photo ? "Change photo" : "Add photo"}</button>
          <input ref={photoInput} type="file" hidden aria-label="Clothing photo" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} disabled={busy || reading} />
          {photo && <div className="ai-shirt-photo"><img src={photo} alt="Your clothing reference" /><button type="button" className="profile-button text-body" disabled={busy} onClick={() => setPhoto(null)}>Remove photo</button></div>}
          <label className="text-small ai-shirt-field" htmlFor="ai-shirt-description">Your idea</label>
          <textarea id="ai-shirt-description" className="text-small" placeholder="A sage green hoodie" maxLength={500} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} disabled={busy} />
          {error && <p className="text-small" role="alert">{error}</p>}
          {reading && <p className="text-small" role="status">Opening photo…</p>}
          <button className="profile-button text-body ai-shirt-primary" disabled={busy || reading || (!description.trim() && !photo)}>{busy ? "Generating…" : "Generate"}</button>
          <p className="text-small ai-disclosure">Your photo and text are sent to AI.</p>
        </form>
      )}
    </dialog>
  );
}
