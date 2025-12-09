import Phaser from "phaser"
import { useGameStore } from "../../../state/useGameStore"

export class GmailSimScene extends Phaser.Scene {
  constructor() {
    super("GmailSimScene")
  }

  create() {
    this.add.text(40, 40, "Fake Gmail login page", {
      fontSize: "24px",
      color: "#ff9999"
    })

    const enter = this.add.text(40, 120, "Enter credentials (unsafe)", {
      fontSize: "20px",
      color: "#ff4444"
    })
    enter.setInteractive()
    enter.on("pointerdown", () => {
      const setFail = useGameStore.getState().setFail
      setFail("You entered credentials on a fake Gmail page. The attacker now controls your email.")
    })

    const back = this.add.text(40, 180, "Back out safely", {
      fontSize: "20px",
      color: "#00ffea"
    })
    back.setInteractive()
    back.on("pointerdown", () => {
      const { handleGmailSafe, endSimulation } = useGameStore.getState()
      handleGmailSafe()
      endSimulation()
    })
  }
}
