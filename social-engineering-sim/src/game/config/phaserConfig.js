import Phaser from "phaser"

const commonConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#a7b7daff",
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
