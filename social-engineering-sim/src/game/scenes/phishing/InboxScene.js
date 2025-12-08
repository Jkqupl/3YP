import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class InboxScene extends Phaser.Scene {
  constructor() {
    super("InboxScene")
  }

  create() {
    const day = GameState.day

    this.add.text(40, 40, `Inbox - Day ${day}`, {
      fontSize: "32px",
      color: "#ffffff"
    })

    const emails = this.getEmailListForDay(day)

    let y = 140
    emails.forEach(email => {
      const text = this.add.text(60, y, email.subject, {
        fontSize: "24px",
        color: "#00ffea"
      })
      text.setInteractive()
      text.on("pointerdown", () => {
        this.scene.start("EmailScene", { email })
      })
      y += 50
    })
  }

  getEmailListForDay(day) {
    if (day === 1) {
      return [
        { id: "dance", subject: "Dance Competition Registration", type: "legit" },
        { id: "gmail", subject: "Unusual Sign in Attempt", type: "phish" }
      ]
    }

    return [
      { id: "amazon", subject: "Amazon Purchase Receipt", type: "phish" }
    ]
  }
}
