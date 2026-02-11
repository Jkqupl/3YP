import React, { useEffect, useState } from "react";
import InboxPanel from "./InboxPanel";
import EmailPanel from "./EmailPanel";
import { useGameStore } from "../state/useGameStore";

export default function PhishingLayout() {
  const currentEmailId = useGameStore((s) => s.currentEmailId);
  const [view, setView] = useState("inbox"); // inbox | email

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  useEffect(() => {
    if (isMobile && currentEmailId) setView("email");
  }, [currentEmailId, isMobile]);

  if (!isMobile) {
    return (
      <div className="h-full grid grid-cols-[360px_1fr]">
        <InboxPanel />
        <EmailPanel />
      </div>
    );
  }

  return (
    <div className="h-full">
      {view === "inbox" ? (
        <InboxPanel onOpenEmail={() => setView("email")} />
      ) : (
        <EmailPanel mobile onBack={() => setView("inbox")} />
      )}
    </div>
  );
}
