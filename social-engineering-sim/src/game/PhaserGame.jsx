import React from "react"
import { useEffect } from "react"
import Phaser from "phaser"
import BootScene from "./scenes/BootScene"


export default function PhaserGame() {
useEffect(() => {
const config = {
type: Phaser.AUTO,
parent: "phaser-container",
width: 960,
height: 540,
backgroundColor: "#1e293b",
scene: [BootScene]
}


const game = new Phaser.Game(config)


return () => {
game.destroy(true)
}
}, [])


return <div id="phaser-container" className="w-full h-full" />
}