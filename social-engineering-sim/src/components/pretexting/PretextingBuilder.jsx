import React, { useEffect, useMemo, useState } from "react";
import {
  PRETEXTING_SCENARIOS,
  getPretextingCategoriesForScenario,
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
  const roundResult = usePretextingStore((s) => s.roundResult);

  const phase = usePretextingStore((s) => s.phase);
  const dialogueStep = usePretextingStore((s) => s.dialogueStep);
  const setDialogueStep = usePretextingStore((s) => s.setDialogueStep);

  const verificationChoice = usePretextingStore((s) => s.verificationChoice);
  const setVerificationChoice = usePretextingStore(
    (s) => s.setVerificationChoice,
  );
  const applyVerification = usePretextingStore((s) => s.applyVerification);

  const selectComponent = usePretextingStore((s) => s.selectComponent);
  const canSubmit = usePretextingStore((s) => s.canSubmit);
  const submitRound = usePretextingStore((s) => s.submitRound);
  const nextRound = usePretextingStore((s) => s.nextRound);
  const isLastRound = usePretextingStore((s) => s.isLastRound);

  const scenario = PRETEXTING_SCENARIOS[roundIndex];

  // Phase 1 categories: everything except verification
  const buildCategories = getPretextingCategoriesForScenario(scenario).filter(
    (c) => c.key !== "verification",
  );

  // Phase 2 categories: only verification
  const verificationCategory = getPretextingCategoriesForScenario(
    scenario,
  ).find((c) => c.key === "verification");

  const verificationApplied = Boolean(roundResult?.verificationApplied);

  const buildKeys = ["identity", "context", "emotion", "request"];
  const progressCount = buildKeys.filter((k) => Boolean(selections[k])).length;
  const progressPct = (progressCount / buildKeys.length) * 100;

  const dialogue = useMemo(() => roundResult?.dialogue || [], [roundResult]);
  const dialogueLen = dialogue.length;
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const chosenVerificationLabel =
    (verificationCategory?.options || []).find(
      (o) => o.id === verificationChoice,
    )?.label || "None";

  // Reset typing when entering reveal phase or when scenario changes
  useEffect(() => {
    if (phase !== "reveal") return;
    setLineIdx(0);
    setCharIdx(0);
  }, [phase, roundIndex]);

  // Typewriter effect
  useEffect(() => {
    if (phase !== "reveal") return;
    if (!dialogue.length) return;

    const current = dialogue[lineIdx];
    if (!current) return;

    const text = current.text || "";
    const doneLine = charIdx >= text.length;

    // pause briefly at end of a line, then go next line
    if (doneLine) {
      if (lineIdx >= dialogue.length - 1) return;

      const t = setTimeout(() => {
        setLineIdx((v) => v + 1);
        setCharIdx(0);
      }, 450);

      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setCharIdx((v) => v + 1);
    }, 18); // typing speed

    return () => clearTimeout(t);
  }, [phase, dialogue, lineIdx, charIdx]);

  const dialogueDone =
    phase === "reveal" &&
    dialogue.length > 0 &&
    lineIdx === dialogue.length - 1 &&
    charIdx >= (dialogue[lineIdx]?.text?.length || 0);

  // Build the rendered dialogue: full previous lines + partial current line
  const renderedDialogue = dialogue
    .slice(0, lineIdx)
    .map((l) => ({ who: l.who, text: l.text }));

  if (phase === "reveal" && dialogue[lineIdx]) {
    renderedDialogue.push({
      who: dialogue[lineIdx].who,
      text: (dialogue[lineIdx].text || "").slice(0, charIdx),
    });
  }

  // Auto reveal dialogue while on reveal page
  useEffect(() => {
    if (phase !== "reveal") return;
    if (!dialogueLen) return;

    if (dialogueStep >= dialogueLen) return;

    const t = setTimeout(() => {
      setDialogueStep(dialogueStep + 1);
    }, 850);

    return () => clearTimeout(t);
  }, [phase, dialogueLen, dialogueStep, setDialogueStep]);

  return (
    <div className="h-full w-full p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm text-slate-400">
            Round {roundIndex + 1} of {totalRounds}
          </div>
          <h2 className="text-2xl font-bold text-cyan-300">{scenario.title}</h2>

          {phase === "build" ? (
            <p className="text-slate-300 max-w-3xl">
              <span className="text-slate-400">Scenario:</span>{" "}
              {scenario.prompt}
            </p>
          ) : (
            <p className="text-slate-300 max-w-3xl">{scenario.prompt}</p>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">
            {phase === "build" ? "Build" : "Reveal"}
          </div>
          <div className="text-slate-300 text-sm">
            {phase === "build"
              ? "Assemble the attempt."
              : "Watch the dialogue, then pick the verification step."}
          </div>
        </div>
      </div>

      {phase === "build" ? (
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* left column: options */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {/* Progress bar */}
            <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Build progress</span>
                <span className="text-slate-400">{progressCount}/4</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {buildCategories.map((cat) => (
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

          {/* right column: preview + submit */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Assembled attempt</div>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                {[
                  `Claimed identity: ${selections.identity || "..."}`,
                  `Context: ${selections.context || "..."}`,
                  `Tone: ${selections.emotion || "..."}`,
                  `Request: ${selections.request || "..."}`,
                ].join("\n")}
              </pre>
            </div>

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
                Next you will see the dialogue, then choose verification.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Reveal page left: dialogue */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <div className="text-slate-200 font-semibold">Dialogue</div>
                <div className="text-sm text-slate-400">
                  Convincing:{" "}
                  <span className="text-cyan-200 font-semibold">
                    {roundResult?.convincingScore ?? 0}/100
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm text-slate-200">
                {renderedDialogue.map((line, idx) => (
                  <div key={idx}>
                    <span className="text-slate-400">{line.who}:</span>{" "}
                    <span>{line.text}</span>
                    {idx === renderedDialogue.length - 1 && !dialogueDone ? (
                      <span className="text-slate-500">▌</span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  disabled={dialogueDone}
                  onClick={() => {
                    if (!dialogue.length) return;
                    setLineIdx(dialogue.length - 1);
                    setCharIdx(
                      (dialogue[dialogue.length - 1].text || "").length,
                    );
                  }}
                  className={[
                    "px-4 py-2 rounded-lg font-semibold transition",
                    dialogueDone
                      ? "bg-slate-900 text-slate-500 cursor-not-allowed"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-100",
                  ].join(" ")}
                >
                  Show all
                </button>
              </div>
            </div>

            {roundResult?.suspicion?.length ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-sm text-slate-300 font-semibold">
                  Signals
                </div>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 mt-2">
                  {roundResult.suspicion.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Reveal page right: verification + outcome */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 text-sm">
              <div className="text-slate-200">
                If nobody verifies, the target would{" "}
                <span
                  className={
                    roundResult?.targetWouldComply
                      ? "text-red-300"
                      : "text-green-300"
                  }
                >
                  {roundResult?.targetWouldComply ? "comply" : "resist"}
                </span>
                .
              </div>

              {verificationApplied ? (
                <div className="text-slate-200">
                  After verification, outcome is{" "}
                  <span
                    className={
                      roundResult?.secureOutcome
                        ? "text-green-300"
                        : "text-red-300"
                    }
                  >
                    {roundResult?.secureOutcome ? "safe" : "compromised"}
                  </span>
                </div>
              ) : (
                <div className="text-slate-400">
                  Choose a verification step after the dialogue finishes.
                </div>
              )}
            </div>
            {dialogueDone && roundResult?.targetWouldComply && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="text-sm text-slate-300 font-semibold">
                  What the target could have done to verify
                </div>

                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {(roundResult.bestVerificationLabels || []).map(
                    (label, i) => (
                      <li key={i}>{label}</li>
                    ),
                  )}
                </ul>

                {scenario.verifyLine && (
                  <p className="text-xs text-slate-400">
                    {scenario.verifyLine}
                  </p>
                )}

                <p className="text-xs text-slate-400">
                  This step breaks the attacker’s control of the interaction.
                </p>
              </div>
            )}

            {false && !verificationApplied ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="text-sm text-slate-300 font-semibold">
                  What verification step is necessary?
                </div>

                <div className="space-y-2">
                  {(verificationCategory?.options || []).map((opt) => (
                    <OptionButton
                      key={opt.id}
                      active={verificationChoice === opt.id}
                      onClick={() => setVerificationChoice(opt.id)}
                    >
                      {opt.label}
                    </OptionButton>
                  ))}
                </div>

                <button
                  disabled={!dialogueDone || !verificationChoice}
                  onClick={() => applyVerification()}
                  className={[
                    "w-full px-4 py-3 rounded-lg font-semibold transition",
                    dialogueDone && verificationChoice
                      ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed",
                  ].join(" ")}
                >
                  Apply verification
                </button>

                <p className="text-xs text-slate-400">
                  Verification is the defensive response, not part of the
                  message.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-sm text-slate-300 font-semibold">
                  {roundResult?.takeawayTitle}
                </div>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 mt-2">
                  {(roundResult?.takeawayBullets || []).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                <div className="pt-4 flex gap-3">
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
      )}
    </div>
  );
}
