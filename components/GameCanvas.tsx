'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

interface GameCanvasProps {
  onTriggerEvent: (id: string) => void;
}

export default function GameCanvas({ onTriggerEvent }: GameCanvasProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const initGame = async () => {
      const { default: GameScene } = await import('@/lib/GameScene');

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: containerRef.current!,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        scene: [GameScene],
      };

      gameRef.current = new Phaser.Game(config);
      
      const scene = gameRef.current.scene.getScene('GameScene') as InstanceType<typeof GameScene>;
      if (scene) {
        scene.setEventCallback(onTriggerEvent);
      }
    };

    initGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onTriggerEvent]);

  return <div ref={containerRef} className="w-fit mx-auto" />;
}
