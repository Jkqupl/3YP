import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class InboxScene extends Phaser.Scene {
  constructor() {
    super("InboxScene")
  }

  create() {
    // Progress from day 1 to day 2 only after both day 1 emails are dealt with
    if (GameState.day === 1) {
      const danceDealtWith =
        GameState.danceLegitVisited || GameState.danceDeleted
      const gmailDealtWith = GameState.gmailResolvedSafely

      if (danceDealtWith && gmailDealtWith) {
        GameState.day = 2
      }
    }

    const day = GameState.day

    this.add.text(40, 40, `Inbox - Day ${day}`, {
      fontSize: "32px",
      color: "#ffffff"
    })

    const emails = GameState.inbox[day] || []

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

    // Check for good or perfect endings on day 2 after Amazon is handled safely
    if (day === 2 && GameState.amazonResolvedSafely) {
      // Perfect ending: user did NOT delete the dance email, used it legitimately,
      // and handled both phishing emails safely
      if (
        GameState.danceLegitVisited &&
        !GameState.danceDeleted &&
        GameState.gmailResolvedSafely
      ) {
        return this.scene.start("EndingPerfectScene")
      }

      // Good ending: user deleted the dance email but still handled both phishing emails safely
      if (GameState.danceDeleted && GameState.gmailResolvedSafely) {
        return this.scene.start("EndingGoodScene")
      }
    }
  }
}
