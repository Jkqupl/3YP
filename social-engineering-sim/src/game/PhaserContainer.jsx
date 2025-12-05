import { useEffect, useRef } from "react";
import Phaser from "phaser";
import baseConfig from "./config/phaserConfig";

export default function PhaserContainer({ scene }) {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      ...baseConfig,
      parent: "phaser-root",
      scene: [scene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [scene]);

  return <div id="phaser-root" className="w-full h-full" />;
}
