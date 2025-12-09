import Phaser from "phaser"
import { useGameStore } from "../../../state/useGameStore"

export class AmazonSimScene extends Phaser.Scene {
  constructor() {
    super("AmazonSimScene")
  }

  create() {
    this.add.text(40, 40, "Amazon receipt details", {
      fontSize: "24px",
      color: "#ffdd99"
    })

    this.add.text(
      40,
      80,
      "Order: Wireless headphones\nOrder number: #ABCD-1235 (your last real order ended in 1234)",
      {
        fontSize: "18px",
        color: "#ffffff"
      }
    )

    const download = this.add.text(40, 150, "Download receipt PDF (unsafe)", {
      fontSize: "20px",
      color: "#ff4444"
    })
    download.setInteractive()
    download.on("pointerdown", () => {
      const setFail = useGameStore.getState().setFail
      setFail("You downloaded a fake receipt that installed malware on your device.")
    })

    const deleteSafe = this.add.text(40, 200, "Delete email after spotting mismatch", {
      fontSize: "20px",
      color: "#00ffea"
    })
    deleteSafe.setInteractive()
    deleteSafe.on("pointerdown", () => {
      const { handleAmazonSafe, endSimulation } = useGameStore.getState()
      handleAmazonSafe()
      endSimulation()
    })
  }
}
