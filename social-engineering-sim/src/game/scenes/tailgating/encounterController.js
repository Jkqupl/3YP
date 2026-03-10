/**
 * EncounterController.js
 *
 * Manages the state machine for a single tailgating encounter:
 *   initial → (gather info) → followup → resolved
 *
 * This class is pure logic — it has no Phaser rendering code.
 * It reads from encounterData and writes to the Zustand store.
 * The scene calls its methods and reads its output to drive rendering.
 *
 * Responsibilities:
 *   - Track encounter phase (initial / followup)
 *   - Resolve action keys (including followup key remapping)
 *   - Apply deltas to the store
 *   - Determine which choices to show
 *   - Compose post-encounter feedback text
 *   - Detect fail and terminal conditions
 */

import { useTailgatingStore } from "../../../state/useTailgatingStore";
import {
  ENCOUNTERS,
  OUTCOMES,
  VERDICTS,
  INITIAL_CHOICES,
  FOLLOWUP_CHOICES,
  FOLLOWUP_KEY_MAP,
  PRESSURE_RATES,
} from "./encounterData";

export default class EncounterController {
  constructor() {
    this.reset();
  }

  // ─── State ──────────────────────────────────────────────────────────────────

  reset() {
    this.phase = "initial"; // "initial" | "followup"
    this.usedIntercom = false;
  }

  // ─── Encounter metadata ──────────────────────────────────────────────────────

  /** @returns {object} Current ENCOUNTERS entry */
  currentEncounter() {
    const { encounterIndex } = useTailgatingStore.getState();
    return ENCOUNTERS[encounterIndex];
  }

  /** @returns {number} Base pressure rate ticks per 300 ms for the current encounter */
  pressureRate() {
    const enc = this.currentEncounter();
    return PRESSURE_RATES[enc?.type] ?? PRESSURE_RATES.default;
  }

  /** @returns {boolean} Whether the NPC actively adds pressure when in the queue zone */
  addsPressure() {
    return this.currentEncounter()?.addsPressure ?? true;
  }

  // ─── Choice resolution ───────────────────────────────────────────────────────

  /**
   * Returns the list of choices appropriate for the current phase.
   * @returns {{ label: string, actionKey: string }[]}
   */
  availableChoices() {
    const enc = this.currentEncounter();
    if (!enc) return [];

    const { ending } = useTailgatingStore.getState();
    if (ending) return [];

    if (this.phase === "followup") return FOLLOWUP_CHOICES;
    return INITIAL_CHOICES[enc.type] ?? [];
  }

  /**
   * Resolve a raw action key (e.g. FINAL_LET_IN → LET_IN).
   * @param {string} actionKey
   * @returns {string}
   */
  resolveKey(actionKey) {
    return FOLLOWUP_KEY_MAP[actionKey] ?? actionKey;
  }

  // ─── Action handling ─────────────────────────────────────────────────────────

  /**
   * Process a player choice. Returns a result descriptor for the scene to act on.
   *
   * @param {string} actionKey — raw key from the button (may be a followup key)
   * @returns {ActionResult}
   *
   * ActionResult shape:
   * {
   *   type        : "gather" | "terminal" | "fail" | "final"
   *   response    : string | string[]
   *   feedback    : string
   *   postFeedback: string           — composed verdict + feedback (final/fail only)
   *   npcDirection: "in" | "out"     — for NPC exit animation
   *   pressureDelta, riskDelta       — applied to store already
   * }
   */
  handleAction(actionKey) {
    const enc = this.currentEncounter();
    if (!enc) return null;

    const resolvedKey = this.resolveKey(actionKey);
    const type = enc.type;
    const store = useTailgatingStore.getState();

    // ── REDIRECT_FOB in phase 1 is special: it branches on npcHasFob ──────────
    if (this.phase === "initial" && resolvedKey === "REDIRECT_FOB") {
      return this._handleRedirectFob(enc, store);
    }

    // ── Gather-info actions in phase 1 ────────────────────────────────────────
    const isGather = resolvedKey === "ASK_QUESTION" || resolvedKey === "USE_INTERCOM";
    const noFollowup = type === "decision_attacker_clear";

    if (this.phase === "initial" && isGather) {
      return this._handleGather(enc, resolvedKey, store, noFollowup);
    }

    // ── Second intercom in phase 2 ────────────────────────────────────────────
    if (this.phase === "followup" && resolvedKey === "USE_INTERCOM" && !this.usedIntercom) {
      return this._handleSecondIntercom(enc, resolvedKey, store);
    }

    // ── Parcel refuse-after-talk special case ─────────────────────────────────
    if (
      type === "decision_parcel" &&
      this.phase === "followup" &&
      resolvedKey === "REFUSE"
    ) {
      return this._handleParcelRefuseAfterTalk(enc, store);
    }

    // ── Final action (ends encounter) ─────────────────────────────────────────
    return this._handleFinal(enc, resolvedKey, store);
  }

  // ─── Private handlers ────────────────────────────────────────────────────────

  _handleRedirectFob(enc, store) {
    if (enc.npcHasFob) {
      this._applyDeltas(store, 2, -1, enc, "REDIRECT_FOB success (p2, r-1)");
      const postFeedback = this._composeVerdict(enc.type, "REDIRECT_FOB", "Good call. They authenticated.");
      return {
        type: "terminal",
        response: [
          "You: Please tap your fob.",
          "NPC: Yeah, one sec.",
          "NPC: (taps fob and the door unlocks)",
          'NPC: (mutters) Could\'ve just held it...',
        ],
        feedback: "",
        postFeedback,
        npcDirection: "in",
      };
    }

    // No fob — escalate to followup phase
    this._applyDeltas(store, 6, 0, enc, "REDIRECT_FOB failed (p6, r0)");
    this.phase = "followup";

    return {
      type: "gather",
      response: [
        "You: Please tap your fob.",
        "NPC: I don't have it on me.",
        "NPC: Can you just let me in?",
      ],
      feedback: "",
    };
  }

  _handleGather(enc, resolvedKey, store, noFollowup) {
    const outcome = this._getOutcome(enc.type, resolvedKey);
    this._applyDeltas(store, outcome.pressureDelta, outcome.riskDelta, enc, resolvedKey);

    if (outcome.fail) {
      store.setFail("An unauthorised person gained access.");
      return {
        type: "fail",
        response: outcome.response,
        feedback: outcome.feedback,
        postFeedback: outcome.feedback,
        npcDirection: "in",
      };
    }

    // Terminal gather (e.g. clear attacker, or advanced attacker + intercom)
    const isTerminal =
      noFollowup ||
      outcome.terminal ||
      (enc.type === "decision_attacker_advanced" && resolvedKey === "USE_INTERCOM");

    if (isTerminal) {
      return {
        type: "terminal",
        response: outcome.response,
        feedback: outcome.feedback,
        postFeedback: outcome.feedback,
        npcDirection: "out",
      };
    }

    this.phase = "followup";
    return {
      type: "gather",
      response: outcome.response,
      feedback: outcome.feedback,
    };
  }

  _handleSecondIntercom(enc, resolvedKey, store) {
    const outcome = this._getOutcome(enc.type, resolvedKey);
    this._applyDeltas(store, outcome.pressureDelta, outcome.riskDelta, enc, resolvedKey);
    this.usedIntercom = true;

    return {
      type: "gather",
      response: outcome.response,
      feedback: outcome.feedback,
    };
  }

  _handleParcelRefuseAfterTalk(enc, store) {
    this._applyDeltas(store, 8, -2, enc, "REFUSE then authenticates (parcel) (p8, r-2)");
    const overrideResponse = [
      "You: Sorry, I can't let you in without you using the reader.",
      "NPC: Yeah, I know.",
      "NPC: (puts the parcel down, taps their fob)",
      "NPC: (goes in, annoyed)",
    ];
    const postFeedback = this._composeVerdict(
      enc.type,
      "REFUSE",
      "You enforced the process. It caused friction, but kept security intact."
    );

    return {
      type: "final",
      response: overrideResponse,
      feedback: postFeedback,
      postFeedback,
      npcDirection: "in",
    };
  }

  _handleFinal(enc, resolvedKey, store) {
    const outcome = this._getOutcome(enc.type, resolvedKey);
    this._applyDeltas(store, outcome.pressureDelta, outcome.riskDelta, enc, resolvedKey);

    if (outcome.fail) {
      store.setFail("An unauthorised person gained access.");
      return {
        type: "fail",
        response: outcome.response,
        feedback: outcome.feedback,
        postFeedback: outcome.feedback,
        npcDirection: "in",
      };
    }

    const entersBuilding =
      resolvedKey === "LET_IN" ||
      resolvedKey === "HOLD_DOOR" ||
      (enc.npcHasFob && (resolvedKey === "WAIT_SILENT" || resolvedKey === "REDIRECT_FOB"));

    const postFeedback = this._composeVerdict(enc.type, resolvedKey, outcome.feedback);

    return {
      type: "final",
      response: outcome.response,
      feedback: outcome.feedback,
      postFeedback,
      npcDirection: entersBuilding ? "in" : "out",
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  _getOutcome(type, resolvedKey) {
    return (
      OUTCOMES[type]?.[resolvedKey] ?? {
        pressureDelta: 0,
        riskDelta: resolvedKey === "LET_IN" || resolvedKey === "HOLD_DOOR" ? 5 : 0,
        response: "",
        feedback: "You kept to safer behaviour.",
      }
    );
  }

  _applyDeltas(store, pressureDelta, riskDelta, enc, label) {
    const pressureBonus = store.socialPressure >= 60 ? 2 : 0;
    store.applyDeltas({
      pressureDelta: pressureDelta + (pressureDelta > 0 ? pressureBonus : 0),
      riskDelta,
      incident: {
        encounter: store.encounterIndex,
        type: "choice",
        message: `${label}`,
      },
    });
  }

  _composeVerdict(type, resolvedKey, outcomeFeedback) {
    const verdict =
      VERDICTS[type]?.[resolvedKey] ??
      (resolvedKey === "LET_IN" || resolvedKey === "HOLD_DOOR"
        ? { ok: false, text: "Not ideal. You bypassed access controls." }
        : { ok: true, text: "Mostly right. You kept to safer behaviour." });

    const header = verdict.ok ? "Right choice." : "Wrong choice.";
    const parts = [];
    if (outcomeFeedback) parts.push(outcomeFeedback);
    parts.push(`${header} ${verdict.text}`);
    return parts.join("\n\n");
  }
}