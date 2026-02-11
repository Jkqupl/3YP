import React from "react";
import InboxPanel from "./InboxPanel";
import EmailPanel from "./EmailPanel";
import { useGameStore } from "../state/useGameStore";
import PhishingLayout from "./PhishingLayout";

export default function MonitorFrame() {
  const ending = useGameStore((state) => state.ending);
  const resetGame = useGameStore((state) => state.resetGame);
  const failReason = useGameStore((state) => state.failReason);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-6xl h-[82vh] md:h-[78vh] border border-cyan-500 bg-slate-900/90 shadow-xl rounded-xl p-4 flex flex-col">
        <header className="flex items-center justify-between mb-3 border-b border-cyan-700 pb-2">
          <h1 className="text-cyan-300 text-xl font-semibold">
            Social Engineering Simulator - Corporate Terminal
          </h1>
          <p className="text-xs text-slate-400">Credential Funnel Training</p>
        </header>

        {ending ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {ending === "fail" && (
              <>
                <h2 className="text-red-400 text-3xl font-bold">Fail ending</h2>
                <p className="text-slate-200 max-w-xl text-center">
                  {failReason}
                </p>
              </>
            )}

            {ending === "good" && (
              <>
                <h2 className="text-cyan-300 text-3xl font-bold">
                  Good ending
                </h2>
                <p className="text-slate-200 max-w-xl text-center">
                  You avoided the phishing attacks but treated a legitimate
                  email as unsafe.
                </p>
              </>
            )}

            {ending === "perfect" && (
              <>
                <h2 className="text-emerald-400 text-3xl font-bold">
                  Perfect ending
                </h2>
                <p className="text-slate-200 max-w-xl text-center">
                  You handled every scenario safely and correctly.
                </p>
              </>
            )}

            <button
              onClick={resetGame}
              className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded"
            >
              Retry training
            </button>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <PhishingLayout />
          </div>
        )}
      </div>
    </div>
  );
}
