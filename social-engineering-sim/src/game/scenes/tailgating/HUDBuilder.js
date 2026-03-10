/**
 * HUDBuilder.js
 *
 * Creates and repositions all HUD elements for the tailgating scene:
 *   - Top bar (title, encounter counter, pressure & risk meters)
 *   - Bottom dialogue panel (title, body, feedback text)
 *   - Choice button container
 *
 * All references are exposed as public properties so TailgatingScene can
 * read them directly (e.g. this.hud.txtFeedback.setText(...)).
 *
 * Usage:
 *   this.hud = new HUDBuilder(this);
 *   this.hud.build(width, height);
 *   this.hud.relayout(width, height);   // call on resize
 *   this.hud.refreshMeters();           // sync bar widths to store values
 */

import { useTailgatingStore } from "../../../state/useTailgatingStore";

const FONT = "system-ui, Arial";

export default class HUDBuilder {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;

    // Top bar
    this.hudBg = null;
    this.txtTitle = null;
    this.txtEncounter = null;
    this.txtPressure = null;
    this.txtRisk = null;
    this.pressureBarBg = null;
    this.pressureBarFill = null;
    this.riskBarBg = null;
    this.riskBarFill = null;

    // Dialogue panel
    this.dialogPanel = null;
    this.txtDialogTitle = null;
    this.txtDialogBody = null;
    this.txtFeedback = null;

    // Choice buttons
    this.choiceContainer = null;
    this.choiceButtons = [];

    // Root container
    this.ui = null;
  }

  // ─── Build ───────────────────────────────────────────────────────────────────

  build(width, height) {
    const s = this.scene;
    this.ui = s.add.container(0, 0);

    // ── Top bar ──────────────────────────────────────────────────────────────
    this.hudBg = s.add.rectangle(width / 2, 34, width, 68, 0x0b0f14, 0.9);
    this.ui.add(this.hudBg);

    this.txtTitle = s.add.text(16, 10, "Tailgating Simulation", {
      fontFamily: FONT,
      fontSize: "14px",
      color: "#e6eefc",
    });

    this.txtEncounter = s.add.text(16, 30, "", {
      fontFamily: FONT,
      fontSize: "13px",
      color: "#c9d7ee",
    });

    this.ui.add(this.txtTitle);
    this.ui.add(this.txtEncounter);

    // Meter labels
    this.txtPressure = s.add
      .text(0, 0, "Pressure", { fontFamily: FONT, fontSize: "12px", color: "#c9d7ee" })
      .setOrigin(1, 0);
    this.txtRisk = s.add
      .text(0, 0, "Risk", { fontFamily: FONT, fontSize: "12px", color: "#c9d7ee" })
      .setOrigin(1, 0);

    this.ui.add(this.txtPressure);
    this.ui.add(this.txtRisk);

    // Meter bars
    this.pressureBarBg = s.add.rectangle(0, 0, 200, 10, 0x1d2a3a);
    this.pressureBarFill = s.add.rectangle(0, 0, 0, 10, 0xffc14d).setOrigin(0, 0.5);
    this.riskBarBg = s.add.rectangle(0, 0, 200, 10, 0x1d2a3a);
    this.riskBarFill = s.add.rectangle(0, 0, 0, 10, 0xff6b6b).setOrigin(0, 0.5);

    this.ui.add(this.pressureBarBg);
    this.ui.add(this.pressureBarFill);
    this.ui.add(this.riskBarBg);
    this.ui.add(this.riskBarFill);

    // ── Dialogue panel ───────────────────────────────────────────────────────
    const panelW = Math.min(640, width * 0.86);

    this.dialogPanel = s.add
      .rectangle(width / 2, height - 110, panelW, 120, 0x0b0f14, 0.92)
      .setStrokeStyle(2, 0x223044);

    this.txtDialogTitle = s.add.text(0, 0, "", {
      fontFamily: FONT,
      fontSize: "14px",
      color: "#e6eefc",
    });

    this.txtDialogBody = s.add.text(0, 0, "", {
      fontFamily: FONT,
      fontSize: "13px",
      color: "#c9d7ee",
      wordWrap: { width: panelW - 28 },
    });

    this.txtFeedback = s.add.text(0, 0, "", {
      fontFamily: FONT,
      fontSize: "12px",
      color: "#9fb6cf",
      wordWrap: { width: panelW - 28 },
    });

    this.ui.add(this.dialogPanel);
    this.ui.add(this.txtDialogTitle);
    this.ui.add(this.txtDialogBody);
    this.ui.add(this.txtFeedback);

    // ── Choice container ─────────────────────────────────────────────────────
    this.choiceContainer = s.add.container(0, 0);
    this.ui.add(this.choiceContainer);

    // Final layout pass
    this.relayout(width, height);
    this.refreshMeters();
  }

  // ─── Layout ──────────────────────────────────────────────────────────────────

  relayout(width, height) {
    this._layoutHudBar(width);
    this._layoutDialogPanel(width, height);
  }

  _layoutHudBar(width) {
    const isMobile = width < 520;
    const padX = 16;
    const topY = 10;

    if (isMobile) {
      const hudH = 96;
      this.hudBg.setPosition(width / 2, hudH / 2);
      this.hudBg.height = hudH;

      this.txtTitle.setPosition(padX, topY);
      this.txtEncounter.setPosition(padX, topY + 20);

      const barW = Math.max(160, Math.min(240, width - padX * 2));
      const barLeftX = padX;
      const barCenterX = barLeftX + barW / 2;

      this.txtPressure.setOrigin(0, 0).setPosition(padX, topY + 42);
      this.txtRisk.setOrigin(0, 0).setPosition(padX, topY + 68);

      this.pressureBarBg.setSize(barW, 10).setPosition(barCenterX, topY + 60);
      this.pressureBarFill.setSize(this.pressureBarFill.width, 10).setPosition(barLeftX, topY + 60);
      this.riskBarBg.setSize(barW, 10).setPosition(barCenterX, topY + 86);
      this.riskBarFill.setSize(this.riskBarFill.width, 10).setPosition(barLeftX, topY + 86);
    } else {
      const hudH = 68;
      this.hudBg.setPosition(width / 2, 34);
      this.hudBg.height = hudH;

      this.txtTitle.setPosition(16, 10);
      this.txtEncounter.setPosition(16, 30);

      const barW = 200;
      const barLeftX = width - 270;
      const barCenterX = barLeftX + barW / 2;
      const labelGap = 12;
      const labelX = barLeftX - labelGap;

      this.txtPressure.setOrigin(1, 0).setPosition(labelX, 12);
      this.txtRisk.setOrigin(1, 0).setPosition(labelX, 36);

      this.pressureBarBg.setSize(barW, 10).setPosition(barCenterX, 20);
      this.pressureBarFill.setPosition(barLeftX, 20);
      this.riskBarBg.setSize(barW, 10).setPosition(barCenterX, 44);
      this.riskBarFill.setPosition(barLeftX, 44);
    }

    this.refreshMeters();
  }

  _layoutDialogPanel(width, height) {
    const panelW = Math.min(640, width * 0.86);
    const panelH = 120;
    const panelCenterY = height - 110;
    const panelLeftX = width / 2 - panelW / 2;

    this.dialogPanel.setPosition(width / 2, panelCenterY);
    this.dialogPanel.width = panelW;

    this.txtDialogTitle.setPosition(panelLeftX + 14, panelCenterY - panelH / 2 + 1); //- 40
    this.txtDialogBody.setPosition(panelLeftX + 14, panelCenterY - panelH / 2 + 20); // + 6
    this.txtDialogBody.setWordWrapWidth(panelW - 28);

    this.txtFeedback.setPosition(panelLeftX + 14, panelCenterY + 16);
    this.txtFeedback.setWordWrapWidth(panelW - 28);
  }

  // ─── Meters ──────────────────────────────────────────────────────────────────

  refreshMeters() {
    const { socialPressure, securityRisk } = useTailgatingStore.getState();
    const maxW = 200;

    this.pressureBarFill.width = Math.round(
      (Phaser.Math.Clamp(socialPressure, 0, 100) / 100) * maxW
    );
    this.riskBarFill.width = Math.round(
      (Phaser.Math.Clamp(securityRisk, 0, 100) / 100) * maxW
    );
  }

  // ─── Choices ─────────────────────────────────────────────────────────────────

  /**
   * Render a set of choice buttons.
   * @param {{ label: string, actionKey: string }[]} choices
   * @param {Function} onChoiceFn — callback(actionKey)
   */
  renderChoices(choices, onChoiceFn) {
    this.clearChoices();

    const { width, height } = this.scene.scale;
    const sidebarX = 40;
    const sidebarW = Math.min(360, Math.floor(width * 0.32));
    const gapY = 10;
    const topSafeY = 90;
    const panelH = 120;
    const dialogTopY = height - 110 - panelH / 2;
    const laneBottomY = dialogTopY - 16;
    const laneH = Math.max(80, laneBottomY - topSafeY);

    const cols = sidebarW >= 320 && choices.length >= 4 ? 2 : 1;
    const gapX = 12;
    const btnW = cols === 2 ? Math.floor((sidebarW - gapX) / 2) : sidebarW;

    let btnH = 34;
    const rows = Math.ceil(choices.length / cols);
    if (rows * btnH + (rows - 1) * gapY > laneH) btnH = 30;

    const gridH = rows * btnH + (rows - 1) * gapY;
    const startY = Math.max(topSafeY, laneBottomY - gridH);

    choices.forEach((c, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = sidebarX + col * (btnW + gapX);
      const y = startY + row * (btnH + gapY);

      const btn = this.scene.add
        .rectangle(x, y, btnW, btnH, 0x223044, 0.95)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x355170)
        .setInteractive({ useHandCursor: true });

      const txt = this.scene.add.text(x + 10, y + 8, c.label, {
        fontFamily: FONT,
        fontSize: "13px",
        color: "#e6eefc",
        wordWrap: { width: btnW - 20 },
      });

      btn.on("pointerover", () => btn.setFillStyle(0x2a3e56, 1));
      btn.on("pointerout", () => btn.setFillStyle(0x223044, 0.95));
      btn.on("pointerdown", () => onChoiceFn(c.actionKey));

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

  // ─── Ending overlay ───────────────────────────────────────────────────────────

  /**
   * Render the ending screen overlay.
   * Returns an array of the created Phaser objects so the scene can track them.
   *
   * @param {"perfect"|"good"|"fail"|"quit"} ending
   * @param {{ securityRisk: number, socialPressure: number }} state
   * @returns {Phaser.GameObjects.GameObject[]}
   */
  buildEndingOverlay(ending, state) {
    const s = this.scene;
    const { width, height } = s.scale;

    const TITLES = {
      perfect: "Perfect Ending",
      good: "Good Ending",
      quit: "Session Ended",
      fail: "Fail Ending",
    };
    const BODIES = {
      perfect: "You handled each encounter safely and kept overall risk low.",
      good: "No breach occurred, but repeated small concessions increased risk over time.",
      quit: "You ended the simulation early.",
      fail: "An unauthorised person gained access. Tailgating can lead to theft and safety risks.",
    };

    const panelW = Math.min(560, width * 0.86);

    const overlay = s.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.65);
    const panel = s.add
      .rectangle(width / 2, height / 2, panelW, 260, 0x0b0f14, 0.95)
      .setStrokeStyle(2, 0x223044);

    const tTitle = s.add
      .text(width / 2, height / 2 - 90, TITLES[ending] ?? "Ended", {
        fontFamily: FONT,
        fontSize: "20px",
        color: "#e6eefc",
      })
      .setOrigin(0.5);

    const tBody = s.add
      .text(width / 2, height / 2 - 45, BODIES[ending] ?? "", {
        fontFamily: FONT,
        fontSize: "14px",
        color: "#c9d7ee",
        wordWrap: { width: panelW - 40 },
        align: "center",
      })
      .setOrigin(0.5);

    const tStats = s.add
      .text(
        width / 2,
        height / 2 + 20,
        `Risk: ${state.securityRisk}/100   Pressure: ${state.socialPressure}/100`,
        { fontFamily: FONT, fontSize: "13px", color: "#9fb6cf" }
      )
      .setOrigin(0.5);

    const hintText = width < 520 ? "Tap to restart" : "Press R to restart";
    const tHint = s.add
      .text(width / 2, height / 2 + 75, hintText, {
        fontFamily: FONT,
        fontSize: "13px",
        color: "#e6eefc",
      })
      .setOrigin(0.5);

    return [overlay, panel, tTitle, tBody, tStats, tHint];
  }
}