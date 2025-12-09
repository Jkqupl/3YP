import Phaser from "phaser"
import { useGameStore } from "../../../state/useGameStore"

export class AmazonSimScene extends Phaser.Scene {
  constructor() {
    super("AmazonSimScene")
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    const scaleFactor = h / 360

    // Background panel
    const panel = this.add.rectangle(
      w / 2,
      h / 2,
      w * 0.94,
      h * 0.94,
      0x1e293b,
      0.95
    )
    panel.setStrokeStyle(2, 0xfbbf24)

    // Title
    this.add.text(
      w * 0.05,
      h * 0.08,
      "Amazon receipt details",
      {
        fontFamily: "Arial",
        fontSize: 28 * scaleFactor,
        color: "#fbbf24"
      }
    )

    // Description
    this.add.text(
      w * 0.05,
      h * 0.20,
      "Order: Wireless headphones\nOrder number: #ABCD-1235\nYour actual last order: #ABCD-1234",
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
      "Download receipt PDF (unsafe)",
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
        "Malware installed from fake receipt PDF."
      )
    })

    // Safe button
    const safe = this.add.text(
      w * 0.05,
      h * 0.65,
      "Delete email (mismatch detected)",
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
      const { handleAmazonSafe, endSimulation } = useGameStore.getState()
      handleAmazonSafe()
      endSimulation()
    })
  }
}
