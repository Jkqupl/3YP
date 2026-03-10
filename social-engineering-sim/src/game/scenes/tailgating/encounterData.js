/**
 * encounterData.js
 *
 * Pure data describing every tailgating encounter and the outcomes for each
 * possible action. No Phaser or store imports — this file is plain JS so it
 * can be unit-tested, imported by React components for previews, or extended
 * without touching any scene code.
 *
 * Shape of an encounter:
 * {
 *   key          : string          — unique identifier
 *   title        : string          — shown in the HUD
 *   subtitle     : string          — the NPC's opening line
 *   type         : string          — used as the key into OUTCOMES
 *   addsPressure : boolean         — whether the NPC walking up increases pressure
 *   npcHasFob    : boolean         — whether the NPC can authenticate on request
 * }
 *
 * Shape of an outcome (OUTCOMES[type][actionKey]):
 * {
 *   pressureDelta : number
 *   riskDelta     : number
 *   response      : string | string[]   — dialogue lines to display
 *   feedback      : string              — educational note
 *   fail?         : boolean             — ends in a breach if true
 *   terminal?     : boolean             — ends the encounter immediately (no followup)
 * }
 */

export const ENCOUNTERS = [
  {
    key: "neighbour",
    title: "Encounter 1: Neighbour",
    subtitle: '"Hey, can you let me in? I forgot my fob."',
    type: "decision_neighbour",
    addsPressure: false,
    npcHasFob: false,
  },
  {
    key: "parcel",
    title: "Encounter 2: Resident with parcel",
    subtitle: '"Can you hold the door? My hands are full."',
    type: "decision_parcel",
    addsPressure: true,
    npcHasFob: true,
  },
  {
    key: "ambiguous",
    title: "Encounter 3: Ambiguous Person",
    subtitle: '"I live here."',
    type: "decision_ambiguous",
    addsPressure: true,
    npcHasFob: false,
  },
  {
    key: "clear_attacker",
    title: "Encounter 4: Clear Stranger",
    subtitle: '"I\'m late, forgot my fob. Just let me in."',
    type: "decision_attacker_clear",
    addsPressure: true,
    npcHasFob: false,
  },
  {
    key: "advanced_attacker",
    title: "Encounter 5: Man in a suit",
    subtitle:
      "Morning! I've got my keys but I left the fob upstairs. Could you let me in if that's alright?",
    type: "decision_attacker_advanced",
    addsPressure: true,
    npcHasFob: false,
  },
];

/**
 * Base pressure rates by encounter type.
 * Used by EncounterController when starting the pressure timer.
 */
export const PRESSURE_RATES = {
  decision_attacker_clear: 5,
  decision_attacker_advanced: 3,
  default: 2,
};

/**
 * All action outcomes keyed by [encounterType][actionKey].
 * pressureDelta and riskDelta are base values; the EncounterController
 * applies a bonus when socialPressure is already high.
 */
export const OUTCOMES = {
  decision_neighbour: {
    REFUSE: {
      pressureDelta: 4,
      riskDelta: 0,
      response: "You: I can't let you in if you don't have your keys sorry.",
      feedback:
        "Consistency matters. Being polite while enforcing the process keeps risk low.",
    },
    HOLD_DOOR: {
      pressureDelta: 0,
      riskDelta: 5,
      response: "You: Go on.\nNPC: Thanks.",
      feedback:
        "Even for neighbours, bypassing access controls increases long-term risk.",
    },
    REDIRECT_FOB: {
      pressureDelta: 3,
      riskDelta: 0,
      response:
        "You: Could you tap your fob?\nNPC: I forgot it ... but I'll just buzz my partner.",
      feedback: "Redirecting to the key fob keeps the building secure.",
    },
    USE_INTERCOM: {
      pressureDelta: -6,
      riskDelta: -2,
      response: [
        "You: I'll buzz your flat, which number?",
        "Intercom: Flat 4.",
        "Intercom: Verified.",
        "NPC: Told you I live here!",
      ],
      feedback: "Verification reduces risk without escalating the situation.",
      terminal: true,
    },
    ASK_QUESTION: {
      pressureDelta: -3,
      riskDelta: 0,
      response:
        "You: Which floor do you live on?\nNPC: Floor 2, we're literally neighbours!",
      feedback: "Simple questions buy time and surface inconsistencies.",
    },
  },

  decision_parcel: {
    REFUSE: {
      pressureDelta: 5,
      riskDelta: 0,
      response: "You: No, use your own keys!",
      feedback: "You can be helpful without bypassing security controls.",
    },
    HOLD_DOOR: {
      pressureDelta: 0,
      riskDelta: 5,
      response:
        "You: Go on.\nNPC: Thanks.\nNPC: (enters while you hold the door)",
      feedback: "Common excuse. Encourage them to authenticate instead.",
    },
    REDIRECT_FOB: {
      pressureDelta: 4,
      riskDelta: 0,
      response: [
        "You: I'd prefer you tap your fob?",
        "NPC: Fine! One sec.",
        "NPC: (shifts parcel and taps fob)",
      ],
      feedback: "Waiting and redirecting keeps risk low.",
    },
    WAIT_SILENT: {
      pressureDelta: 8,
      riskDelta: 0,
      response: [
        "You: (waits)",
        "NPC: ...",
        "NPC: Fine.",
        "NPC: (Puts down parcel and uses the reader)",
      ],
      feedback: "Waiting gives people space to authenticate themselves.",
    },
    ASK_QUESTION: {
      pressureDelta: -2,
      riskDelta: 0,
      response: [
        "You: Why don't you use your fob?",
        "NPC: ...",
        "NPC: Can't you see my hands are full?",
      ],
      feedback: "Clear, calm prompts reduce both pressure and risk.",
    },
  },

  decision_ambiguous: {
    REFUSE: {
      pressureDelta: 6,
      riskDelta: -2,
      response:
        "You: Sorry, I can't let you in.\nYou: Please use the intercom or speak to security.",
      feedback: "When identity is unclear, refusing is the safest option.",
    },
    HOLD_DOOR: {
      pressureDelta: 0,
      riskDelta: 10,
      response:
        "You: Go on.\nNPC: Cheers.\nNPC: (enters without showing a fob)",
      feedback:
        "Letting someone in without authentication increases risk significantly.",
    },
    REDIRECT_FOB: {
      pressureDelta: 6,
      riskDelta: 0,
      response: "You: Please tap your fob.\nNPC: I left it upstairs.",
      feedback: "No fob is a warning sign. Use intercom or refuse.",
    },
    USE_INTERCOM: {
      pressureDelta: 4,
      riskDelta: 0,
      response: [
        "You: I'll buzz the flat.",
        "Intercom: No answer.",
        "NPC: Seriously?",
        "NPC: Just let me in.",
      ],
      feedback: "Verification protects you when someone cannot authenticate.",
    },
    ASK_QUESTION: {
      pressureDelta: 2,
      riskDelta: 0,
      response:
        "You: Which flat are you visiting?\nNPC: Uh, second floor.",
      feedback:
        "Inconsistency is a signal. Do not compensate by holding the door.",
    },
    WAIT_SILENT: {
      pressureDelta: 10,
      riskDelta: 0,
      response: [
        "You: (waits)",
        "NPC: ...",
        "NPC: (lingers)",
        "NPC: (walks away)",
      ],
      feedback: "Waiting can increase pressure. Use a clear process instead.",
    },
  },

  decision_attacker_clear: {
    LET_IN: {
      pressureDelta: 0,
      riskDelta: 0,
      response: "NPC: I'm late. Just let me in.\nYou: Okay.\nNPC: (rushes in)",
      feedback: "Urgency is commonly used to force mistakes.",
      fail: true,
      terminal: true,
    },
    REFUSE: {
      pressureDelta: -6,
      riskDelta: 0,
      response:
        "You: Sorry, no tailgating.\nYou: Use the intercom or your fob.",
      feedback: "Refusing under pressure keeps everyone safe.",
      terminal: true,
    },
    USE_INTERCOM: {
      pressureDelta: 2,
      riskDelta: 0,
      response: [
        "You: I'll buzz the flat.",
        "Intercom: No answer.",
        "NPC: Forget it.",
        "NPC: (leaves angrily)",
      ],
      feedback: "Verification is safer than relying on someone's story.",
      terminal: true,
    },
  },

  decision_attacker_advanced: {
    LET_IN: {
      pressureDelta: 0,
      riskDelta: 0,
      response: "You let them in. They enter calmly as if they belong.",
      feedback:
        "Skilled tailgaters rely on you normalising their access. Authentication is the only proof.",
      fail: true,
      terminal: true,
    },
    REFUSE: {
      pressureDelta: 4,
      riskDelta: -3,
      response:
        "You refuse and stay firm, directing them to the intercom or security procedure.",
      feedback:
        "Calm firmness blocks social engineering, even when the story sounds plausible.",
    },
    HOLD_DOOR: {
      pressureDelta: 0,
      riskDelta: 0,
      response: "They enter calmly as if they belong.",
      feedback:
        "Advanced tailgaters mimic normal behaviour to avoid suspicion.",
      fail: true,
      terminal: true,
    },
    ASK_QUESTION: {
      pressureDelta: 4,
      riskDelta: 0,
      response: '"What floor are you on?" Floor 3, they answer smoothly.',
      feedback: "Confidence is not proof. Require authentication.",
    },
    REDIRECT_FOB: {
      pressureDelta: 5,
      riskDelta: 0,
      response: '"Oh, I forgot it."',
      feedback:
        "Consistent rules stop manipulation, even when they seem legitimate.",
    },
    USE_INTERCOM: {
      pressureDelta: -4,
      riskDelta: 0,
      response: ["Intercom verification fails.", "(They back off)"],
      feedback:
        "Process beats persuasion. This prevents repeat attempts.",
      terminal: true,
    },
  },
};

/**
 * Verdict lookup: given an encounter type and the resolved action key,
 * return { ok: boolean, text: string } for post-encounter feedback.
 */
export const VERDICTS = {
  decision_attacker_clear: {
    LET_IN: {
      ok: false,
      text: "Not ideal. Letting them in under urgency is exactly what tailgaters rely on.",
    },
    HOLD_DOOR: {
      ok: false,
      text: "Not ideal. Letting them in under urgency is exactly what tailgaters rely on.",
    },
    REFUSE: {
      ok: true,
      text: "Correct. You stuck to a verification process and did not bypass access controls.",
    },
    USE_INTERCOM: {
      ok: true,
      text: "Correct. You stuck to a verification process and did not bypass access controls.",
    },
  },
  decision_attacker_advanced: {
    LET_IN: {
      ok: false,
      text: "Not ideal. Plausible stories are not proof. Authentication is the proof.",
    },
    HOLD_DOOR: {
      ok: false,
      text: "Not ideal. Plausible stories are not proof. Authentication is the proof.",
    },
    REFUSE: {
      ok: true,
      text: "Correct. You required authentication rather than trusting confidence or appearance.",
    },
    USE_INTERCOM: {
      ok: true,
      text: "Correct. You required authentication rather than trusting confidence or appearance.",
    },
    REDIRECT_FOB: {
      ok: true,
      text: "Correct. You required authentication rather than trusting confidence or appearance.",
    },
    ASK_QUESTION: {
      ok: true,
      text: "Mostly right. Questions can buy time, but you still need authentication.",
    },
  },
  decision_neighbour: {
    HOLD_DOOR: {
      ok: false,
      text: "Not ideal. Even familiar faces should not bypass access controls.",
    },
    LET_IN: {
      ok: false,
      text: "Not ideal. Even familiar faces should not bypass access controls.",
    },
    USE_INTERCOM: {
      ok: true,
      text: "Correct. You verified or redirected to authentication.",
    },
    REDIRECT_FOB: {
      ok: true,
      text: "Correct. You verified or redirected to authentication.",
    },
    ASK_QUESTION: {
      ok: true,
      text: "Mostly right. You did not bypass security and kept the interaction controlled.",
    },
    REFUSE: {
      ok: true,
      text: "Mostly right. You did not bypass security and kept the interaction controlled.",
    },
  },
  decision_parcel: {
    HOLD_DOOR: {
      ok: false,
      text: "Not ideal. 'Hands full' is a common excuse to prompt a bypass.",
    },
    LET_IN: {
      ok: false,
      text: "Not ideal. 'Hands full' is a common excuse to prompt a bypass.",
    },
    REDIRECT_FOB: {
      ok: true,
      text: "Correct. You forced authentication rather than holding the door.",
    },
    WAIT_SILENT: {
      ok: true,
      text: "Correct. You forced authentication rather than holding the door.",
    },
    ASK_QUESTION: {
      ok: true,
      text: "Mostly right. You kept security intact (even if it felt awkward).",
    },
    REFUSE: {
      ok: true,
      text: "Mostly right. You kept security intact (even if it felt awkward).",
    },
  },
  decision_ambiguous: {
    HOLD_DOOR: {
      ok: false,
      text: "Not ideal. With unclear identity, you should not allow entry without authentication.",
    },
    LET_IN: {
      ok: false,
      text: "Not ideal. With unclear identity, you should not allow entry without authentication.",
    },
    REFUSE: {
      ok: true,
      text: "Correct. You relied on a process rather than a story.",
    },
    USE_INTERCOM: {
      ok: true,
      text: "Correct. You relied on a process rather than a story.",
    },
    REDIRECT_FOB: {
      ok: true,
      text: "Correct. You relied on a process rather than a story.",
    },
    WAIT_SILENT: {
      ok: true,
      text: "Mostly right. You did not grant access, but verification is stronger than waiting.",
    },
    ASK_QUESTION: {
      ok: true,
      text: "Mostly right. You did not grant access, but verification is stronger than waiting.",
    },
  },
};

/**
 * Initial choice sets per encounter type.
 * These are the options shown to the player at the start of each encounter.
 */
export const INITIAL_CHOICES = {
  decision_neighbour: [
    { label: "Ask a brief question", actionKey: "ASK_QUESTION" },
    { label: "Use intercom", actionKey: "USE_INTERCOM" },
    { label: "Point to key fob reader", actionKey: "REDIRECT_FOB" },
    { label: "Hold door open", actionKey: "HOLD_DOOR" },
  ],
  decision_parcel: [
    { label: "Ask a brief question", actionKey: "ASK_QUESTION" },
    { label: "Point to key fob reader", actionKey: "REDIRECT_FOB" },
    { label: "Wait silently", actionKey: "WAIT_SILENT" },
    { label: "Hold door open", actionKey: "HOLD_DOOR" },
  ],
  decision_ambiguous: [
    { label: "Ask a question", actionKey: "ASK_QUESTION" },
    { label: "Use intercom", actionKey: "USE_INTERCOM" },
    { label: "Wait and observe", actionKey: "WAIT_SILENT" },
    { label: "Redirect to key fob", actionKey: "REDIRECT_FOB" },
    { label: "Hold door open", actionKey: "HOLD_DOOR" },
  ],
  decision_attacker_clear: [
    { label: "Use intercom", actionKey: "USE_INTERCOM" },
    { label: "Refuse and redirect to process", actionKey: "REFUSE" },
    { label: "Let them in quickly", actionKey: "LET_IN" },
  ],
  decision_attacker_advanced: [
    { label: "Ask a question", actionKey: "ASK_QUESTION" },
    { label: "Use intercom", actionKey: "USE_INTERCOM" },
    { label: "Redirect to key fob", actionKey: "REDIRECT_FOB" },
    { label: "Hold door open", actionKey: "HOLD_DOOR" },
  ],
};

/** Choices shown after an initial gather action (phase 2). */
export const FOLLOWUP_CHOICES = [
  { label: "Refuse entry", actionKey: "FINAL_REFUSE" },
  { label: "Let them in", actionKey: "FINAL_LET_IN" },
];

/** Map followup action keys back to their base equivalents. */
export const FOLLOWUP_KEY_MAP = {
  FINAL_LET_IN: "LET_IN",
  FINAL_REFUSE: "REFUSE",
  FINAL_REDIRECT_FOB: "REDIRECT_FOB",
  FINAL_USE_INTERCOM: "USE_INTERCOM",
};