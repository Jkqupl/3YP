import React from "react";
import { useGameStore } from "../state/useGameStore";
import PhaserSimulation from "../game/PhaserSimulation";

export default function EmailPanel() {
  const day = useGameStore((state) => state.day);
  const simulationMode = useGameStore((state) => state.simulationMode);

  const email = useGameStore((state) => {
    const list = state.inbox[state.day] || [];
    return list.find((e) => e.id === state.currentEmailId) || null;
  });

  const deleteEmail = useGameStore((state) => state.deleteEmail);
  const handleDanceLegit = useGameStore((state) => state.handleDanceLegit);
  const startSimulation = useGameStore((state) => state.startSimulation);

  if (simulationMode) {
    return (
      <div className="h-full bg-slate-900/80 border border-cyan-700 rounded-lg flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b border-cyan-700 bg-slate-950/80">
          <p className="text-xs uppercase tracking-wide text-cyan-400">
            Simulation - {simulationMode === "gmail" && "Gmail login"}
            {simulationMode === "amazon" && "Amazon receipt"}
            {simulationMode === "dance" && "Dance registration"}
          </p>
        </div>

        <div className="w-full h-full min-h-[320px] flex items-center justify-center">
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <PhaserSimulation mode={simulationMode} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900/80 border border-cyan-700 rounded-lg overflow-hidden flex flex-col">
      <div className="px-3 py-2 border-b border-cyan-700 bg-slate-950/80 flex justify-between">
        <p className="text-xs uppercase tracking-wide text-cyan-400">
          Email view
        </p>
        <p className="text-xs text-slate-500">Day {day}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        {!email && (
          <p className="text-sm text-slate-400">
            Select an email to view its contents.
          </p>
        )}

        {email && (
          <>
            <h2 className="text-lg text-slate-100">{email.subject}</h2>
            <p className="text-xs text-slate-400 mb-3">
              Type:{" "}
              {email.type === "phish" ? "Potential phishing" : "Legitimate"}
            </p>

            {email.id === "gmail" && (
              <p className="text-sm text-slate-200 max-w-xl">
                The security alert may lead to a fake login page designed to
                steal credentials.
              </p>
            )}

            {email.id === "amazon" && (
              <p className="text-sm text-slate-200 max-w-xl">
                The order number does not match any actual previous purchases,
                which is suspicious.
              </p>
            )}

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => deleteEmail(email.id)}
                className="px-3 py-1.5 text-xs rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-semibold"
              >
                Delete email
              </button>

              {/* Email body text */}
              {email.id === "dance" && (
                <button
                  onClick={() => startSimulation("dance")}
                  className="px-3 py-1.5 text-xs rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
                >
                  View registration link
                </button>
              )}

              {email.id === "gmail" && (
                <button
                  onClick={() => startSimulation("gmail")}
                  className="px-3 py-1.5 text-xs rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                >
                  View alert link
                </button>
              )}

              {email.id === "amazon" && (
                <button
                  onClick={() => startSimulation("amazon")}
                  className="px-3 py-1.5 text-xs rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold"
                >
                  Inspect order number
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
