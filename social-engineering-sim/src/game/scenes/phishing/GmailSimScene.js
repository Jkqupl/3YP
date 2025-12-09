import Phaser from "phaser"
import { useGameStore } from "../../../state/useGameStore"

export class GmailSimScene extends Phaser.Scene {
  constructor() {
    super("GmailSimScene")
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height

    // Use a consistent baseline resolution of 360 for vertical scaling
    const scaleFactor = h / 360

    // Panel background
    const panel = this.add.rectangle(
      w / 2,
      h / 2,
      w * 0.94,
      h * 0.94,
      0x1e293b,
      0.95
    )
    panel.setStrokeStyle(2, 0x38bdf8)

    // Title
    this.add.text(
      w * 0.05,
      h * 0.08,
      "Fake Gmail login page",
      {
        fontFamily: "Arial",
        fontSize: 28 * scaleFactor,
        color: "#38bdf8"
      }
    )

    // Description text
    this.add.text(
      w * 0.05,
      h * 0.20,
      "This page attempts to steal your credentials.\nAlways check the URL before logging in.",
      {
        fontFamily: "Arial",
        fontSize: 16 * scaleFactor,
        color: "#e2e8f0"
      }
    )

    // Unsafe button
    const unsafe = this.add.text(
      w * 0.05,
      h * 0.45,
      "Enter credentials (unsafe)",
      {
        fontFamily: "Arial",
        fontSize: 20 * scaleFactor,
        backgroundColor: "#f87171",
        color: "#0f172a",
        padding: {
          x: 8 * scaleFactor,
          y: 6 * scaleFactor
        }
      }
    )
    unsafe.setInteractive()
    unsafe.on("pointerdown", () => {
      useGameStore.getState().setFail(
        "Credentials were entered into a phishing page."
      )
    })

    // Safe button
    const safe = this.add.text(
      w * 0.05,
      h * 0.65,
      "Back out safely",
      {
        fontFamily: "Arial",
        fontSize: 20 * scaleFactor,
        backgroundColor: "#34d399",
        color: "#0f172a",
        padding: {
          x: 8 * scaleFactor,
          y: 6 * scaleFactor
        }
      }
    )
    safe.setInteractive()
    safe.on("pointerdown", () => {
      const { handleGmailSafe, endSimulation } = useGameStore.getState()
      handleGmailSafe()
      endSimulation()
    })
  }
}
