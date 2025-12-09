import React from "react";
import { useGameStore } from "../state/useGameStore";

export default function InboxPanel() {
  const day = useGameStore((state) => state.day);
  const inbox = useGameStore((state) => state.inbox[day] || []);
  const currentEmailId = useGameStore((state) => state.currentEmailId);
  const selectEmail = useGameStore((state) => state.selectEmail);

  return (
    <div className="h-full flex flex-col bg-slate-900/80 border border-cyan-700 rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b border-cyan-700 bg-slate-950/80">
        <p className="text-xs uppercase tracking-wide text-cyan-400">
          Inbox - Day {day}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {inbox.length === 0 && (
          <p className="text-sm text-slate-500 p-3">No messages.</p>
        )}

        {inbox.map((email) => {
          const isActive = currentEmailId === email.id;
          const isPhish = email.type === "phish";

          return (
            <button
              key={email.id}
              onClick={() => selectEmail(email.id)}
              className={[
                "w-full text-left px-3 py-2 border-b border-slate-800 flex items-center gap-2",
                isActive ? "bg-cyan-900/40" : "hover:bg-slate-800/60",
              ].join(" ")}
            >
              <span
                className={
                  "inline-block w-2 h-2 rounded-full " +
                  (isPhish ? "bg-amber-400" : "bg-emerald-400")
                }
              />
              <span className="text-xs text-slate-300">{email.subject}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
