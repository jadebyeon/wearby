"use client";

import { useRef, useState } from "react";
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
import { loadMemories, saveMemory, loadDrafts, saveDraft, removeDraft } from "@/lib/memories";
import "./screens.css";

function outfitMatches(a, b) {
  return JSON.stringify(Object.entries(a || {}).sort()) === JSON.stringify(Object.entries(b || {}).sort());
}

export default function Home() {
  const navigationTransition = useRef(null);
  const [screen, setScreen] = useState("start");
  const [outfit, setOutfit] = useState({});
  // Read once on the client. Only the Welcome screen shows it, and that never renders on the server.
  const [memories, setMemories] = useState(loadMemories);
  const [drafts, setDrafts] = useState(loadDrafts);
  const [draftId, setDraftId] = useState(null);
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
    navigationTransition.current = document.startViewTransition(() => flushSync(() => setScreen(next)));
  };
  const openMemory = (m) => {
    setBackTo(screen);
    setViewing(m);
    setJustSaved(false);
    setScreen("confirm");
  };

  if (screen === "pastmemories") {
    return <PastMemoriesScreen memories={memories} order={memoryOrder} onOrderChange={setMemoryOrder} onOpenMemory={openMemory} onNavigate={goTab} />;
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
        onOpenDraft={(draft) => {
          setDraftId(draft.id);
          setOutfit(draft.outfit);
          setBackground(draft.background);
          setDraftError(false);
          setScreen("dressup");
        }}
        onDress={() => { setDraftId(null); setScreen("dressup"); }}
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
          const result = saveMemory({ outfit, background, ...reflection, draftId });
          if (!result.ok) {
            // Stay on this page so nothing the user wrote is lost
            setSaveFailed(true);
            return;
          }
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
      />
    );
  }
  const savedDraft = drafts.find((draft) => draft.id === draftId);
  const matchesSaved = outfitMatches(outfit, savedDraft?.outfit) && background === (savedDraft?.background ?? null);
  return (
    <DressUpScreen
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
        setScreen("welcome");
      }}
      hasUnsavedChanges={!matchesSaved}
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
