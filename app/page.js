"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import StartScreen from "@/components/StartScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import DressUpScreen from "@/components/DressUpScreen";
import ReflectionScreen from "@/components/ReflectionScreen";
import ConfirmScreen from "@/components/ConfirmScreen";
import CalendarScreen from "@/components/CalendarScreen";
import InsightsScreen from "@/components/InsightsScreen";
import PastMemoriesScreen from "@/components/past-memories-screen";
import ProfileScreen from "@/components/profile-screen";
import { trackEvent } from "@/lib/events";
import { loadMemories, saveMemory, updateMemory, updateMemoryMeta, loadDrafts, saveDraft, removeDraft } from "@/lib/memories";
import "./screens.css";

function outfitMatches(a, b) {
  return JSON.stringify(Object.entries(a || {}).sort()) === JSON.stringify(Object.entries(b || {}).sort());
}

export default function Home() {
  // Try dark mode with ?theme=dark in the address. Without it the app is always light.
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("theme");
    document.documentElement.dataset.theme = asked === "dark" ? "dark" : "light";
    try { window.localStorage.removeItem("wearby.theme"); } catch {}
  }, []);
  const navigationTransition = useRef(null);
  const [screen, setScreen] = useState("start");
  const [outfit, setOutfit] = useState({});
  // Read once on the client. Only the Welcome screen shows it, and that never renders on the server.
  const [memories, setMemories] = useState(loadMemories);
  const [drafts, setDrafts] = useState(loadDrafts);
  const [draftId, setDraftId] = useState(null);
  const [openAi, setOpenAi] = useState(false);
  const [editingId, setEditingId] = useState(null); // the saved memory being edited in Dress Up
  const [draftError, setDraftError] = useState(false);
  const [memoryOrder, setMemoryOrder] = useState("newest");
  const [viewing, setViewing] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [backTo, setBackTo] = useState("welcome"); // where the Back arrow of Confirm goes
  const [background, setBackground] = useState(null);
  const [reflection, setReflection] = useState({
    rating: 0,
    keep: "",
    leave: "",
  });

  if (screen === "start") {
    return <StartScreen onContinue={() => setScreen("welcome")} />;
  }
  const goTab = (id) => {
    const next = { home: "welcome", calendar: "calendar", insights: "insights", profile: "profile" }[id];
    if (!next || next === screen) return;
    navigationTransition.current?.skipTransition();
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScreen(next);
      return;
    }
    // Tabs slide sideways in the order of the bar, so neighbouring backgrounds read as one wide picture.
    const order = { welcome: 0, calendar: 1, insights: 2, profile: 3 };
    document.documentElement.dataset.slide = (order[next] ?? 0) > (order[screen] ?? 0) ? "forward" : "back";
    const transition = document.startViewTransition(() => flushSync(() => setScreen(next)));
    navigationTransition.current = transition;
    transition.finished.finally(() => { if (navigationTransition.current === transition) delete document.documentElement.dataset.slide; });
  };
  const openMemory = (m) => {
    setBackTo(screen);
    setViewing(m);
    setJustSaved(false);
    setScreen("confirm");
  };

  const openDraft = (draft) => {
    setDraftId(draft.id);
    setOpenAi(false);
    setEditingId(null);
    setOutfit(draft.outfit);
    setBackground(draft.background);
    setDraftError(false);
    setScreen("dressup");
  };
  if (screen === "savedmemories") {
    return <PastMemoriesScreen draftsOnly memories={drafts} order={memoryOrder} onOrderChange={setMemoryOrder} onOpenMemory={openDraft} onNavigate={goTab} />;
  }
  if (screen === "pastmemories") {
    return <PastMemoriesScreen onMemoriesChange={() => setMemories(loadMemories())} memories={memories} order={memoryOrder} onOrderChange={setMemoryOrder} onOpenMemory={openMemory} onNavigate={goTab} />;
  }
  if (screen === "profile") {
    return <ProfileScreen onNavigate={goTab} />;
  }
  if (screen === "insights") {
    return <InsightsScreen memories={memories} onNavigate={goTab} />;
  }
  if (screen === "calendar") {
    return (
      <CalendarScreen
        memories={memories}
        onOpenMemory={openMemory}
        onNavigate={goTab}
      />
    );
  }
  if (screen === "welcome") {
    return (
      <WelcomeScreen
        drafts={drafts}
        onOpenDraft={openDraft}
        onSeeSaved={() => setScreen("savedmemories")}
        onDress={() => { trackEvent("dress_up_started"); setDraftId(null); setOpenAi(false); setOutfit({}); setBackground(null); setScreen("dressup"); }}
        onCreateAi={() => { trackEvent("dress_up_started"); setDraftId(null); setOpenAi(true); setOutfit({}); setBackground(null); setScreen("dressup"); }}
        onSeeMore={() => setScreen("pastmemories")}
        memories={memories}
        onOpenMemory={openMemory}
        onNavigate={goTab}
      />
    );
  }
  if (screen === "reflection") {
    return (
      <ReflectionScreen
        reflection={reflection}
        setReflection={setReflection}
        onBack={() => setScreen("dressup")}
        saveFailed={saveFailed}
        onCloseError={() => setSaveFailed(false)}
        onSave={() => {
          if (editingId) {
            const edited = updateMemory(editingId, { outfit, background, ...reflection });
            if (!edited.ok) { setSaveFailed(true); return; }
            setSaveFailed(false);
            setJustSaved(false);
            setMemories(edited.memories);
            setViewing(edited.memory);
            setEditingId(null);
            setOutfit({});
            setBackground(null);
            setReflection({ rating: 0, keep: "", leave: "" });
            setScreen("confirm");
            return;
          }
          const result = saveMemory({ outfit, background, ...reflection, draftId });
          if (!result.ok) {
            // Stay on this page so nothing the user wrote is lost
            setSaveFailed(true);
            return;
          }
          trackEvent("outfit_saved");
          setDrafts(loadDrafts());
          setSaveFailed(false);
          setJustSaved(true);
          setBackTo("welcome");
          setMemories(result.memories);
          setViewing(result.memories[0]);
          setDraftId(null);
          setOutfit({});
          setBackground(null);
          setReflection({ rating: 0, keep: "", leave: "" });
          setScreen("confirm");
        }}
      />
    );
  }
  if (screen === "confirm" && viewing) {
    return (
      <ConfirmScreen
        memory={viewing}
        justSaved={justSaved}
        onBack={() => setScreen(backTo)}
        canEdit={memories.some((m) => m.id === viewing.id)}
        onEdit={() => {
          setDraftId(null);
          setOpenAi(false);
          setOutfit(viewing.outfit || {});
          setBackground(viewing.background || null);
          setReflection({ rating: viewing.rating || 0, keep: viewing.keep || "", leave: viewing.leave || "" });
          setEditingId(viewing.id);
          setScreen("dressup");
        }}
        onDelete={() => {
          updateMemoryMeta(viewing.id, { deleted: true });
          setMemories(loadMemories());
          setViewing(null);
          setScreen(backTo);
        }}
      />
    );
  }
  const savedDraft = drafts.find((draft) => draft.id === draftId);
  const matchesSaved = outfitMatches(outfit, savedDraft?.outfit) && background === (savedDraft?.background ?? null);
  return (
    <DressUpScreen
      startWithAi={openAi}
      outfit={outfit}
      setOutfit={setOutfit}
      background={background}
      setBackground={setBackground}
      onBack={() => {
        setOutfit({});
        setBackground(null);
        setDraftId(null);
        setDraftError(false);
        setReflection({ rating: 0, keep: "", leave: "" });
        if (editingId) { setEditingId(null); setScreen("confirm"); return; }
        setScreen("welcome");
      }}
      hasUnsavedChanges={editingId ? !(outfitMatches(outfit, viewing?.outfit) && background === (viewing?.background ?? null)) : !matchesSaved}
      draftSaved={Boolean(savedDraft) && matchesSaved}
      draftError={draftError}
      onSaveDraft={() => {
        if (savedDraft && matchesSaved) {
          const result = removeDraft(draftId);
          if (!result.ok) { setDraftError(true); return; }
          setDrafts(result.drafts);
          setDraftId(null);
          setDraftError(false);
          return;
        }
        const result = saveDraft({ id: draftId, outfit, background });
        if (!result.ok) { setDraftError(true); return; }
        setDrafts(result.drafts);
        setDraftId(result.id);
        setDraftError(false);
      }}
      onReflect={() => setScreen("reflection")}
    />
  );
}
