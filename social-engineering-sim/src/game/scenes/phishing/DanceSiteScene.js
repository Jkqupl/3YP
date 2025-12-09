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

    const deleteEmail = this.add.text(40, 140, "Delete Email", {
      fontSize: "24px",
      color: "#00ffea"
    })
    deleteEmail.setInteractive()
    deleteEmail.on("pointerdown", () => {
      GameState.danceDeleted = true

      GameState.inbox[1] = GameState.inbox[1].filter(
        e => e.id !== "dance"
      )

      this.scene.start("InboxScene")
    })
    const safeLogin = this.add.text(40, 200, "Enter Credentials Safely", {
      fontSize: "24px",
      color: "#00ffea"
    })
    safeLogin.setInteractive()
    safeLogin.on("pointerdown", () => {
      GameState.danceLegitVisited = true

      // Remove dance email after handling safely
      GameState.inbox[1] = GameState.inbox[1].filter(e => e.id !== "dance")

      this.scene.start("InboxScene")
    })

    const back = this.add.text(40, 260, "Back to Inbox", {
      fontSize: "24px",
      color: "#00ffea"
    })
    back.setInteractive()
    back.on("pointerdown", () => {
      // Still delete the dance email if they visited safely
      if (GameState.danceLegitVisited) {
        GameState.inbox[1] = GameState.inbox[1].filter(e => e.id !== "dance")
      }
      this.scene.start("InboxScene")
    })
  }
}
