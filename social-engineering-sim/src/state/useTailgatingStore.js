import { create } from "zustand";

/*
Tailgating game state model

Design goals:
- Persistent meters across encounters
- Deterministic endings
- Clear Phaser -> store API
- No UI or asset assumptions
*/

export const useTailgatingStore = create((set, get) => ({
  /* -------------------------
     Core progression
  ------------------------- */
  encounterIndex: 0, // 0 to 4
  totalEncounters: 5,

  /* -------------------------
     Meters
  ------------------------- */
  socialPressure: 0, // 0 to 100
  securityRisk: 0,   // 0 to 100

  /* -------------------------
     Outcome tracking
  ------------------------- */
  breachOccurred: false,
  ending: null, // "perfect" | "good" | "fail"

  /* -------------------------
     Feedback / logging
  ------------------------- */
  incidents: [], // array of { encounter, type, message }

  /* -------------------------
     Configuration
  ------------------------- */
  limits: {
    maxPressure: 100,
    maxRisk: 100,
    pressureWarning: 70,
    riskWarning: 60,
  },

  /* -------------------------
     Reset
  ------------------------- */
  resetGame: () =>
    set({
      encounterIndex: 0,
      socialPressure: 0,
      securityRisk: 0,
      breachOccurred: false,
      ending: null,
      incidents: [],
    }),

  /* -------------------------
     Encounter flow
  ------------------------- */
  startNextEncounter: () => {
    const { encounterIndex, totalEncounters, ending } = get();
    if (ending) return;
    if (encounterIndex < totalEncounters - 1) {
      set({ encounterIndex: encounterIndex + 1 });
    } else {
      get().evaluateEnding();
    }
  },

  /* -------------------------
     Pressure logic
  ------------------------- */
  increasePressure: (amount, reason = "") =>
    set((state) => {
      const newValue = Math.min(
        state.socialPressure + amount,
        state.limits.maxPressure
      );

      return {
        socialPressure: newValue,
        incidents: reason
          ? [
              ...state.incidents,
              {
                encounter: state.encounterIndex,
                type: "pressure",
                message: reason,
              },
            ]
          : state.incidents,
      };
    }),

  reducePressure: (amount) =>
    set((state) => ({
      socialPressure: Math.max(state.socialPressure - amount, 0),
    })),

  /* -------------------------
     Risk logic
  ------------------------- */
  increaseRisk: (amount, reason = "") =>
    set((state) => {
      const newValue = Math.min(
        state.securityRisk + amount,
        state.limits.maxRisk
      );

      return {
        securityRisk: newValue,
        incidents: reason
          ? [
              ...state.incidents,
              {
                encounter: state.encounterIndex,
                type: "risk",
                message: reason,
              },
            ]
          : state.incidents,
      };
    }),

  /* -------------------------
     Player decisions
  ------------------------- */
  letLegitimateResidentIn: () => {
    get().increaseRisk(
      5,
      "A resident entered without using the access system."
    );
    get().startNextEncounter();
  },

  redirectToKeyFob: () => {
    get().reducePressure(5);
    get().startNextEncounter();
  },

  waitSilently: () => {
    get().increasePressure(
      8,
      "Waiting increased social pressure."
    );
    get().startNextEncounter();
  },

  askQuestion: () => {
    get().reducePressure(3);
    get().startNextEncounter();
  },

  useIntercom: () => {
    get().reducePressure(8);
    get().startNextEncounter();
  },

  /* -------------------------
     Attacker handling
  ------------------------- */
  letAttackerIn: () => {
    set({
      breachOccurred: true,
      ending: "fail",
    });
  },

  safelyRefuseEntry: () => {
    get().reducePressure(10);
    get().startNextEncounter();
  },

  /* -------------------------
     Ending evaluation
  ------------------------- */
  evaluateEnding: () => {
    const { breachOccurred, securityRisk } = get();

    if (breachOccurred) {
      set({ ending: "fail" });
      return;
    }

    if (securityRisk < 40) {
      set({ ending: "perfect" });
    } else {
      set({ ending: "good" });
    }
  },
}));
