import React, { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GmailSimScene } from "./scenes/phishing/GmailSimScene";
import { AmazonSimScene } from "./scenes/phishing/AmazonSimScene";

export default function PhaserSimulation({ mode }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 640,
      height: 360,
      parent: containerRef.current,
      backgroundColor: "#020617",
      scene: [],
    };

    if (mode === "gmail") {
      config.scene = [GmailSimScene];
    } else if (mode === "amazon") {
      config.scene = [AmazonSimScene];
    }

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [mode]);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      ref={containerRef}
    />
  );
}
