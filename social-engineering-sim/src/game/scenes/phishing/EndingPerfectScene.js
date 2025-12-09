import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class EndingPerfectScene extends Phaser.Scene {
  constructor() {
    super("EndingPerfectScene")
  }

  create() {
    this.add.text(80, 160, "Perfect Ending", {
      fontSize: "48px",
      color: "#00ff00"
    })

    this.add.text(
      80,
      240,
      "You used the legitimate dance email safely and avoided every phishing attempt.",
      {
        fontSize: "24px",
        color: "#ffffff",
        wordWrap: { width: 650 }
      }
    )

    const retry = this.add.text(80, 360, "Retry", {
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
