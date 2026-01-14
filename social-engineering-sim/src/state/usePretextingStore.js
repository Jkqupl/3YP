import { create } from "zustand";
import {
  PRETEXTING_SCENARIOS,
  evaluatePretextingRound,
} from "../game/scenes/pretexting/pretextingScenarios";

const emptySelections = {
  identity: null,
  context: null,
  emotion: null,
  request: null,
};

export const usePretextingStore = create((set, get) => ({
  roundIndex: 0,
  totalRounds: PRETEXTING_SCENARIOS.length,

  selections: { ...emptySelections },

  submitted: false,
  roundResult: null,

  verificationChoice: null,

  phase: "build", // "build" | "reveal"
  dialogueStep: 0,

  
  stats: {
    secureRounds: 0,
    correctVerification: 0,
  },

  resetGame: () =>
  set({
    roundIndex: 0,
    selections: { ...emptySelections },
    submitted: false,
    roundResult: null,
    verificationChoice: null,
    phase: "build",
    dialogueStep: 0,
    stats: { secureRounds: 0, correctVerification: 0 },
  }),


  selectComponent: (key, optionId) =>
    set((s) => ({
      selections: { ...s.selections, [key]: optionId },
    })),

  setVerificationChoice: (id) => set({ verificationChoice: id }),

  canSubmit: () => {
    const sel = get().selections;
    return Boolean(sel.identity && sel.context && sel.emotion && sel.request);
  },

  submitRound: () => {
  const { roundIndex, selections } = get();
  const result = evaluatePretextingRound(roundIndex, selections);

  set({
    submitted: true,
    roundResult: result,
    verificationChoice: null,
    phase: "reveal",
    dialogueStep: 0,
  });
},


  applyVerification: () => {
    const { roundResult, verificationChoice, stats } = get();
    if (!roundResult || !verificationChoice) return;

    const stopped = roundResult.bestVerificationIds.includes(verificationChoice);

    set({
      roundResult: {
        ...roundResult,
        verificationApplied: true,
        secureOutcome: stopped,
        userPickedStopCorrectly: stopped,
        
      },
      stats: {
        secureRounds: stats.secureRounds + (stopped ? 1 : 0),
        correctVerification: stats.correctVerification + (stopped ? 1 : 0),
      },
    });
  },

  nextRound: () => {
  const { roundIndex, totalRounds } = get();
  const next = Math.min(roundIndex + 1, totalRounds - 1);

  set({
    roundIndex: next,
    selections: { ...emptySelections },
    submitted: false,
    roundResult: null,
    verificationChoice: null,
    phase: "build",
    dialogueStep: 0,
  });
},

  nextDialogueLine: () => set((s) => ({ dialogueStep: s.dialogueStep + 1 })),
  skipDialogue: () => {
    const rr = get().roundResult;
    const max = rr?.dialogue?.length ?? 0;
    set({ dialogueStep: max });
  },
  setDialogueStep: (n) => set({ dialogueStep: n }),
  resetDialogue: () => set({ dialogueStep: 0 }),


  isLastRound: () => get().roundIndex === get().totalRounds - 1,

  computeEnding: () => {
    const { secureRounds, correctVerification } = get().stats;
    const total = get().totalRounds;

    if (secureRounds === total && correctVerification >= total - 1) return "perfect";
    if (secureRounds >= Math.ceil(total * 0.6)) return "good";
    return "poor";
  },
}));
