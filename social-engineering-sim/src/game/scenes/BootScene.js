import Phaser from "phaser"


export default class BootScene extends Phaser.Scene {
constructor() {
super("BootScene")
}


create() {
this.add.text(200, 200, "Phaser Ready", {
fontSize: "32px",
color: "#ffffff"
})
}
}