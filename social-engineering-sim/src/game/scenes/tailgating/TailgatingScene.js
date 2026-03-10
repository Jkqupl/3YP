/**
 * TailgatingScene.js
 *
 * Orchestrator scene for the tailgating simulation.
 * All rendering, encounter logic, dialogue, and NPC movement are delegated
 * to focused modules. This class wires them together and handles the Phaser
 * lifecycle (create / update / shutdown) and input events.
 *
 * Modules:
 *   HUDBuilder          — builds and updates all UI elements
 *   NPCController       — owns NPC physics body and animations
 *   EncounterController — resolves player choices and updates the store
 *   DialogueManager     — pages multi-line dialogue sequences
 *   encounterData       — pure data (no Phaser dependency)
 */

import Phaser from "phaser";
import { useTailgatingStore } from "../../../state/useTailgatingStore";

import HUDBuilder from "./HUDBuilder";
import NPCController from "./NPCController";
import EncounterController from "./encounterController";
import DialogueManager from "./dialogueManager";
import { ENCOUNTERS } from "./encounterData";

export default class TailgatingScene extends Phaser.Scene {
  constructor() {
    super("TailgatingScene");

    this.hud = null;
    this.npcCtrl = null;
    this.encounterCtrl = null;
    this.dialogueMgr = null;

    this.zoneDoor = null;
    this.zoneQueue = null;

    this.awaitingContinue = false;
    this.canContinueAt = 0;

    this.pressureTimer = null;

    this.endingObjects = [];
    this.endingTapHandler = null;
    this.endingTapArmer = null;

    this._onContinue = null;
    this._onQuit = null;
    this._onRestart = null;

    this._playerBody = null;
    this.playerViz = null;
  }

  // ---------------------------------------------------------------------------
  // Phaser lifecycle
  // ---------------------------------------------------------------------------

  create() {
    useTailgatingStore.getState().resetGame();

    const { width, height } = this.scale;

    this._createWorld(width, height);

    this.hud = new HUDBuilder(this);
    this.hud.build(width, height);

    this.npcCtrl = new NPCController(this);
    this.npcCtrl.create(width / 2, Math.min(height - 60, this.zoneQueue.y + 200));

    this.encounterCtrl = new EncounterController();

    this.dialogueMgr = new DialogueManager(
      this,
      this.hud.txtDialogBody,
      this.hud.txtFeedback
    );

    // Input
    this._onContinue = () => this._handleContinue();
    this._onQuit = () => {
      if (useTailgatingStore.getState().ending) return;
      useTailgatingStore.getState().setFail("You quit the simulation.");
      this._showEnding("quit");
    };

    this.input.on("pointerdown", this._onContinue);
    this.input.keyboard.on("keydown-SPACE", this._onContinue);
    this.input.keyboard.on("keydown-ENTER", this._onContinue);
    this.input.keyboard.on("keydown-Q", this._onQuit);

    // Resize
    this.scale.on("resize", () => {
      if (useTailgatingStore.getState().ending) return;
      const { width: w, height: h } = this.scale;
      this.hud.relayout(w, h);
      this.hud.renderChoices(
        this.encounterCtrl.availableChoices(),
        (k) => this._onChoice(k)
      );
      this.hud.refreshMeters();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

    this._startEncounter();
  }

  update() {
    this.npcCtrl.syncViz();
    if (this.playerViz && this._playerBody) {
      this.playerViz.setPosition(this._playerBody.x, this._playerBody.y);
    }
  }

  shutdown() {
    if (this._onContinue) {
      this.input.off("pointerdown", this._onContinue);
      this.input.keyboard.off("keydown-SPACE", this._onContinue);
      this.input.keyboard.off("keydown-ENTER", this._onContinue);
    }
    if (this._onQuit) this.input.keyboard.off("keydown-Q", this._onQuit);
    if (this._onRestart) this.input.keyboard.off("keydown-R", this._onRestart);
    if (this.endingTapArmer) { this.endingTapArmer.remove(false); this.endingTapArmer = null; }
    if (this.endingTapHandler) { this.input.off("pointerdown", this.endingTapHandler); }
  }

  // ---------------------------------------------------------------------------
  // World
  // ---------------------------------------------------------------------------

  _createWorld(width, height) {
    this.add.rectangle(width / 2, height / 2, width, height, 0x121a24);
    this.add
      .rectangle(width / 2, height / 2, width * 0.88, height * 0.78, 0x0f151e)
      .setStrokeStyle(2, 0x223044);

    const doorX = width / 2;
    const doorY = height * 0.22;
    const doorW = 110;
    const doorH = 34;

    this.add.rectangle(doorX, doorY, doorW, doorH, 0x203042).setStrokeStyle(2, 0x3a587a);
    this.add
      .text(doorX, doorY - 22, "SECURE DOOR", {
        fontFamily: "system-ui, Arial",
        fontSize: "12px",
        color: "#cfe2ff",
      })
      .setOrigin(0.5);

    const qX = width / 2;
    const qY = height * 0.52;
    const qW = 280;
    const qH = 110;

    this.add.rectangle(qX, qY, qW, qH, 0x162433).setStrokeStyle(2, 0x2a3e56);
    this.add
      .text(qX, qY - qH / 2 - 18, "QUEUE ZONE", {
        fontFamily: "system-ui, Arial",
        fontSize: "12px",
        color: "#9fb6cf",
      })
      .setOrigin(0.5);

    this.zoneDoor = { x: doorX, y: doorY, w: doorW, h: doorH };
    this.zoneQueue = { x: qX, y: qY, w: qW, h: qH };

    const playerY = height * 0.36;
    this._playerBody = this.physics.add
      .sprite(width / 2 + 80, playerY, null)
      .setSize(22, 22);
    this._playerBody.setImmovable(true);
    this.playerViz = this.add.rectangle(this._playerBody.x, this._playerBody.y, 22, 22, 0x4da3ff);
  }

  // ---------------------------------------------------------------------------
  // Encounter flow
  // ---------------------------------------------------------------------------

  _startEncounter() {
    this._stopPressureTimer();
    this.hud.clearChoices();
    this.dialogueMgr.clear();

    const store = useTailgatingStore.getState();
    const enc = ENCOUNTERS[store.encounterIndex];
    if (!enc) return;

    this.encounterCtrl.reset();
    this.awaitingContinue = false;

    const { width, height } = this.scale;
    this.npcCtrl.reset(width / 2, Math.min(height - 60, this.zoneQueue.y + 200));

    this.hud.txtEncounter.setText(
      `${store.encounterIndex + 1}/${store.totalEncounters}: ${enc.key}`
    );
    this.hud.txtDialogTitle.setText(enc.title);
    this.hud.txtDialogBody.setText(enc.subtitle);
    this.hud.txtFeedback.setText("");

    this._startPressureTimer(enc);
    this.hud.renderChoices(this.encounterCtrl.availableChoices(), (k) => this._onChoice(k));
  }

  _advanceEncounter() {
    this.hud.txtFeedback.setText("");

    const store = useTailgatingStore.getState();
    const next = store.encounterIndex + 1;

    if (next >= store.totalEncounters) {
      store.evaluateEnding();
      this._showEnding(store.ending ?? "good");
      return;
    }

    store.setEncounterIndex(next);
    this._startEncounter();
  }

  // ---------------------------------------------------------------------------
  // Choice handling
  // ---------------------------------------------------------------------------

  _onChoice(actionKey) {
    const result = this.encounterCtrl.handleAction(actionKey);
    if (!result) return;

    this._stopPressureTimer();
    this.npcCtrl.stop();
    this.hud.refreshMeters();

    switch (result.type) {
      case "gather":   return this._handleGatherResult(result);
      case "terminal": return this._handleTerminalResult(result);
      case "fail":     return this._handleFailResult(result);
      case "final":    return this._handleFinalResult(result);
    }
  }

  _handleGatherResult(result) {
    if (result.response) this.dialogueMgr.show(result.response);
    this.hud.txtFeedback.setText(result.feedback ?? "");
    this.hud.renderChoices(this.encounterCtrl.availableChoices(), (k) => this._onChoice(k));
  }

  _handleTerminalResult(result) {
    this.hud.clearChoices();
    this._endEncounterAfterDialogue({
      direction: result.npcDirection,
      response: result.response,
      feedback: result.postFeedback ?? result.feedback,
    });
  }

  _handleFailResult(result) {
    this.hud.clearChoices();
    this.hud.refreshMeters();
    this.hud.txtFeedback.setText(result.feedback ?? "");
    if (result.response) this.dialogueMgr.show(result.response);
    this._showEnding("fail");
  }

  _handleFinalResult(result) {
    this.hud.clearChoices();
    this._endEncounterAfterDialogue({
      direction: result.npcDirection,
      response: result.response,
      feedback: result.postFeedback ?? result.feedback,
    });
  }

  // ---------------------------------------------------------------------------
  // End of encounter
  // ---------------------------------------------------------------------------

  _endEncounterAfterDialogue({ direction, response, feedback, minReadMs = 900 }) {
    if (response) this.dialogueMgr.show(response);
    this.hud.txtFeedback.setText(feedback ?? "");

    this.awaitingContinue = false;
    this.canContinueAt = Date.now() + minReadMs;

    this.npcCtrl.exitTo(direction, () => {
      this.awaitingContinue = true;
      this.hud.txtFeedback.setText(
        (feedback ?? "") + "\n\nClick or press Enter to continue"
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------

  _handleContinue() {
    if (useTailgatingStore.getState().ending) return;

    if (this.dialogueMgr.isActive()) {
      if (Date.now() < this.dialogueMgr.minReadDeadline) return;
      this.dialogueMgr.advance();
      return;
    }

    if (!this.awaitingContinue) return;
    if (Date.now() < this.canContinueAt) return;

    this.awaitingContinue = false;
    this._advanceEncounter();
  }

  // ---------------------------------------------------------------------------
  // Pressure timer
  // ---------------------------------------------------------------------------

  _startPressureTimer(enc) {
    const rate = this.encounterCtrl.pressureRate();
    const addsPressure = this.encounterCtrl.addsPressure();

    this.npcCtrl.approach(120);

    this.pressureTimer = this.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        const store = useTailgatingStore.getState();
        if (store.ending) return;

        if (this.npcCtrl.isInZone(this.zoneQueue)) {
          const queueBottom = this.zoneQueue.y + this.zoneQueue.h / 2 - 12;
          if (this.npcCtrl.y <= queueBottom) this.npcCtrl.stop();

          if (addsPressure) {
            store.applyDeltas({
              pressureDelta: rate,
              riskDelta: 0,
              incident: {
                encounter: store.encounterIndex,
                type: "pressure",
                message: "NPC waiting behind you.",
              },
            });
            this.hud.refreshMeters();
          }
        }
      },
    });
  }

  _stopPressureTimer() {
    if (this.pressureTimer) {
      this.pressureTimer.remove(false);
      this.pressureTimer = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Ending
  // ---------------------------------------------------------------------------

  _showEnding(ending) {
    this._stopPressureTimer();
    this.hud.clearChoices();
    this._clearEndingOverlay();

    useTailgatingStore.getState().evaluateEnding();
    const state = useTailgatingStore.getState();

    this.endingObjects = this.hud.buildEndingOverlay(ending, state);

    if (this.endingTapArmer) { this.endingTapArmer.remove(false); }
    this.endingTapHandler = () => this._restartGame();
    this.endingTapArmer = this.time.delayedCall(250, () => {
      this.input.once("pointerdown", this.endingTapHandler);
    });

    if (this._onRestart) this.input.keyboard.off("keydown-R", this._onRestart);
    this._onRestart = () => this._restartGame();
    this.input.keyboard.on("keydown-R", this._onRestart);
  }

  _restartGame() {
    this._clearEndingOverlay();
    if (this._onRestart) {
      this.input.keyboard.off("keydown-R", this._onRestart);
      this._onRestart = null;
    }
    useTailgatingStore.getState().resetGame();
    this.hud.refreshMeters();
    this._startEncounter();
  }

  _clearEndingOverlay() {
    if (this.endingTapArmer) { this.endingTapArmer.remove(false); this.endingTapArmer = null; }
    if (this.endingTapHandler) { this.input.off("pointerdown", this.endingTapHandler); this.endingTapHandler = null; }
    this.endingObjects.forEach((o) => { if (o && !o.destroyed) o.destroy(); });
    this.endingObjects = [];
  }
}