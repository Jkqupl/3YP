import React from "react";
import { useGameStore } from "../state/useGameStore";

export default function InboxPanel() {
  const emails = useGameStore((s) => s.emails);
  const currentEmailId = useGameStore((s) => s.currentEmailId);
  const setCurrentEmailId = useGameStore((s) => s.setCurrentEmailId);

  return (
    <div className="h-full overflow-auto border-r border-slate-800">
      <div className="px-4 py-3 text-slate-200 font-semibold">Inbox</div>

      <div className="space-y-1 px-2 pb-3">
        {emails.map((e) => {
          const active = e.id === currentEmailId;
          return (
            <button
              key={e.id}
              onClick={() => setCurrentEmailId(e.id)}
              className={[
                "w-full text-left rounded-lg px-3 py-2 border transition",
                active
                  ? "border-cyan-400 bg-cyan-500/10 text-slate-100"
                  : "border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900/50",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="truncate font-medium">{e.fromName}</div>
                <div className="text-xs text-slate-400">{e.time}</div>
              </div>
              <div className="truncate text-sm text-slate-300">{e.subject}</div>
              <div className="truncate text-xs text-slate-500">
                {e.fromEmail}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
