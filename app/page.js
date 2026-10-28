"use client";

import { useState } from "react";
import StartScreen from "@/components/StartScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import DressUpScreen from "@/components/DressUpScreen";
import ReflectionScreen from "@/components/ReflectionScreen";
import ConfirmScreen from "@/components/ConfirmScreen";
import CalendarScreen from "@/components/CalendarScreen";
import InsightsScreen from "@/components/InsightsScreen";
import { loadMemories, saveMemory } from "@/lib/memories";
import "./screens.css";

export default function Home() {
  const [screen, setScreen] = useState("start");
  const [outfit, setOutfit] = useState({});
  // Read once on the client. Only the Welcome screen shows it, and that never renders on the server.
  const [memories, setMemories] = useState(loadMemories);
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
  // Only Home and Calendar exist so far. The other tabs do nothing yet.
  const goTab = (id) => {
    if (id === "home") setScreen("welcome");
    if (id === "calendar") setScreen("calendar");
    if (id === "insights") setScreen("insights");
  };
  const openMemory = (m) => {
    setBackTo(screen);
    setViewing(m);
    setJustSaved(false);
    setScreen("confirm");
  };

  if (screen === "insights") {
    return <InsightsScreen onNavigate={goTab} />;
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
        onDress={() => setScreen("dressup")}
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
          const result = saveMemory({ outfit, background, ...reflection });
          if (!result.ok) {
            // Stay on this page so nothing the user wrote is lost
            setSaveFailed(true);
            return;
          }
          setSaveFailed(false);
          setJustSaved(true);
          setBackTo("welcome");
          setMemories(result.memories);
          setViewing(result.memories[0]);
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
  return (
    <DressUpScreen
      outfit={outfit}
      setOutfit={setOutfit}
      background={background}
      setBackground={setBackground}
      onBack={() => setScreen("welcome")}
      onReflect={() => setScreen("reflection")}
    />
  );
}
