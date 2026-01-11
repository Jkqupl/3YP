import Phaser from "phaser";
import { useTailgatingStore } from "../../../state/useTailgatingStore";

/*
Placeholder-only Tailgating scene

What it does:
- Shows a simple lobby layout (rectangles)
- Runs encounter loop (0..4)
- Simulates an NPC approaching and "pressure" rising over time
- Presents a choice menu (buttons) per encounter
- Calls into Zustand store for decisions and ending

Assets:
- None needed yet (all rectangles + text)
*/

const ENCOUNTERS = [
  {
    key: "neighbour",
    title: "Encounter 1: Neighbour",
    subtitle: "\"Hey, can you let me in? I forgot my fob.\"",
    type: "decision_neighbour",
  },
  {
    key: "parcel",
    title: "Encounter 2: Resident with parcel",
    subtitle: "\"Can you hold the door? My hands are full.\"",
    type: "decision_parcel",
  },
  {
    key: "ambiguous",
    title: "Encounter 3: Ambiguous NPC",
    subtitle: "\"I live here.\"",
    type: "decision_ambiguous",
  },
  {
    key: "clear_attacker",
    title: "Encounter 4: Clear attacker",
    subtitle: "\"I'm late, forgot my fob. Just let me in.\"",
    type: "decision_attacker_clear",
  },
  {
    key: "advanced_attacker",
    title: "Encounter 5: Advanced attacker",
    subtitle: "Calm, confident, subtle excuse.",
    type: "decision_attacker_advanced",
  },
];

export default class TailgatingScene extends Phaser.Scene {
  constructor() {
    super("TailgatingScene");

    this.ui = null;
    this.choiceButtons = [];
    this.pressureTimer = null;

    this.npc = null;
    this.player = null;

    this.zoneDoor = null;
    this.zoneQueue = null;

    this.endingObjects = [];
    this.restartKeyHandler = null;

    this.advanceTimer = null;
    this.txtFeedback = null;

    this.awaitingContinue = false;
    this.canContinueAt = 0;
    this.onContinueHandler = null;

    this.encounterPhase = "initial"; // "initial" | "followup"
    this.encounterCtx = null; // { asked: boolean, usedIntercom: boolean, info: {...} }

    this.dialogueQueue = [];
    this.dialogueIndex = 0;
    this.dialogueActive = false;

    this.dialogueTimer = null;
    this.dialogueAutoDelayMs = 2150; // tune

    this.lastDirection = "front";
  }

  create() {
    // Ensure store starts clean when the scene begins.
    useTailgatingStore.getState().resetGame();

    const { width, height } = this.scale;

    this.createWorld(width, height);
    this.createHUD(width, height);
    this.scale.on("resize", () => this.relayout());
    this.startEncounter();
    this.onContinueHandler = () => {
      const store = useTailgatingStore.getState();
      if (store.ending) return;

      // If dialogue is active, page it instead of advancing the encounter
      if (this.dialogueActive) {
        if (Date.now() < this.canContinueAt) return;

        // This already handles: incrementing index, clearing timers, finishing state
        this.advanceDialoguePage();
        return;
      }

      // Normal continue flow
      if (!this.awaitingContinue) return;
      if (Date.now() < this.canContinueAt) return;

      this.awaitingContinue = false;
      this.advanceEncounter();
    };

    this.input.on("pointerdown", this.onContinueHandler);

    this.input.keyboard.on("keydown-SPACE", this.onContinueHandler);
    this.input.keyboard.on("keydown-ENTER", this.onContinueHandler);

  }


  relayout() {
  const { width, height } = this.scale;

  // Resize HUD background
  // hudBg is local right now, so store it on this so we can update width
  // If you keep it local, skip this part.
  if (useTailgatingStore.getState().ending) return;

  if (this.hudBg) {
    this.hudBg.setPosition(width / 2, 34);
    this.hudBg.width = width;
  }

  // Dialogue panel positions
  const panelW = Math.min(640, width * 0.86);
  this.dialogPanel.setPosition(width / 2, height - 110);
  this.dialogPanel.width = panelW;

  this.txtDialogTitle.setPosition(width / 2 - panelW / 2 + 14, height - 160);
  this.txtDialogBody.setPosition(width / 2 - panelW / 2 + 14, height - 138);
  this.txtDialogBody.setWordWrapWidth(panelW - 28);

  this.txtFeedback.setPosition(width / 2 - panelW / 2 + 14, height - 94);
  this.txtFeedback.setWordWrapWidth(panelW - 28);

 // Meter labels and bars
  const barW = 200;
  const barLeftX = width - 270;
  const barCenterX = barLeftX + barW / 2;
  const labelGap = 12;

  this.pressureBarBg.setPosition(barCenterX, 20);
  this.pressureBarFill.setPosition(barLeftX, 20);

  this.riskBarBg.setPosition(barCenterX, 44);
  this.riskBarFill.setPosition(barLeftX, 44);

  const labelX = barLeftX - labelGap;
  this.txtPressure.setPosition(labelX, 12);
  this.txtRisk.setPosition(labelX, 36);


  // Re render choices for current encounter type
  const idx = useTailgatingStore.getState().encounterIndex;
  const encounter = ENCOUNTERS[idx];
  if (encounter && encounter.type !== "auto") {
    this.renderChoices(this.getChoicesForEncounter(encounter.type));
  }

  this.refreshMeters();
}

  /* -----------------------
     WORLD (placeholder)
  ----------------------- */
  createWorld(width, height) {
    // Floor background
    this.add.rectangle(width / 2, height / 2, width, height, 0x121a24);

    // Lobby area boundary
    const lobby = this.add.rectangle(width / 2, height / 2, width * 0.88, height * 0.78, 0x0f151e);
    lobby.setStrokeStyle(2, 0x223044);

    // Door zone (top center)
    const doorX = width / 2;
    const doorY = height * 0.18;
    const doorW = 110;
    const doorH = 34;

    const door = this.add.rectangle(doorX, doorY, doorW, doorH, 0x203042);
    door.setStrokeStyle(2, 0x3a587a);

    this.add.text(doorX, doorY - 22, "SECURE DOOR", {
      fontFamily: "system-ui, Arial",
      fontSize: "12px",
      color: "#cfe2ff",
    }).setOrigin(0.5);

    // Queue zone (where NPC pressure rises)
    const qX = width / 2;
    const qY = height * 0.33;
    const qW = 220;
    const qH = 80;

    const queue = this.add.rectangle(qX, qY, qW, qH, 0x162433);
    queue.setStrokeStyle(2, 0x2a3e56);

    this.add.text(qX, qY - 52, "QUEUE ZONE", {
      fontFamily: "system-ui, Arial",
      fontSize: "12px",
      color: "#9fb6cf",
    }).setOrigin(0.5);

    // Physics actors (placeholders)
    this.player = this.physics.add
      .sprite(width / 2, height * 0.55, null)
      .setSize(22, 22);
    this.player.setImmovable(true);

    const playerViz = this.add.rectangle(this.player.x, this.player.y, 22, 22, 0x4da3ff);
    this.player._viz = playerViz;

    this.npc = this.physics.add
      .sprite(width / 2, height * 0.75, null)
      .setSize(22, 22);
    this.npc.setImmovable(true);

    const npcViz = this.add.rectangle(this.npc.x, this.npc.y, 22, 22, 0xffb14d);
    this.npc._viz = npcViz;

    // Zones (not collisions yet, simple distance checks)
    this.zoneDoor = { x: doorX, y: doorY, w: doorW, h: doorH };
    this.zoneQueue = { x: qX, y: qY, w: qW, h: qH };
  }

  /* -----------------------
     HUD + UI (placeholder)
  ----------------------- */
  createHUD(width, height) {
    this.ui = this.add.container(0, 0);

    // Top HUD background
    this.hudBg = this.add.rectangle(width / 2, 34, width, 68, 0x0b0f14, 0.9);
    this.ui.add(this.hudBg);


    this.txtTitle = this.add.text(16, 10, "Tailgating Simulation", {
      fontFamily: "system-ui, Arial",
      fontSize: "14px",
      color: "#e6eefc",
    });

    this.txtEncounter = this.add.text(16, 30, "", {
      fontFamily: "system-ui, Arial",
      fontSize: "13px",
      color: "#c9d7ee",
    });

    
    this.ui.add(this.txtTitle);
    this.ui.add(this.txtEncounter);

    // Meter labels
    this.txtPressure = this.add.text(width - 310, 12, "Pressure", {
      fontFamily: "system-ui, Arial",
      fontSize: "12px",
      color: "#c9d7ee",
    });
    this.txtRisk = this.add.text(width - 310, 36, "Risk", {
      fontFamily: "system-ui, Arial",
      fontSize: "12px",
      color: "#c9d7ee",
    });
    this.txtPressure.setOrigin(1, 0);
    this.txtRisk.setOrigin(1, 0);


    this.ui.add(this.txtPressure);
    this.ui.add(this.txtRisk);

    // Meter bars (placeholder rectangles)
    this.pressureBarBg = this.add.rectangle(0, 0, 200, 10, 0x1d2a3a);
    this.pressureBarFill = this.add.rectangle(0, 0, 0, 10, 0xffc14d);
    this.pressureBarFill.setOrigin(0, 0.5);

    this.riskBarBg = this.add.rectangle(0, 0, 200, 10, 0x1d2a3a);
    this.riskBarFill = this.add.rectangle(0, 0, 0, 10, 0xff6b6b);
    this.riskBarFill.setOrigin(0, 0.5);

    this.ui.add(this.pressureBarBg);
    this.ui.add(this.pressureBarFill);
    this.ui.add(this.riskBarBg);
    this.ui.add(this.riskBarFill);

    // Meter labels and bars
    const barW = 200;
    const barLeftX = width - 270;          // where fill starts (origin 0)
    const barCenterX = barLeftX + barW / 2;
    const labelGap = 12;

    this.pressureBarBg.setPosition(barCenterX, 20);
    this.pressureBarFill.setPosition(barLeftX, 20);

    this.riskBarBg.setPosition(barCenterX, 44);
    this.riskBarFill.setPosition(barLeftX, 44);

    // labels sit to the left of the bar, right aligned
    const labelX = barLeftX - labelGap;
    this.txtPressure.setPosition(labelX, 12);
    this.txtRisk.setPosition(labelX, 36);

    // Dialogue panel
    const panelW = Math.min(640, width * 0.86);
    const panelH = 120;

    this.dialogPanel = this.add.rectangle(width / 2, height - 110, panelW, panelH, 0x0b0f14, 0.92);
    this.dialogPanel.setStrokeStyle(2, 0x223044);

    this.txtDialogTitle = this.add.text(width / 2 - panelW / 2 + 14, height - 160, "", {
      fontFamily: "system-ui, Arial",
      fontSize: "14px",
      color: "#e6eefc",
    });

    this.txtDialogBody = this.add.text(width / 2 - panelW / 2 + 14, height - 138, "", {
      fontFamily: "system-ui, Arial",
      fontSize: "13px",
      color: "#c9d7ee",
      wordWrap: { width: panelW - 28 },
    });
    this.txtFeedback = this.add.text(width / 2 - panelW / 2 + 14, height - 94, "", {
      fontFamily: "system-ui, Arial",
      fontSize: "12px",
      color: "#9fb6cf",
      wordWrap: { width: panelW - 28 },
    });

    this.ui.add(this.dialogPanel);
    this.ui.add(this.txtDialogTitle);
    this.ui.add(this.txtDialogBody);
    this.ui.add(this.txtFeedback);


    // Container for buttons
    this.choiceContainer = this.add.container(0, 0);
    this.ui.add(this.choiceContainer);

    this.refreshMeters();
  }

  /* -----------------------
     Encounter loop
  ----------------------- */
  startEncounter() {
    // Stop any previous pressure timer and clear UI.
    this.clearChoices();
    this.stopPressureTimer();

    const store = useTailgatingStore.getState();
    const idx = store.encounterIndex;
    const encounter = ENCOUNTERS[idx];

    this.txtEncounter.setText(`${idx + 1}/${store.totalEncounters}: ${encounter.key}`);
    this.txtDialogTitle.setText(encounter.title);
    this.txtDialogBody.setText(encounter.subtitle);
    this.txtFeedback.setText("");

    this.encounterPhase = "initial";
    this.encounterCtx = { asked: false, usedIntercom: false, info: null };



    // Reset NPC position for the encounter
    this.resetNPC();
  
    // Start pressure rising as NPC approaches and waits.
  
    this.startPressureTimer(encounter.type);
    


    // Present choices based on encounter type
    const choices = this.getChoicesForEncounter(encounter.type);
    this.renderChoices(choices);
  }


  /* -----------------------
     NPC placeholder movement + pressure
  ----------------------- */
  resetNPC() {
  const { width, height } = this.scale;
  const x = width / 2;
  const y = height * 0.75;

  // stop any exit tween still running
  this.tweens.killTweensOf(this.npc);
  this.tweens.killTweensOf(this.npc?._viz);

  // hard place both visuals
  this.npc.setPosition(x, y);
  if (this.npc?._viz) this.npc._viz.setPosition(x, y);

  // re enable physics and hard reset the body to the same coordinates
  if (this.npc.body) {
    this.npc.body.enable = true;
    this.npc.body.reset(x, y);      // critical: prevents snapping / teleporting
    this.npc.body.setVelocity(0, 0);
  }
}


  startPressureTimer(type) {
  // Base pressure rate differs by encounter.
  // Neighbour should move, but not add pressure.
  const addsPressure = type !== "decision_neighbour";
  const base = type.includes("attacker_clear") ? 5 : type.includes("attacker") ? 3 : 2;

  // Increase NPC speed
  this.npc.body.setVelocity(0, -120);

  this.pressureTimer = this.time.addEvent({
    delay: 300,
    loop: true,
    callback: () => {
      const store = useTailgatingStore.getState();
      if (store.ending) return;

      const inQueue = this.isInZone(this.npc.x, this.npc.y, this.zoneQueue);

      if (inQueue) {
        // Stop NPC when it reaches queue zone (simple clamp)
       if (this.npc.y <= this.zoneQueue.y) {
          this.npc.body.setVelocity(0, 0);
        }


        if (addsPressure) {
          store.applyDeltas({
            pressureDelta: base,
            riskDelta: 0,
            incident: {
              encounter: store.encounterIndex,
              type: "pressure",
              message: "NPC waiting behind you.",
            },
          });
          this.refreshMeters();
        }
      }
    },
  });
}

  stopPressureTimer() {
    if (this.pressureTimer) {
      this.pressureTimer.remove(false);
      this.pressureTimer = null;
    }
  }

  /* -----------------------
     Choices
  ----------------------- */
getChoicesForEncounter(type) {
  const { ending } = useTailgatingStore.getState();
  if (ending) return [];

  if (this.encounterPhase === "followup") {
    return this.getFollowupChoices(type);
  }
  return this.getInitialChoices(type);
}

getInitialChoices(type) {
  if (type === "decision_neighbour") {
    return [
      { label: "Ask a brief question", actionKey: "ASK_QUESTION" },
      { label: "Use intercom", actionKey: "USE_INTERCOM" },
      { label: "Point to key fob reader", actionKey: "REDIRECT_FOB" },
      { label: "Hold door open", actionKey: "HOLD_DOOR" },
    ];
  }

  if (type === "decision_parcel") {
    return [
      { label: "Ask a brief question", actionKey: "ASK_QUESTION" },
      { label: "Point to key fob reader", actionKey: "REDIRECT_FOB" },
      { label: "Wait silently", actionKey: "WAIT_SILENT" },
      { label: "Hold door open", actionKey: "HOLD_DOOR" },
    ];
  }

  if (type === "decision_ambiguous") {
    return [
      { label: "Ask a question", actionKey: "ASK_QUESTION" },
      { label: "Use intercom", actionKey: "USE_INTERCOM" },
      { label: "Wait and observe", actionKey: "WAIT_SILENT" },
      { label: "Redirect to key fob", actionKey: "REDIRECT_FOB" },
      { label: "Hold door open", actionKey: "HOLD_DOOR" },
    ];
  }

  if (type === "decision_attacker_clear") {
    return [
      { label: "Use intercom", actionKey: "USE_INTERCOM" },
      { label: "Refuse and redirect to process", actionKey: "REFUSE" },
      { label: "Let them in quickly", actionKey: "LET_IN" },
    ];
  }

  return [
    { label: "Ask a question", actionKey: "ASK_QUESTION" },
    { label: "Use intercom", actionKey: "USE_INTERCOM" },
    { label: "Redirect to key fob", actionKey: "REDIRECT_FOB" },
    { label: "Hold door open", actionKey: "HOLD_DOOR" },
  ];
}

getFollowupChoices(type) {
  // Always include the final decision pair
  if(type === "decision_attacker_clear") return [];
  const choices = [
    { label: "Refuse entry", actionKey: "FINAL_REFUSE" },
    { label: "Let them in", actionKey: "FINAL_LET_IN" },
  ];
  
  return choices;
}


  /* -----------------------
      outcomes for decisions
  ------------------------ */
  getOutcome(encounterType, actionKey) {
  const store = useTailgatingStore.getState();

  // Defaults
  let pressureDelta = 0;
  let riskDelta = 0;
  let response = "";
  let feedback = "";
  let fail = false;

  // Helper: pressure feels worse when already high
  const pressureBonus = store.socialPressure >= 60 ? 2 : 0;

if (encounterType === "decision_neighbour") {
  if (actionKey === "REFUSE") {
    response =
      "You: I can't let you in if you don't have your keys sorry.";
    feedback =
      "Consistency matters. Being polite while enforcing the process keeps risk low.";
    pressureDelta = 4 + pressureBonus;
  } else if (actionKey === "HOLD_DOOR") {
    riskDelta = 5;
    response =
      "You: Go on.\nNPC: Thanks.";
    feedback =
      "Even for neighbours, bypassing access controls increases long term risk.";
  } else if (actionKey === "REDIRECT_FOB") {
    pressureDelta = 3 + pressureBonus;
    response =
      "You: Could you tap your fob?\nNPC: I forgot it ... but I'll just buzz my partner.";
    feedback = "Redirecting to the key fob keeps the building secure.";
  } else if (actionKey === "USE_INTERCOM") {
    // Intercom is not a suggestion, it returns a result
    response = [
      "You: I'll buzz your flat, which number?.",
      "Intercom: Flat 4.",
      "Intercom: Verified.",
      "NPC: Told you I live here!"
    ];
    feedback =
      "Verification reduces risk without escalating the situation.";
    pressureDelta = -6;
    riskDelta = -2;
  } else if (actionKey === "ASK_QUESTION") {
    response =
      "You: Which foor do you live on?\nNPC: Floor 2, we're literally neighbours!";
    feedback = "Simple questions buy time and surface inconsistencies.";
    pressureDelta = -3;
  }
}


if (encounterType === "decision_parcel") {
  if (actionKey === "REFUSE") {
    response =
      "You: No , use your own keys!";
    feedback = "You can be helpful without bypassing security controls.";
    pressureDelta = 5 + pressureBonus;
  } else if (actionKey === "HOLD_DOOR") {
    riskDelta = 5;
    response =
      "You: Go on.\nNPC: Thanks.\nNPC: (enters while you hold the door)";
    feedback = "Common excuse. Encourage them to authenticate instead.";
  } else if (actionKey === "REDIRECT_FOB") {
    response = [
      "You: I'd prefer you tap your fob?",
      "NPC: Fine! One sec.",
      "NPC: (shifts parcel and taps fob)"
    ];
    feedback = "Waiting and redirecting keeps risk low.";
    pressureDelta = 4 + pressureBonus;
  } else if (actionKey === "WAIT_SILENT") {
    response = [
      "You: (waits) ",
      "NPC: ... ",
      "NPC: Fine.",
      "NPC: (Puts down parcel and uses the reader)"
    ];
    feedback = "Waiting gives people space to authenticate themselves.";
    pressureDelta = 8 + pressureBonus;
  } else if (actionKey === "ASK_QUESTION") {
    response = [
      "You: Why don't you use your fob?",
      "NPC: ...",
      "NPC: Can't you see my hands are full?.",
      
    ]
    feedback = "Clear, calm prompts reduce both pressure and risk.";
    pressureDelta = -2;
  }
}

if (encounterType === "decision_ambiguous") {
  if (actionKey === "REFUSE") {
    response =
      "You: Sorry, I can't let you in.\nYou: Please use the intercom or speak to security.";
    feedback = "When identity is unclear, refusing is the safest option.";
    pressureDelta = 6 + pressureBonus;
    riskDelta = -2;
  } else if (actionKey === "HOLD_DOOR") {
    riskDelta = 10;
    response =
      "You: Go on.\nNPC: Cheers.\nNPC: (enters without showing a fob)";
    feedback =
      "Letting someone in without authentication increases risk significantly.";
  } else if (actionKey === "REDIRECT_FOB") {
    response =
      "You: Please tap your fob.\nNPC: I left it upstairs.";
    feedback = "No fob is a warning sign. Use intercom or refuse.";
    pressureDelta = 6 + pressureBonus;
  } else if (actionKey === "USE_INTERCOM") {
    response = [
      "You: I'll buzz the flat.",
      "Intercom: No answer.",
      "NPC: Seriously?",
      "NPC: Just let me in."
    ];
    feedback = "Verification protects you when someone cannot authenticate.";
    pressureDelta = 4;
  } else if (actionKey === "ASK_QUESTION") {
    response =
      "You: Which flat are you visiting?\nNPC: Uh, second floor.";
    feedback =
      "Inconsistency is a signal. Do not compensate by holding the door.";
    pressureDelta = 2;
  } else if (actionKey === "WAIT_SILENT") {
    response = [
      "You: (waits)",
      "NPC: ...",
      "NPC: (lingers)",
      "NPC: (walks away)"
    ];
    feedback = "Waiting can increase pressure. Use a clear process instead.";
    pressureDelta = 10 + pressureBonus;
  }
}


if (encounterType === "decision_attacker_clear") {
  if (actionKey === "LET_IN") {
    fail = true;
    response =
      "NPC: I'm late. Just let me in.\nYou: Okay.\nNPC: (rushes in)";
    feedback = "Urgency is commonly used to force mistakes.";
  } else if (actionKey === "REFUSE") {
    response =
      "You: Sorry, no tailgating.\nYou: Use the intercom or your fob.";
    feedback = "Refusing under pressure keeps everyone safe.";
    pressureDelta = -6;
  } else if (actionKey === "USE_INTERCOM") {
    response = [
      "You: I'll buzz the flat.",
      "Intercom: No answer.",
      "NPC: Forget it.",
      "NPC: (leaves angrily)"
    ];
    feedback = "Verification is safer than relying on someone’s story.";
    pressureDelta = 2;
  }
}


if (encounterType === "decision_attacker_advanced") {
  if (actionKey === "LET_IN") {
    fail = true;
    response = "You let them in. They enter calmly as if they belong.";
    feedback = "Skilled tailgaters rely on you normalising their access. Authentication is the only proof.";
  } else if (actionKey === "REFUSE") {
    response = "You refuse and stay firm, directing them to the intercom or security procedure.";
    feedback = "Calm firmness blocks social engineering, even when the story sounds plausible.";
    pressureDelta = 4 + pressureBonus;
    riskDelta = -3;
  } else if (actionKey === "HOLD_DOOR") {
    fail = true;
    response = "They enter calmly as if they belong.";
    feedback = "Advanced tailgaters mimic normal behaviour to avoid suspicion.";
  } else if (actionKey === "ASK_QUESTION") {
    response = "\"What floor are you on?\" Floor 3, they answer smoothly.";
    feedback = "Confidence is not proof. Require authentication.";
    pressureDelta = 4 + pressureBonus;
  } else if (actionKey === "REDIRECT_FOB") {
    response = "\"Oh, I forgot it.\"";
    feedback = "Consistent rules stop manipulation, even when they seem legitimate.";
    pressureDelta = 5 + pressureBonus;
  } else if (actionKey === "USE_INTERCOM") {
    response = [
      "Intercom verification fails",
      "(They back off)"
    ];
    feedback = "Process beats persuasion. This prevents repeat attempts.";
    pressureDelta = -4;
  }
}


  return { pressureDelta, riskDelta, response, feedback, fail };
}


/* -----------------------
handle choice selection

----------------------- */

npcHasFobForEncounter(type) {
  // residents
  if (type === "decision_parcel") return true;
  if (type === "decision_neighbour") return false; // they forgot it in your script
  // ambiguous and attackers
  if (type === "decision_ambiguous") return false;
  if (type.includes("attacker")) return false;
  return false;
}

handleChoice(actionKey) {
  const idx = useTailgatingStore.getState().encounterIndex;
  const encounter = ENCOUNTERS[idx];
  const type = encounter.type;

  // Map followup choices to existing outcomes
  let resolvedKey = actionKey;
  if (actionKey === "FINAL_LET_IN") resolvedKey = "LET_IN";
  if (actionKey === "FINAL_REFUSE") resolvedKey = "REFUSE";
  if (actionKey === "FINAL_REDIRECT_FOB") resolvedKey = "REDIRECT_FOB";
  if (actionKey === "FINAL_USE_INTERCOM") resolvedKey = "USE_INTERCOM";

  const noFollowup = type === "decision_attacker_clear";

  // Phase 1 gather info

    // Special: REDIRECT_FOB is only a first wave choice and it resolves immediately
  if (this.encounterPhase === "initial" && resolvedKey === "REDIRECT_FOB") {
    this.stopPressureTimer();
    this.stopNPC();

    const hasFob = this.npcHasFobForEncounter(type);

    if (hasFob) {
      // They authenticate and enter
      const response = [
        "You: Please tap your fob.",
        "NPC: Yeah, one sec.",
        "NPC: (taps fob and the door unlocks)",
        "NPC: Thanks."
      ];

      useTailgatingStore.getState().applyDeltas({
        pressureDelta: 2,
        riskDelta: -1,
        incident: {
          encounter: idx,
          type: "choice",
          message: `REDIRECT_FOB success (p2, r-1)`,
        },
      });
      this.refreshMeters();

      this.showDialogue(response);

      // Move them into the building automatically
      this.moveNPCOut("in");

      // End encounter
      this.clearChoices();
      this.awaitingContinue = true;
      this.canContinueAt = Date.now() + 900;
      this.txtFeedback.setText("Good call. They authenticated.\n\nClick or press Enter to continue");
      return;
    }

    // No fob: now we go to followup decision (refuse vs let in)
    const response = [
      "You: Please tap your fob.",
      "NPC: I don't have it on me.",
      "NPC: Can you just let me in?"
    ];

    useTailgatingStore.getState().applyDeltas({
      pressureDelta: 6,
      riskDelta: 0,
      incident: {
        encounter: idx,
        type: "choice",
        message: `REDIRECT_FOB failed (p6, r0)`,
      },
    });
    this.refreshMeters();

    this.showDialogue(response);

    this.encounterPhase = "followup";
    this.encounterCtx = { ...this.encounterCtx, asked: true }; // optional marker

    // show only final decision choices
    this.renderChoices(this.getChoicesForEncounter(type));
    return;
  }

  const isGatherInfoAction = resolvedKey === "ASK_QUESTION" || resolvedKey === "USE_INTERCOM";
  if (this.encounterPhase === "initial" && isGatherInfoAction) {
    const outcome = this.getOutcome(type, resolvedKey);
    this.stopPressureTimer();
    this.stopNPC();


    useTailgatingStore.getState().applyDeltas({
      pressureDelta: outcome.pressureDelta,
      riskDelta: outcome.riskDelta,
      incident: {
        encounter: idx,
        type: "choice",
        message: `${resolvedKey} (p${outcome.pressureDelta}, r${outcome.riskDelta})`,
      },
    });
    this.refreshMeters();

    if (outcome.response) this.showDialogue(outcome.response);
    this.txtFeedback.setText(outcome.feedback || "");

    if (outcome.fail) {
      useTailgatingStore.getState().setFail("An unauthorised person gained access.");
      this.showEnding("fail");
      return;
    }

    const isAttacker = type.includes("attacker");

    // terminal if clear attacker (any gather action), OR advanced attacker intercom
    const terminalGather =
      noFollowup || (type === "decision_attacker_advanced" && resolvedKey === "USE_INTERCOM");

    if (terminalGather) {
      // attackers should leave after intercom
      this.clearChoices();

      this.endEncounterAfterDialogue({
        direction: "out",
        response: outcome.response,
        feedback: outcome.feedback,
        minReadMs: 1100,
      });

      return;
    }


    this.encounterPhase = "followup";
    this.renderChoices(this.getChoicesForEncounter(type));
    return;
  }


  // Phase 2 gather info (intercom only)
  const isFinalGather =
    this.encounterPhase === "followup" &&
    resolvedKey === "USE_INTERCOM" &&
    !this.encounterCtx?.usedIntercom;

  if (isFinalGather) {
    const outcome = this.getOutcome(type, resolvedKey);
    this.stopPressureTimer();
    this.stopNPC();


    useTailgatingStore.getState().applyDeltas({
      pressureDelta: outcome.pressureDelta,
      riskDelta: outcome.riskDelta,
      incident: {
        encounter: idx,
        type: "choice",
        message: `${resolvedKey} (p${outcome.pressureDelta}, r${outcome.riskDelta})`,
      },
    });
    this.refreshMeters();

    if (outcome.response) this.showDialogue(outcome.response);
    this.txtFeedback.setText(outcome.feedback || "");

    this.encounterCtx.usedIntercom = true;

    // Optional: keep pressure going
    // this.startPressureTimer(type);

    this.renderChoices(this.getChoicesForEncounter(type));
    return;
  }

  // Final action (ends encounter)
  const outcome = this.getOutcome(type, resolvedKey);
  this.stopPressureTimer();
  this.stopNPC();

  const entersBuilding =
  resolvedKey === "LET_IN" ||
  resolvedKey === "HOLD_DOOR";

  // For REFUSE or USE_INTERCOM final outcomes, they leave
  this.moveNPCOut(entersBuilding ? "in" : "out");




  if (outcome.fail) {
    useTailgatingStore.getState().setFail("An unauthorised person gained access.");
    this.refreshMeters();
    this.txtFeedback.setText(outcome.feedback || "");
     this.showDialogue(outcome.response || "");
    this.showEnding("fail");
    return;
  }

  useTailgatingStore.getState().applyDeltas({
    pressureDelta: outcome.pressureDelta,
    riskDelta: outcome.riskDelta,
    incident: {
      encounter: idx,
      type: "choice",
      message: `${resolvedKey} (p${outcome.pressureDelta}, r${outcome.riskDelta})`,
    },
  });

  this.refreshMeters();

  if (outcome.response) this.showDialogue(outcome.response);
  this.txtFeedback.setText(outcome.feedback || "");

  this.clearChoices();

  this.endEncounterAfterDialogue({
    direction: entersBuilding ? "in" : "out",
    response: outcome.response,
    feedback: outcome.feedback,
    minReadMs: 1100,
  });

  return;

}



 renderChoices(choices) {
  this.clearChoices();

  const { width, height } = this.scale;

  // Define a left sidebar region
  const sidebarX = 40;
  const sidebarW = Math.min(360, Math.floor(width * 0.32)); // cap width so it stays a lane
  const gapY = 10;

  // Vertical lane: below HUD, above dialogue panel
  const topSafeY = 90;

  const panelH = 120;
  const dialogCenterY = height - 110;
  const dialogTopY = dialogCenterY - panelH / 2;

  const laneBottomY = dialogTopY - 16; // small breathing room above dialog
  const laneH = Math.max(80, laneBottomY - topSafeY);

  // 1 column by default for sidebar
  // if you want 2 columns inside the sidebar, set cols=2 when sidebarW is big enough
  const cols = sidebarW >= 320 && choices.length >= 4 ? 2 : 1;
  const gapX = 12;
  const btnW = cols === 2 ? Math.floor((sidebarW - gapX) / 2) : sidebarW;

  // Button sizing, shrink if needed
  let btnH = 34;
  const rows = Math.ceil(choices.length / cols);
  const neededH = rows * btnH + (rows - 1) * gapY;

  if (neededH > laneH) btnH = 30;

  const gridH = rows * btnH + (rows - 1) * gapY;

  // Anchor to bottom of the lane so it never climbs into the world
  const startY = Math.max(topSafeY, laneBottomY - gridH);
  const startX = sidebarX;

  choices.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = startX + col * (btnW + gapX);
    const y = startY + row * (btnH + gapY);

    const btn = this.add.rectangle(x, y, btnW, btnH, 0x223044, 0.95);
    btn.setOrigin(0, 0);
    btn.setStrokeStyle(2, 0x355170);
    btn.setInteractive({ useHandCursor: true });

    const txt = this.add.text(x + 10, y + 8, c.label, {
      fontFamily: "system-ui, Arial",
      fontSize: "13px",
      color: "#e6eefc",
      wordWrap: { width: btnW - 20 },
    });

    btn.on("pointerover", () => btn.setFillStyle(0x2a3e56, 1));
    btn.on("pointerout", () => btn.setFillStyle(0x223044, 0.95));
    btn.on("pointerdown", () => {
      this.handleChoice(c.actionKey);
    });


    this.choiceContainer.add(btn);
    this.choiceContainer.add(txt);
    this.choiceButtons.push(btn, txt);
  });
}


  clearChoices() {
    this.choiceButtons.forEach((obj) => obj.destroy());
    this.choiceButtons = [];
    this.choiceContainer.removeAll(true);
  }

  /* -----------------------
     Ending screen (placeholder)
  ----------------------- */
  showEnding(ending) {
  this.stopPressureTimer();
  this.clearChoices();

  // Defensive: clear any previous ending overlay if it exists
  this.clearEndingOverlay();

  useTailgatingStore.getState().evaluateEnding();
  const state = useTailgatingStore.getState();

  const { width, height } = this.scale;

  const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65);

  const panelW = Math.min(560, width * 0.86);
  const panelH = 260;

  const panel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0x0b0f14, 0.95);
  panel.setStrokeStyle(2, 0x223044);

  const title =
    ending === "perfect"
      ? "Perfect Ending"
      : ending === "good"
      ? "Good Ending"
      : "Fail Ending";

  const body =
    ending === "perfect"
      ? "You handled each encounter safely and kept overall risk low."
      : ending === "good"
      ? "No breach occurred, but repeated small concessions increased risk over time."
      : "An unauthorised person gained access. Tailgating can lead to theft and safety risks.";

  const stats = `Risk: ${state.securityRisk}/100   Pressure: ${state.socialPressure}/100`;

  const tTitle = this.add.text(width / 2, height / 2 - 90, title, {
    fontFamily: "system-ui, Arial",
    fontSize: "20px",
    color: "#e6eefc",
  }).setOrigin(0.5);

  const tBody = this.add.text(width / 2, height / 2 - 45, body, {
    fontFamily: "system-ui, Arial",
    fontSize: "14px",
    color: "#c9d7ee",
    wordWrap: { width: panelW - 40 },
    align: "center",
  }).setOrigin(0.5);

  const tStats = this.add.text(width / 2, height / 2 + 20, stats, {
    fontFamily: "system-ui, Arial",
    fontSize: "13px",
    color: "#9fb6cf",
  }).setOrigin(0.5);

  const tHint = this.add.text(width / 2, height / 2 + 75, "Press R to restart", {
    fontFamily: "system-ui, Arial",
    fontSize: "13px",
    color: "#e6eefc",
  }).setOrigin(0.5);

  // Track all ending objects so we can cleanly destroy them later
  this.endingObjects = [overlay, panel, tTitle, tBody, tStats, tHint];

  // Remove old handler if present
  if (this.restartKeyHandler) {
    this.input.keyboard.off("keydown-R", this.restartKeyHandler);
    this.restartKeyHandler = null;
  }

  this.restartKeyHandler = () => {
    this.clearEndingOverlay();
    useTailgatingStore.getState().resetGame();
    this.refreshMeters();
    this.startEncounter();
  };

  this.input.keyboard.on("keydown-R", this.restartKeyHandler);
}


  /* -----------------------
     Meters render
  ----------------------- */
  refreshMeters() {
    const { socialPressure, securityRisk } = useTailgatingStore.getState();

    const maxW = 200;

    const pW = Math.round((Phaser.Math.Clamp(socialPressure, 0, 100) / 100) * maxW);
    const rW = Math.round((Phaser.Math.Clamp(securityRisk, 0, 100) / 100) * maxW);

    this.pressureBarFill.width = pW;
    this.riskBarFill.width = rW;
  }

  /* -----------------------
     Helpers
  ----------------------- */
  isInZone(x, y, z) {
    const left = z.x - z.w / 2;
    const right = z.x + z.w / 2;
    const top = z.y - z.h / 2;
    const bottom = z.y + z.h / 2;
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  syncViz() {
    if (this.player?._viz) this.player._viz.setPosition(this.player.x, this.player.y);
    if (this.npc?._viz) this.npc._viz.setPosition(this.npc.x, this.npc.y);
  }

  clearEndingOverlay() {
  if (this.restartKeyHandler) {
    this.input.keyboard.off("keydown-R", this.restartKeyHandler);
    this.restartKeyHandler = null;
  }

  if (this.endingObjects && this.endingObjects.length > 0) {
    this.endingObjects.forEach((o) => {
      if (o && !o.destroyed) o.destroy();
    });
  }
  this.endingObjects = [];
}

advanceEncounter() {
  this.txtFeedback.setText("");

  const store = useTailgatingStore.getState();
  const next = store.encounterIndex + 1;

  if (next >= store.totalEncounters) {
    store.evaluateEnding();
    this.showEnding(store.ending || "good");
    return;
  }

  store.setEncounterIndex(next);
  this.startEncounter();
}

showDialogue(response) {
    this.clearDialogueTimer();

  // Simple string, just show it
  if (!Array.isArray(response)) {
    this.txtDialogBody.setText(response);
    return;
  }

  this.dialogueQueue = response;
  this.dialogueIndex = 0;

  // If it fits in one page, do not enter paging mode
  if (response.length <= 3) {
    this.dialogueActive = false;
    this.txtDialogBody.setText(response.join("\n"));
    return;
  }


  // Otherwise page it
  this.dialogueActive = true;
  this.renderDialoguePage();
}


renderDialoguePage() {
  this.clearDialogueTimer();

  const page = this.dialogueQueue
    .slice(this.dialogueIndex, this.dialogueIndex + 3)
    .join("\n");

  this.txtDialogBody.setText(page);

  // Subtle hint, but it will still auto-advance
  this.txtFeedback.setText("Click or Enter to skip");

  this.awaitingContinue = true;
  this.canContinueAt = Date.now() + 150;

  // Auto advance to next page
  this.dialogueTimer = this.time.addEvent({
    delay: this.dialogueAutoDelayMs,
    callback: () => {
      if (!this.dialogueActive) return;
      this.advanceDialoguePage();
    },
  });
}

advanceDialoguePage() {
  if (!this.dialogueActive) return;

  this.dialogueIndex += 3;

  // Finished all pages
  if (this.dialogueIndex >= this.dialogueQueue.length) {
    this.dialogueActive = false;
    this.clearDialogueTimer();

    // allow click/enter to advance the encounter after the last page
    this.awaitingContinue = true;
    this.canContinueAt = Date.now() + 150;

    // only set a generic prompt if something else has not already set feedback
    if (!this.txtFeedback.text || this.txtFeedback.text === "Click or Enter to skip") {
      this.txtFeedback.setText("Click or press Enter to continue");
    }
    return;
  }


  this.renderDialoguePage();
}


clearDialogueTimer() {
  if (this.dialogueTimer) {
    this.dialogueTimer.remove(false);
    this.dialogueTimer = null;
  }
}

stopNPC() {
  if (!this.npc?.body) return;
  this.npc.body.setVelocity(0, 0);
}

moveNPCOut(direction, onDone) {
  if (!this.npc || !this.npc._viz) {
    if (onDone) onDone();
    return;
  }

  this.stopNPC();

  // Kill tweens on both objects just in case
  this.tweens.killTweensOf(this.npc);
  this.tweens.killTweensOf(this.npc._viz);

  // Disable physics while tweening so Arcade does not fight us
  if (this.npc.body) {
    this.npc.body.setVelocity(0, 0);
    this.npc.body.enable = false;
  }

  const { width, height } = this.scale;

  const targetY = direction === "in" ? -60 : height + 80;
  const drift = Phaser.Math.Between(-20, 20);
  const targetX = Phaser.Math.Clamp(this.npc._viz.x + drift, 40, width - 40);

  this.tweens.add({
    targets: this.npc._viz,
    x: targetX,
    y: targetY,
    duration: 1200,
    ease: "Sine.easeInOut",
    onUpdate: () => {
      this.npc.setPosition(this.npc._viz.x, this.npc._viz.y);
      if (this.npc.body) this.npc.body.reset(this.npc.x, this.npc.y);
    },
    onComplete: () => {
      this.npc.setPosition(this.npc._viz.x, this.npc._viz.y);
      if (this.npc.body) this.npc.body.reset(this.npc.x, this.npc.y);
      if (onDone) onDone();
    },
  });
}

endEncounterAfterDialogue({
  direction,          // "in" | "out"
  response,           // string or array
  feedback,           // string
  minReadMs = 900,    // how long before continue works
}) {
  // show the text
  if (response) this.showDialogue(response);
  this.txtFeedback.setText(feedback || "");

  // block advancing for a bit
  this.awaitingContinue = false;
  this.canContinueAt = Date.now() + minReadMs;

  // animate npc out, then enable continue
  this.moveNPCOut(direction, () => {
    this.awaitingContinue = true;
    // still respect minReadMs if user is spam clicking
    if (Date.now() < this.canContinueAt) {
      // do nothing, handler already checks canContinueAt
    }
    this.txtFeedback.setText((feedback || "") + "\n\nClick or press Enter to continue");
  });
}

  update() {
    this.syncViz();
  }
}
