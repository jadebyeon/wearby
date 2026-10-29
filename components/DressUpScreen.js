"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronLeft, Bookmark, Picture, Check, useGlassTone } from "@/components/GlassIcons";
import Character from "@/components/Character";
import BackgroundSheet from "@/components/BackgroundSheet";
import { TABS, ITEMS } from "@/data/clothes";
import { RATIOS } from "@/data/itemRatios";

// Every item gets about the same visual weight: same area, but never taller or wider than the box.
const AREA = 76 * 76;
const MAX_W = 92;
const MAX_H = 84;

function thumbSize(name) {
  const ratio = RATIOS[name] || 1;
  let w = Math.sqrt(AREA / ratio);
  let h = w * ratio;
  const k = Math.min(1, MAX_W / w, MAX_H / h);
  return { width: Math.round(w * k), height: Math.round(h * k) };
}

export default function DressUpScreen({
  outfit,
  setOutfit,
  background,
  setBackground,
  onBack,
  onReflect,
  onSaveDraft,
  draftError,
  hasUnsavedChanges,
  draftSaved,
}) {
  const { surfaceRef, darkGlass } = useGlassTone(background);
  const leaveDialog = useRef(null);
  const [tab, setTab] = useState("top");
  const [pickingBackground, setPickingBackground] = useState(false);
  const items = ITEMS.filter((i) => i.tab === tab);
  // The clothes panel starts lowered (about 1.5 rows show). Scrolling raises it first, and
  // while it rises Ear scales down. After that, only the list scrolls. Tabs never sit over clothes.
  const [off, setOff] = useState(null); // px the panel is still lowered, null until measured
  const [minScale, setMinScale] = useState(1);
  const [spacer, setSpacer] = useState(0);
  const sheetRef = useRef(null);
  const scrollerRef = useRef(null);
  const tabsRef = useRef(null);
  const offRef = useRef(0);
  const spacerRef = useRef(0);

  function moveOff(v) {
    offRef.current = Math.max(0, Math.min(spacerRef.current, v));
    setOff(offRef.current);
  }

  useEffect(() => {
    function measure() {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const sp = Math.max(0, sheet.offsetHeight - 215); // 215 = height when about 1.5 rows show
      const first = spacerRef.current === 0 && offRef.current === 0;
      spacerRef.current = sp;
      offRef.current = first ? sp : Math.min(offRef.current, sp);
      setOff(offRef.current);
      setSpacer(sp);
      const full = window.innerHeight - 215;
      const small = window.innerHeight - sheet.offsetHeight;
      setMinScale(Math.max(0.5, Math.min(1, small / full)));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Mouse wheel and touch drag: raise the panel first, then scroll the list.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const list = () => scrollerRef.current;

    function onWheel(e) {
      let rest = e.deltaY;
      if (rest > 0) {
        const take = Math.min(offRef.current, rest);
        if (take > 0) moveOff(offRef.current - take);
        rest -= take;
        if (rest > 0) list().scrollTop += rest;
      } else if (rest < 0) {
        const take = Math.min(list().scrollTop, -rest);
        list().scrollTop -= take;
        rest += take;
        if (rest < 0) moveOff(offRef.current - rest);
      }
      e.preventDefault();
    }

    let lastY = 0;
    function onTouchStart(e) {
      lastY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      const y = e.touches[0].clientY;
      const dy = lastY - y; // positive when the finger moves up
      lastY = y;
      if (dy > 0 && offRef.current > 0) {
        const take = Math.min(offRef.current, dy);
        moveOff(offRef.current - take);
        if (dy - take > 0) list().scrollTop += dy - take;
        e.preventDefault();
      } else if (
        dy < 0 &&
        list().scrollTop <= 0 &&
        offRef.current < spacerRef.current
      ) {
        moveOff(offRef.current - dy);
        e.preventDefault();
      }
      // otherwise the list scrolls by itself, with its normal touch momentum
    }

    sheet.addEventListener("wheel", onWheel, { passive: false });
    sheet.addEventListener("touchstart", onTouchStart, { passive: true });
    sheet.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      sheet.removeEventListener("wheel", onWheel);
      sheet.removeEventListener("touchstart", onTouchStart);
      sheet.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Center the selected category with a short native scroll.
  useEffect(() => {
    const row = tabsRef.current;
    const btn = row?.querySelector('[aria-selected="true"]');
    if (!btn) return;
    row.scrollTo({ left: btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }, [tab]);

  function chooseTab(id) {
    if (id === tab) return;
    const direction = TABS.findIndex((t) => t.id === id) > TABS.findIndex((t) => t.id === tab) ? 1 : -1;
    flushSync(() => setTab(id));
    const list = scrollerRef.current;
    if (list) {
      list.scrollTop = 0;
      list.getAnimations().forEach((animation) => animation.cancel());
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        list.animate([{ opacity: .35, transform: `translateX(${direction * 10}px)` }, { opacity: 1, transform: "translateX(0)" }], { duration: 200, easing: "ease-out" });
      }
    }
  }

  const shrink = off === null ? 0 : spacer === 0 ? 1 : 1 - off / spacer;
  const panelY =
    off === null ? "calc(var(--list-h) - var(--list-top))" : `${off}px`;

  function toggle(item) {
    setOutfit((prev) => {
      const next = { ...prev };
      if (prev[item.slot] === item.id) delete next[item.slot];
      else next[item.slot] = item.id;
      return next;
    });
  }

  return (
    <main
      ref={surfaceRef}
      className={`screen dressup${darkGlass ? " dark-glass" : ""}`}
      style={{
        "--k": 1 - shrink * (1 - minScale),
        ...(background ? { backgroundImage: `url("${background}")` } : null),
      }}
    >
      {draftError && <p className="text-body draft-error" role="alert">Could not update saved outfits. Please try again.</p>}
      <header className="dressup-bar">
        <button
          type="button"
          className="glass-btn"
          onClick={() => hasUnsavedChanges ? leaveDialog.current.showModal() : onBack()}
          aria-label="Back"
        >
          <ChevronLeft />
          <span className="btn-label">Back</span>
        </button>
        <div className="glass-group">
          <button type="button" className={`group-btn${draftSaved ? " draft-saved" : ""}`} aria-label={draftSaved ? "Saved!" : "Save"} aria-pressed={draftSaved} onClick={onSaveDraft}>
            <Bookmark />
            <span className="btn-label" aria-live="polite">{draftSaved ? "Saved!" : "Save"}</span>
          </button>
          <button
            type="button"
            className="group-btn"
            aria-label="Change background"
            aria-haspopup="dialog"
            onClick={() => setPickingBackground(true)}
          >
            <Picture />
            <span className="btn-label">Background</span>
          </button>
          <button
            type="button"
            className="group-btn"
            aria-label="Next"
            onClick={onReflect}
          >
            <Check />
            <span className="btn-label">Next</span>
          </button>
        </div>
      </header>

      <div className="stage">
        <Character outfit={outfit} />
      </div>

      <section className="sheet" aria-label="Clothes" ref={sheetRef}>
        <div className="panel" style={{ transform: `translateY(${panelY})` }}>
          <div className="tabs" role="tablist" ref={tabsRef}>
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                className="tab"
                aria-selected={tab === t.id}
                onClick={() => chooseTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="items" ref={scrollerRef}>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="item"
                aria-label={item.label}
                aria-pressed={outfit[item.slot] === item.id}
                onClick={() => toggle(item)}
              >
                <img src={item.src} alt="" style={thumbSize(item.name)} />
              </button>
            ))}
          </div>
        </div>
      </section>
      <dialog ref={leaveDialog} className="leave-draft-dialog" aria-labelledby="leave-draft-title" aria-describedby="leave-draft-description">
        <img className="leave-draft-face" src="/character/faces/face-sad.svg" alt="" />
        <h2 id="leave-draft-title" className="text-body">Leave without saving?</h2>
        <p id="leave-draft-description" className="text-body">Your changes won’t be saved.</p>
        <div className="leave-draft-actions">
          <button type="button" className="profile-button text-body" autoFocus onClick={() => leaveDialog.current.close()}>Cancel</button>
          <button type="button" className="profile-button text-body" onClick={onBack}>Continue</button>
        </div>
      </dialog>
      {pickingBackground && (
        <BackgroundSheet
          current={background}
          onPick={setBackground}
          onClose={() => setPickingBackground(false)}
        />
      )}
    </main>
  );
}
