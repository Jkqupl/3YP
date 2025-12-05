import Phaser from "phaser"

export default class PhishingScene extends Phaser.Scene {
  constructor() {
    super("PhishingScene")
  }

  create() {
    this.add.text(200, 200, "Phishing Simulation", {
      fontSize: "32px",
      color: "#ffffff"
    })
  }
}
