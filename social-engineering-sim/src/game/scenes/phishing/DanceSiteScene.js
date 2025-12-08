import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class DanceSiteScene extends Phaser.Scene {
  constructor() {
    super("DanceSiteScene")
  }

  create() {
    this.add.text(40, 40, "Legitimate Dance Registration Website", {
      fontSize: "28px",
      color: "#00ff00"
    })

    const back = this.add.text(40, 140, "Back to Inbox", {
      fontSize: "24px",
      color: "#00ffea"
    })
    back.setInteractive()
    back.on("pointerdown", () => {
      this.scene.start("InboxScene")
    })
  }
}
