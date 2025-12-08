import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super("IntroScene")
  }

  create() {
    this.add.text(200, 180, "Credential Funnel Game", {
      fontSize: "38px",
      color: "#ffffff"
    })

    const start = this.add.text(220, 300, "Start Game", {
      fontSize: "28px",
      color: "#00ffea"
    })

    start.setInteractive()
    start.on("pointerdown", () => {
      this.scene.start("InboxScene")
    })
  }
}
