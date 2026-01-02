import { create } from "zustand";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const useTailgatingStore = create((set, get) => ({
  // Progress
  encounterIndex: 0,
  totalEncounters: 5,

  // Meters
  socialPressure: 0,
  maxPressure: 0,
  securityRisk: 0,

  // Outcomes
  breachOccurred: false,
  ending: null, // "perfect" | "good" | "fail"

  // Optional logging
  incidents: [], // { encounter, type, message }

  // Config thresholds (tune later)
  thresholds: {
    perfectRiskMax: 20,
    perfectMaxPressureMax: 60,
  },

  resetGame: () =>
    set({
      encounterIndex: 0,
      socialPressure: 0,
      maxPressure: 0,
      securityRisk: 0,
      breachOccurred: false,
      ending: null,
      incidents: [],
    }),

  setEncounterIndex: (index) => {
    const t = get().totalEncounters;
    set({ encounterIndex: clamp(index, 0, Math.max(0, t - 1)) });
  },

  // Generic meter update used by the Phaser scene
  applyDeltas: ({ pressureDelta = 0, riskDelta = 0, incident = null }) =>
    set((state) => {
      const socialPressure = clamp(state.socialPressure + pressureDelta, 0, 100);
      const securityRisk = clamp(state.securityRisk + riskDelta, 0, 100);
      const maxPressure = Math.max(state.maxPressure, socialPressure);

      return {
        socialPressure,
        securityRisk,
        maxPressure,
        incidents: incident ? [...state.incidents, incident] : state.incidents,
      };
    }),

  setPressure: (value, incident = null) =>
    set((state) => {
      const socialPressure = clamp(value, 0, 100);
      return {
        socialPressure,
        maxPressure: Math.max(state.maxPressure, socialPressure),
        incidents: incident ? [...state.incidents, incident] : state.incidents,
      };
    }),

  setRisk: (value, incident = null) =>
    set((state) => ({
      securityRisk: clamp(value, 0, 100),
      incidents: incident ? [...state.incidents, incident] : state.incidents,
    })),

  // Fail state
  setFail: (message = "An unauthorised person gained access.") =>
    set((state) => ({
      breachOccurred: true,
      ending: "fail",
      incidents: [
        ...state.incidents,
        { encounter: state.encounterIndex, type: "breach", message },
      ],
    })),

  // Ending uses BOTH risk and maxPressure now
  evaluateEnding: () => {
    const { breachOccurred, securityRisk, maxPressure, thresholds } = get();

    if (breachOccurred) {
      set({ ending: "fail" });
      return "fail";
    }

    const perfect =
      securityRisk <= thresholds.perfectRiskMax &&
      maxPressure <= thresholds.perfectMaxPressureMax;

    const ending = perfect ? "perfect" : "good";
    set({ ending });
    return ending;
  },
}));
