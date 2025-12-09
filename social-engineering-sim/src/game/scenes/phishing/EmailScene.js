import Phaser from "phaser"
import { GameState } from "./PhishingAssets"

export default class EmailScene extends Phaser.Scene {
  constructor() {
    super("EmailScene")
  }

  init(data) {
    this.email = data.email
  }

  create() {
    this.add.text(40, 40, this.email.subject, {
      fontSize: "30px",
      color: "#ffffff"
    })

    let y = 150

    // DELETE
    this.makeButton("Delete Email", 40, y, () => this.deleteEmail())
    y += 60

    // VIEW LINK
    this.makeButton("View Link", 40, y, () => this.viewLink())
    y += 60

    // ENTER CREDENTIALS only for Gmail, not for Amazon
    if (this.email.id === "gmail") {
      this.makeButton("Enter Credentials", 40, y, () => this.enterCredentials())
    }
  }

  makeButton(label, x, y, handler) {
    const btn = this.add.text(x, y, label, {
      fontSize: "24px",
      color: "#00ffea"
    })
    btn.setInteractive()
    btn.on("pointerdown", handler)
  }

  deleteEmail() {
    const day = GameState.day

    GameState.inbox[day] = GameState.inbox[day].filter(
      e => e.id !== this.email.id
    )

    if (this.email.id === "dance") {
      GameState.danceDeleted = true
    }

    if (this.email.id === "gmail") {
      GameState.gmailResolvedSafely = true
    }

    if (this.email.id === "amazon") {
      GameState.amazonResolvedSafely = true
    }

    this.scene.start("InboxScene")
  }

  viewLink() {
    if (this.email.id === "dance") {
      GameState.danceLegitVisited = true
      return this.scene.start("DanceSiteScene")
    }
    if (this.email.id === "gmail") {
      return this.scene.start("FakeGmailScene")
    }
    if (this.email.id === "amazon") {
      return this.scene.start("FakeAmazonScene")
    }
  }

  enterCredentials() {
    GameState.failReason = "Credentials stolen at Gmail step"
    this.scene.start("EndingFailScene")
  }
}
