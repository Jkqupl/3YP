import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class EndingGoodScene extends Phaser.Scene {
  constructor() {
    super("EndingGoodScene")
  }

  create() {
    this.add.text(80, 160, "Good Ending", {
      fontSize: "48px",
      color: "#00ccff"
    })

    this.add.text(
      80,
      240,
      "You detected both phishing emails but deleted the legitimate one.",
      {
        fontSize: "24px",
        color: "#ffffff",
        wordWrap: { width: 650 }
      }
    )

    const retry = this.add.text(80, 330, "Retry", {
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
