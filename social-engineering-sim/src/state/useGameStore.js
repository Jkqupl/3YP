import { create } from "zustand"
import { EMAILS } from "../data/emails";

export const useGameStore = create((set, get) => ({
  
  userDecisions: {},

  emails: EMAILS,
  currentEmailId: EMAILS[0]?.id ?? null,

  setCurrentEmailId: (id) => set({ currentEmailId: id }),


  // helpers
  getCurrentEmail() {
    const { day, inbox, currentEmailId } = get()
    if (!currentEmailId) return null
    const list = inbox[day] || []
    return list.find(e => e.id === currentEmailId) || null
  },

  selectEmail(id) {
    set({ currentEmailId: id })
  },

  setDecision: (emailId, decision) =>
    set((state) => ({
      userDecisions: {
        ...state.userDecisions,
        [emailId]: decision,
      },
    })),

  resetDecisions: () => set({ userDecisions: {} }),

  getScore: () => {
    const { emails, userDecisions } = get();

    let correct = 0;

    for (const e of emails) {
      if (userDecisions[e.id] === e.groundTruth) {
        correct++;
      }
    }

    return {
      correct,
      total: emails.length,
      percent: Math.round((correct / emails.length) * 100),
    };
  },

  decideAndNext: (emailId, decision) =>
  set((state) => {
    const userDecisions = { ...state.userDecisions, [emailId]: decision };

    // Find next email (wrap around)
    const idx = state.emails.findIndex((e) => e.id === state.currentEmailId);
    const next =
      idx >= 0 && state.emails.length > 0
        ? state.emails[(idx + 1) % state.emails.length].id
        : state.currentEmailId;

    return {
      userDecisions,
      currentEmailId: next,
    };
  }),

  
  resetGame: () =>
  set((state) => ({
    userDecisions: {},
    currentEmailId: state.emails[0]?.id ?? null,
  })),

}))
