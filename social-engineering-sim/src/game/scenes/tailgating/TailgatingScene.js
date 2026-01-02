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
    key: "legit_baseline",
    title: "Encounter 1: Legitimate resident",
    subtitle: "They use their own key fob. No decision needed.",
    type: "auto",
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

    this.lastDirection = "front";
  }

  create() {
    // Ensure store starts clean when the scene begins.
    useTailgatingStore.getState().resetGame();

    const { width, height } = this.scale;

    this.createWorld(width, height);
    this.createHUD(width, height);

    this.startEncounter();
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
    const hudBg = this.add.rectangle(width / 2, 34, width, 68, 0x0b0f14, 0.9);
    this.ui.add(hudBg);

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

    this.ui.add(this.txtPressure);
    this.ui.add(this.txtRisk);

    // Meter bars (placeholder rectangles)
    this.pressureBarBg = this.add.rectangle(width - 170, 20, 200, 10, 0x1d2a3a);
    this.pressureBarFill = this.add.rectangle(width - 270, 20, 0, 10, 0xffc14d);
    this.pressureBarFill.setOrigin(0, 0.5);

    this.riskBarBg = this.add.rectangle(width - 170, 44, 200, 10, 0x1d2a3a);
    this.riskBarFill = this.add.rectangle(width - 270, 44, 0, 10, 0xff6b6b);
    this.riskBarFill.setOrigin(0, 0.5);

    this.ui.add(this.pressureBarBg);
    this.ui.add(this.pressureBarFill);
    this.ui.add(this.riskBarBg);
    this.ui.add(this.riskBarFill);

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

    this.ui.add(this.dialogPanel);
    this.ui.add(this.txtDialogTitle);
    this.ui.add(this.txtDialogBody);

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

    // Reset NPC position for the encounter
    this.resetNPC();

    if (encounter.type === "auto") {
      // Baseline: no decision. Advance after a short moment.
      this.time.delayedCall(1200, () => {
        useTailgatingStore.getState().startNextEncounter();
        this.onStoreAdvanced();
      });
      return;
    }

    // Start pressure rising as NPC approaches and waits.
    this.startPressureTimer(encounter.type);

    // Present choices based on encounter type
    const choices = this.getChoicesForEncounter(encounter.type);
    this.renderChoices(choices);
  }

  onStoreAdvanced() {
    const { ending, encounterIndex, totalEncounters } = useTailgatingStore.getState();

    if (ending) {
      this.showEnding(ending);
      return;
    }

    if (encounterIndex >= totalEncounters) {
      // Defensive, should not happen, but safe.
      useTailgatingStore.getState().evaluateEnding();
      this.showEnding(useTailgatingStore.getState().ending ?? "good");
      return;
    }

    this.refreshMeters();
    this.startEncounter();
  }

  /* -----------------------
     NPC placeholder movement + pressure
  ----------------------- */
  resetNPC() {
    const { width, height } = this.scale;
    this.npc.setPosition(width / 2, height * 0.75);
    this.npc.body.setVelocity(0, 0);
    this.syncViz();
  }

  startPressureTimer(type) {
    // Base pressure rate differs by encounter.
    const base = type.includes("attacker_clear") ? 5 : type.includes("attacker") ? 3 : 2;

    // NPC walks toward queue zone, then "waits".
    this.npc.body.setVelocity(0, -40);

    this.pressureTimer = this.time.addEvent({
      delay: 800,
      loop: true,
      callback: () => {
        const store = useTailgatingStore.getState();
        if (store.ending) return;

        // Check if NPC is within the queue zone area.
        const inQueue = this.isInZone(this.npc.x, this.npc.y, this.zoneQueue);
        if (inQueue) {
          store.increasePressure(base, "NPC waiting behind you.");
          this.refreshMeters();
        }

        // Stop NPC when it reaches queue zone (simple clamp)
        if (this.npc.y <= this.zoneQueue.y + this.zoneQueue.h / 4) {
          this.npc.body.setVelocity(0, 0);
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
    // Each choice entry: { label, action }
    const store = useTailgatingStore.getState();

    if (type === "decision_parcel") {
      return [
        { label: "Hold door open", action: () => store.letLegitimateResidentIn() },
        { label: "Point to key fob reader", action: () => store.redirectToKeyFob() },
        { label: "Wait silently", action: () => store.waitSilently() },
        { label: "Ask a brief question", action: () => store.askQuestion() },
      ];
    }

    if (type === "decision_ambiguous") {
      return [
        { label: "Ask a question", action: () => store.askQuestion() },
        { label: "Wait and observe", action: () => store.waitSilently() },
        { label: "Redirect to key fob", action: () => store.redirectToKeyFob() },
        { label: "Use intercom", action: () => store.useIntercom() },
        { label: "Hold door open", action: () => store.letLegitimateResidentIn() },
      ];
    }

    if (type === "decision_attacker_clear") {
      return [
        { label: "Let them in quickly", action: () => store.letAttackerIn() },
        { label: "Refuse and redirect to building process", action: () => store.safelyRefuseEntry() },
        { label: "Use intercom", action: () => store.useIntercom() },
      ];
    }

    // advanced attacker: harder judgement. For now still deterministic by action.
    return [
      { label: "Hold door open", action: () => store.letAttackerIn() },
      { label: "Ask a question", action: () => store.askQuestion() },
      { label: "Redirect to key fob", action: () => store.redirectToKeyFob() },
      { label: "Use intercom", action: () => store.useIntercom() },
    ];
  }

  renderChoices(choices) {
    this.clearChoices();

    const { width, height } = this.scale;

    const startX = 40;
    const startY = height - 90;
    const btnW = Math.min(260, width - 80);
    const btnH = 34;
    const gap = 10;

    choices.forEach((c, i) => {
      const y = startY + i * (btnH + gap);

      const btn = this.add.rectangle(startX, y, btnW, btnH, 0x223044, 0.95);
      btn.setOrigin(0, 0.5);
      btn.setStrokeStyle(2, 0x355170);
      btn.setInteractive({ useHandCursor: true });

      const txt = this.add.text(startX + 12, y - 9, c.label, {
        fontFamily: "system-ui, Arial",
        fontSize: "13px",
        color: "#e6eefc",
      });

      btn.on("pointerover", () => btn.setFillStyle(0x2a3e56, 1));
      btn.on("pointerout", () => btn.setFillStyle(0x223044, 0.95));
      btn.on("pointerdown", () => {
        // Execute store action then advance UI.
        c.action();
        this.onStoreAdvanced();
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

    // Ensure meters frozen and evaluated.
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

    this.add.text(width / 2, height / 2 - 90, title, {
      fontFamily: "system-ui, Arial",
      fontSize: "20px",
      color: "#e6eefc",
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 45, body, {
      fontFamily: "system-ui, Arial",
      fontSize: "14px",
      color: "#c9d7ee",
      wordWrap: { width: panelW - 40 },
      align: "center",
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, stats, {
      fontFamily: "system-ui, Arial",
      fontSize: "13px",
      color: "#9fb6cf",
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 75, "Press R to restart", {
      fontFamily: "system-ui, Arial",
      fontSize: "13px",
      color: "#e6eefc",
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-R", () => {
      overlay.destroy();
      panel.destroy();
      useTailgatingStore.getState().resetGame();
      this.refreshMeters();
      this.startEncounter();
    });
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

  update() {
    this.syncViz();
  }
}
