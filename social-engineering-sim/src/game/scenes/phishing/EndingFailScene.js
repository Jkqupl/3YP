import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class EndingFailScene extends Phaser.Scene {
  constructor() {
    super("EndingFailScene")
  }

  create() {
    this.add.text(100, 200, "Fail Ending", {
      fontSize: "48px",
      color: "#ff4444"
    })

    this.add.text(100, 300, GameState.failReason, {
      fontSize: "26px",
      color: "#ffffff",
      wordWrap: { width: 650 }
    })

    const retry = this.add.text(100, 380, "Retry", {
      fontSize: "32px",
      color: "#00ffea"
    })
    retry.setInteractive()
    retry.on("pointerdown", () => {
      GameState.reset()
      this.scene.start("IntroScene")
    })
  }
}
