import { create } from "zustand";
import { PRETEXTING_SCENARIOS, evaluatePretextingRound } from "../game/scenes/pretexting/pretextingScenarios";

const emptySelections = {
  identity: null,
  context: null,
  emotion: null,
  request: null,
  verification: null
};

export const usePretextingStore = create((set, get) => ({
  roundIndex: 0,
  totalRounds: PRETEXTING_SCENARIOS.length,

  selections: { ...emptySelections },
  submitted: false,
  roundResult: null,

  stats: {
    secureRounds: 0,
    correctVerification: 0
  },

  resetGame: () =>
    set({
      roundIndex: 0,
      selections: { ...emptySelections },
      submitted: false,
      roundResult: null,
      stats: { secureRounds: 0, correctVerification: 0 }
    }),

  selectComponent: (key, optionId) =>
    set((s) => ({
      selections: { ...s.selections, [key]: optionId }
    })),

  canSubmit: () => {
    const sel = get().selections;
    return Boolean(sel.identity && sel.context && sel.emotion && sel.request && sel.verification);
  },

  submitRound: () => {
    const { roundIndex, selections, stats } = get();
    const result = evaluatePretextingRound(roundIndex, selections);

    set({
      submitted: true,
      roundResult: result,
      stats: {
        secureRounds: stats.secureRounds + (result.secureOutcome ? 1 : 0),
        correctVerification: stats.correctVerification + (result.userPickedStopCorrectly ? 1 : 0)
      }
    });
  },

  nextRound: () => {
    const { roundIndex, totalRounds } = get();
    const next = Math.min(roundIndex + 1, totalRounds - 1);

    set({
      roundIndex: next,
      selections: { ...emptySelections },
      submitted: false,
      roundResult: null
    });
  },

  isLastRound: () => get().roundIndex === get().totalRounds - 1,

  computeEnding: () => {
    const { secureRounds, correctVerification } = get().stats;
    const total = get().totalRounds;

    if (secureRounds === total && correctVerification >= total - 1) return "perfect";
    if (secureRounds >= Math.ceil(total * 0.6)) return "good";
    return "poor";
  }
}));
