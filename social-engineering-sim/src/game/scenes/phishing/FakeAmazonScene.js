import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class FakeAmazonScene extends Phaser.Scene {
  constructor() {
    super("FakeAmazonScene")
  }

  create() {

    this.add.text(40, 40, "Amazon purchase receipt", {
      fontSize: "32px",
      color: "#ff9999"
    })

    this.add.text(40, 90, "Order: Wireless Headphones", {
      fontSize: "22px",
      color: "#ffffff"
    })

    this.add.text(
      40,
      120,
      "Order number: #ABCD-1235",
      {
        fontSize: "20px",
        color: "#ffcccc",
        wordWrap: { width: 700 }
      }
    )

    // Delete email (safe)
    const deleteEmail = this.add.text(40, 170, "Delete Email", {
      fontSize: "24px",
      color: "#00ffea"
    })
    deleteEmail.setInteractive()
    deleteEmail.on("pointerdown", () => {
      GameState.amazonResolvedSafely = true

      GameState.inbox[2] = GameState.inbox[2].filter(
        e => e.id !== "amazon"
      )

      this.scene.start("InboxScene")
    })

    // Inspect order number (reveals the second stage)
    const inspect = this.add.text(40, 220, "Inspect Order Number More Closely", {
      fontSize: "24px",
      color: "#ffaa00"
    })
    inspect.setInteractive()
    inspect.on("pointerdown", () => {
      this.showInspectionMenu()
    })
  }

  showInspectionMenu() {
    this.add.text(
      40,
      280,
      "Deeper inspection shows the order number pattern does not match real Amazon formats you’ve received before.",
      {
        fontSize: "20px",
        color: "#ffffff",
        wordWrap: { width: 650 }
      }
    )

    // Download PDF (malware)
    const malware = this.add.text(40, 350, "Download Receipt PDF anyway", {
      fontSize: "24px",
      color: "#ff4444"
    })
    malware.setInteractive()
    malware.on("pointerdown", () => {
      GameState.failReason = "You downloaded a fake receipt containing malware."
      this.scene.start("EndingFailScene")
    })

    
  }
}
