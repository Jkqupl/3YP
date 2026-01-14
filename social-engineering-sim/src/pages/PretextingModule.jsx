import React, { useState } from "react";
import { Link } from "react-router-dom";
import PretextingBuilder from "../components/pretexting/PretextingBuilder";
import { usePretextingStore } from "../state/usePretextingStore";

export default function PretextingModule() {
  const [started, setStarted] = useState(false);
  const computeEnding = usePretextingStore((s) => s.computeEnding);

  const onStart = () => {
    usePretextingStore.getState().resetGame();
    setStarted(true);
  };

  const onExit = () => {
    usePretextingStore.getState().resetGame();
    setStarted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-slate-950 shadow-xl rounded-xl overflow-hidden">
        {!started && (
          <div className="text-sm text-slate-400 px-10 pt-6">
            <Link to="/" className="text-cyan-400 hover:text-cyan-300">
              Home
            </Link>
            <span className="mx-1">/</span>
            <span>Pretexting Module</span>
          </div>
        )}

        {!started ? (
          <div className="p-10 space-y-10">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-cyan-300">Pretexting</h1>
              <p className="text-slate-300 max-w-3xl">
                Pretexting is a social engineering tactic where an attacker
                builds a believable story to gain trust and pressure someone
                into sharing information or bypassing normal procedures.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-100">
                  What you will learn
                </h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>How stories gain credibility through details</li>
                  <li>How authority and urgency suppress verification</li>
                  <li>How to spot contradictions and high risk requests</li>
                  <li>The simplest verification step that stops an attempt</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-100">
                  How the exercise works
                </h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Pick components to assemble a pretext attempt</li>
                  <li>Choose the best verification step</li>
                  <li>See how the target reacts and why</li>
                  <li>Get a defensive takeaway each round</li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                  >
                    Start module
                  </button>
                  <p className="text-slate-400 text-sm mt-2">
                    5 short scenarios. Each round gives instant feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[78vh] w-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <PretextingBuilder
                onFinish={() => {
                  const ending = computeEnding();
                  alert(`Module complete: ${ending}`);
                  onExit();
                }}
              />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="text-slate-400 text-sm">
                Tip: High risk requests plus pressure should trigger
                verification every time.
              </div>
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
              >
                Exit module
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
