import React, { useState } from "react";
import { Link } from "react-router-dom";
import TailgatingSimulation from "../game/TailgatingSimulation";
import { useTailgatingStore } from "../state/useTailgatingStore";

export default function TailgatingModule() {
  const [started, setStarted] = useState(false);
  const ending = useTailgatingStore((s) => s.ending);

  const onStart = () => {
    useTailgatingStore.getState().resetGame();
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl border border-cyan-500 bg-slate-900/90 shadow-xl rounded-xl overflow-hidden">
        {!started ? (
          <div className="p-10 space-y-10">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-cyan-300">
                  Tailgating Security
                </h1>
                <p className="text-slate-300 max-w-3xl">
                  Tailgating is when someone gains access to a secured building
                  by following closely behind a resident, often by exploiting
                  politeness, urgency, or hesitation. In apartment complexes,
                  attackers may pretend to live there or use believable excuses
                  like deliveries to pressure you into holding the door.
                </p>
              </div>

              <Link
                to="/"
                className="text-slate-300 hover:text-cyan-200 underline"
              >
                Back
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-100">
                  How to avoid it
                </h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>Do not hold secure doors open for strangers.</li>
                  <li>
                    Redirect people to authenticate using their own key fob.
                  </li>
                  <li>
                    Use the intercom or building process when someone “forgot”
                    access.
                  </li>
                  <li>
                    Treat urgency and frustration as warning signs, not reasons
                    to rush.
                  </li>
                  <li>Be consistent, small exceptions add up over time.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-100">
                  What you will practice
                </h2>
                <ul className="list-disc list-inside text-slate-300 space-y-2">
                  <li>
                    Recognising tailgating attempts in residential settings
                  </li>
                  <li>
                    Managing social pressure without compromising security
                  </li>
                  <li>Asking quick questions to gather signals</li>
                  <li>
                    Making safe decisions consistently across multiple
                    encounters
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    onClick={onStart}
                    className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                  >
                    Play simulation
                  </button>
                  <p className="text-slate-400 text-sm mt-2">
                    You will face 5 encounters. Pressure and risk persist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[78vh] w-full">
            <TailgatingSimulation />
            {ending ? (
              <div className="p-4 border-t border-cyan-500/40 bg-slate-950/40 flex items-center justify-between">
                <div className="text-slate-300">
                  Result:{" "}
                  <span className="font-semibold text-cyan-200">{ending}</span>
                </div>
                <button
                  onClick={() => {
                    useTailgatingStore.getState().resetGame();
                    setStarted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Exit simulation
                </button>
              </div>
            ) : (
              <div className="p-4 border-t border-cyan-500/40 bg-slate-950/40 flex items-center justify-between">
                <div className="text-slate-400 text-sm">
                  Tip: If you feel rushed, slow down and redirect to the key fob
                  or intercom process.
                </div>
                <button
                  onClick={() => {
                    useTailgatingStore.getState().resetGame();
                    setStarted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100"
                >
                  Exit simulation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
