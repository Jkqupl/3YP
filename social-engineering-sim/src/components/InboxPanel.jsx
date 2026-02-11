import React from "react";
import { useGameStore } from "../state/useGameStore";

export default function InboxPanel({ onOpenEmail }) {
  const emails = useGameStore((s) => s.emails);
  const currentEmailId = useGameStore((s) => s.currentEmailId);
  const setCurrentEmailId = useGameStore((s) => s.setCurrentEmailId);
  const userDecisions = useGameStore((s) => s.userDecisions);

  return (
    <div className="h-full overflow-auto border-r border-slate-800">
      <div className="px-4 py-3 text-slate-200 font-semibold">Inbox</div>

      <div className="space-y-1 px-2 pb-3">
        {emails.map((e) => {
          const active = e.id === currentEmailId;
          const decision = userDecisions[e.id]; // "phish" | "real" | undefined
          const leftBar =
            decision === "phish"
              ? "before:bg-red-500"
              : decision === "real"
                ? "before:bg-green-500"
                : "before:bg-transparent";

          return (
            <button
              key={e.id}
              onClick={() => {
                setCurrentEmailId(e.id);
                onOpenEmail?.();
              }}
              className={[
                "w-full text-left rounded-lg px-3 py-2 md:py-2 py-1.5 border transition relative",
                ,
                "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-l-lg",
                leftBar,
                active
                  ? "border-cyan-400 bg-cyan-500/10"
                  : "border-slate-800 bg-slate-950 hover:bg-slate-900/50",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="truncate font-medium text-slate-200">
                  {e.fromName}
                </div>

                <div className="flex items-center gap-2">
                  {decision && (
                    <span
                      className={[
                        "text-[10px] px-2 py-0.5 rounded-full border",
                        decision === "phish"
                          ? "border-red-500/40 bg-red-500/10 text-red-200"
                          : "border-green-500/40 bg-green-500/10 text-green-200",
                      ].join(" ")}
                    >
                      Marked: {decision === "phish" ? "Malicious" : "Safe"}
                    </span>
                  )}

                  <div className="text-xs text-slate-400">{e.time}</div>
                </div>
              </div>

              <div
                className={[
                  "truncate text-sm",
                  decision && !active ? "text-slate-400" : "text-slate-300",
                ].join(" ")}
              >
                {e.subject}
              </div>

              <div
                className={[
                  "truncate text-xs",
                  decision && !active ? "text-slate-500" : "text-slate-500",
                ].join(" ")}
              >
                {e.fromEmail}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
