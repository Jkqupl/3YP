import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class FakeAmazonScene extends Phaser.Scene {
  constructor() {
    super("FakeAmazonScene")
  }

  create() {
    this.add.text(40, 40, "Amazon purchase reciept", {
      fontSize: "32px",
      color: "#ff9999"
    })

    const malware = this.add.text(40, 140, "Click Download (malware.exe)", {
      fontSize: "24px",
      color: "#ff4444"
    })
    malware.setInteractive()
    malware.on("pointerdown", () => {
      GameState.failReason = "Malware executed"
      this.scene.start("EndingFailScene")
    })

    const back = this.add.text(40, 200, "Back Out Safely", {
      fontSize: "24px",
      color: "#00ffea"
    })
    back.setInteractive()
    back.on("pointerdown", () => {
      GameState.handledAmazonSafely = true
      this.scene.start("InboxScene")
    })
  }
}
