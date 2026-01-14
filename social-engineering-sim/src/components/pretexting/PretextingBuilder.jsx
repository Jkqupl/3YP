import React from "react";
import {
  PRETEXTING_SCENARIOS,
  PRETEXTING_CATEGORIES,
} from "../../game/scenes/pretexting/pretextingScenarios";
import { usePretextingStore } from "../../state/usePretextingStore";

function OptionButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-3 py-2 rounded-lg border transition",
        active
          ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
          : "border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function PretextingBuilder({ onFinish }) {
  const roundIndex = usePretextingStore((s) => s.roundIndex);
  const totalRounds = usePretextingStore((s) => s.totalRounds);
  const selections = usePretextingStore((s) => s.selections);
  const submitted = usePretextingStore((s) => s.submitted);
  const roundResult = usePretextingStore((s) => s.roundResult);

  const selectComponent = usePretextingStore((s) => s.selectComponent);
  const canSubmit = usePretextingStore((s) => s.canSubmit);
  const submitRound = usePretextingStore((s) => s.submitRound);
  const nextRound = usePretextingStore((s) => s.nextRound);
  const isLastRound = usePretextingStore((s) => s.isLastRound);

  const scenario = PRETEXTING_SCENARIOS[roundIndex];

  return (
    <div className="h-full w-full p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-400">
            Round {roundIndex + 1} of {totalRounds}
          </div>
          <h2 className="text-2xl font-bold text-cyan-300">{scenario.title}</h2>
          <p className="text-slate-300 max-w-3xl">{scenario.prompt}</p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">Goal</div>
          <div className="text-slate-300 text-sm">
            Build the attempt, then choose the safest verification step.
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          {PRETEXTING_CATEGORIES.map((cat) => (
            <div key={cat.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-100 font-semibold">{cat.title}</h3>
                <span className="text-xs text-slate-500">
                  {selections[cat.key] ? "Selected" : "Pick one"}
                </span>
              </div>

              <div className="space-y-2">
                {cat.options.map((opt) => (
                  <OptionButton
                    key={opt.id}
                    active={selections[cat.key] === opt.id}
                    onClick={() => selectComponent(cat.key, opt.id)}
                  >
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="text-sm text-slate-400">Assembled attempt</div>
            <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
              {roundResult?.preview ||
                [
                  `Claimed identity: ${selections.identity || "..."}`,
                  `Context: ${selections.context || "..."}`,
                  `Tone: ${selections.emotion || "..."}`,
                  `Request: ${selections.request || "..."}`,
                  `Verification: ${selections.verification || "..."}`,
                ].join("\n")}
            </pre>
          </div>

          {!submitted ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
              <button
                disabled={!canSubmit()}
                onClick={() => submitRound()}
                className={[
                  "w-full px-4 py-3 rounded-lg font-semibold transition",
                  canSubmit()
                    ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed",
                ].join(" ")}
              >
                Submit attempt
              </button>
              <p className="text-xs text-slate-400">
                You must select all components before submitting.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-slate-200 font-semibold">Outcome</div>
                <div className="text-sm text-slate-300">
                  Convincing:{" "}
                  <span className="text-cyan-200 font-semibold">
                    {roundResult?.convincingScore ?? 0}/100
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-slate-200">
                  Target reaction:{" "}
                  <span
                    className={
                      roundResult?.secureOutcome
                        ? "text-cyan-200"
                        : "text-red-300"
                    }
                  >
                    {roundResult?.secureOutcome
                      ? "Resisted or verified"
                      : "Complied"}
                  </span>
                </div>
                <div className="text-slate-400">
                  Your verification choice:{" "}
                  <span className="text-slate-200">
                    {roundResult?.playerVerificationLabel}
                  </span>
                </div>
                <div className="text-slate-400">
                  Best verification:{" "}
                  <span className="text-slate-200">
                    {roundResult?.bestVerification?.join(" or ") || "N/A"}
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-3">
                <div className="text-sm text-slate-300 font-semibold">
                  Dialogue
                </div>
                <div className="mt-2 space-y-2 text-sm text-slate-200">
                  {roundResult?.dialogue?.map((line, idx) => (
                    <div key={idx}>
                      <span className="text-slate-400">{line.who}:</span>{" "}
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {roundResult?.suspicion?.length ? (
                <div className="space-y-1">
                  <div className="text-sm text-slate-300 font-semibold">
                    Signals
                  </div>
                  <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                    {roundResult.suspicion.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-1">
                <div className="text-sm text-slate-300 font-semibold">
                  {roundResult?.takeawayTitle}
                </div>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {(roundResult?.takeawayBullets || []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex gap-3">
                {!isLastRound() ? (
                  <button
                    onClick={() => nextRound()}
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold"
                  >
                    Next scenario
                  </button>
                ) : (
                  <button
                    onClick={onFinish}
                    className="flex-1 px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                  >
                    Finish module
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
