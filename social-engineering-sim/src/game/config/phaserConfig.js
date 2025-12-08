import Phaser from "phaser"

const commonConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#dfe5f3ff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

export default commonConfig
