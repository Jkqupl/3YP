import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class FakeGmailScene extends Phaser.Scene {
  constructor() {
    super("FakeGmailScene")
  }

  create() {
    this.add.text(40, 40, "Fake Gmail Login", {
      fontSize: "32px",
      color: "#ff9999"
    })

    const enter = this.add.text(40, 140, "Enter Credentials", {
      fontSize: "24px",
      color: "#ff4444"
    })
    enter.setInteractive()
    enter.on("pointerdown", () => {
      GameState.failReason = "Credentials stolen at Gmail step"
      this.scene.start("EndingFailScene")
    })

    const back = this.add.text(40, 200, "Back Out Safely", {
      fontSize: "24px",
      color: "#00ffea"
    })
    back.setInteractive()
    back.on("pointerdown", () => {
      GameState.handledGmailSafely = true
      GameState.day = 2
      this.scene.start("InboxScene")
    })
  }
}
