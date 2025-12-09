import Phaser from "phaser"
import { useGameStore } from "../../../state/useGameStore"

export class DanceSimScene extends Phaser.Scene {
  constructor() {
    super("DanceSimScene")
    this.stage = "main"   // "main" or "inspect"
  }

  create() {
    this.drawMain()
  }

  clearScreen() {
    this.children.removeAll()
  }

  drawMain() {
    const w = this.scale.width
    const h = this.scale.height
    const s = h / 360

    const panel = this.add.rectangle(
      w / 2,
      h / 2,
      w * 0.94,
      h * 0.94,
      0x1e293b,
      0.95
    )
    panel.setStrokeStyle(2, 0x10b981)

    this.add.text(
      w * 0.05,
      h * 0.08,
      "Dance competition registration",
      { fontFamily: "Arial", fontSize: 28 * s, color: "#10b981" }
    )

    this.add.text(
      w * 0.05,
      h * 0.20,
      "This is the legitimate registration site.\nYou can inspect or complete the form safely.",
      { fontFamily: "Arial", fontSize: 16 * s, color: "#e2e8f0" }
    )

    const back = this.add.text(
      w * 0.05,
      h * 0.45,
      "Back out",
      {
        fontFamily: "Arial",
        fontSize: 20 * s,
        backgroundColor: "#94a3b8",
        color: "#0f172a",
        padding: { x: 8 * s, y: 6 * s }
      }
    )
    back.setInteractive()
    back.on("pointerdown", () => {
      useGameStore.getState().endSimulation()
    })

    const inspect = this.add.text(
      w * 0.05,
      h * 0.60,
      "Inspect site",
      {
        fontFamily: "Arial",
        fontSize: 20 * s,
        backgroundColor: "#38bdf8",
        color: "#0f172a",
        padding: { x: 8 * s, y: 6 * s }
      }
    )
    inspect.setInteractive()
    inspect.on("pointerdown", () => {
      this.stage = "inspect"
      this.clearScreen()
      this.drawInspectSafePrompt()
    })

    const enter = this.add.text(
      w * 0.05,
      h * 0.75,
      "Enter details (safe)",
      {
        fontFamily: "Arial",
        fontSize: 20 * s,
        backgroundColor: "#34d399",
        color: "#0f172a",
        padding: { x: 8 * s, y: 6 * s }
      }
    )
    enter.setInteractive()
    enter.on("pointerdown", () => {
      useGameStore.getState().setDanceVisited()
      useGameStore.getState().endSimulation()
    })
  }

  drawInspectSafePrompt() {
    const w = this.scale.width
    const h = this.scale.height
    const s = h / 360

    const panel = this.add.rectangle(
      w / 2,
      h / 2,
      w * 0.94,
      h * 0.94,
      0x1e293b,
      0.95
    )
    panel.setStrokeStyle(2, 0x10b981)

    this.add.text(
      w * 0.05,
      h * 0.10,
      "Inspection result",
      { fontFamily: "Arial", fontSize: 26 * s, color: "#10b981" }
    )

    this.add.text(
      w * 0.05,
      h * 0.22,
      "The site is safe and legitimate.\nYou may enter your details.",
      { fontFamily: "Arial", fontSize: 16 * s, color: "#e2e8f0" }
    )

    const backToMain = this.add.text(
      w * 0.05,
      h * 0.52,
      "Back out",
      {
        fontFamily: "Arial",
        fontSize: 20 * s,
        backgroundColor: "#94a3b8",
        color: "#0f172a",
        padding: { x: 8 * s, y: 6 * s }
      }
    )
    backToMain.setInteractive()
    backToMain.on("pointerdown", () => {
      useGameStore.getState().endSimulation()
    })

    const enter = this.add.text(
      w * 0.05,
      h * 0.70,
      "Enter details",
      {
        fontFamily: "Arial",
        fontSize: 20 * s,
        backgroundColor: "#34d399",
        color: "#0f172a",
        padding: { x: 8 * s, y: 6 * s }
      }
    )
    enter.setInteractive()
    enter.on("pointerdown", () => {
      useGameStore.getState().setDanceVisited()
      useGameStore.getState().endSimulation()
    })
  }
}
