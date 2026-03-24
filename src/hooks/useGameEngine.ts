'use client';

import { useEffect, useRef, useCallback } from 'react';
import { GAMES, GameEngine } from '@/games';
import { CanvasRenderer } from '@/engine/CanvasRenderer';
import { InputManager } from '@/engine/InputManager';
import { AudioEngine } from '@/engine/AudioEngine';

export function useGameEngine(
  gameId: string,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onParentPanel: () => void,
) {
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const inputRef = useRef<InputManager | null>(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const factory = GAMES[gameId];
    if (!factory) return;

    // Cleanup previous
    engineRef.current?.destroy();
    rendererRef.current?.stop();
    inputRef.current?.destroy();

    const engine = factory();
    engineRef.current = engine;

    const renderer = new CanvasRenderer(canvas);
    rendererRef.current = renderer;

    engine.init(renderer.ctx, renderer.width, renderer.height);

    const input = new InputManager(
      canvas,
      (x, y, key) => {
        engine.onInteraction(x, y, key);
        AudioEngine.resume();
        if (gameId !== 'drums') {
          AudioEngine.playScaleNote(engine.musicScale, engine.waveform);
        }
      },
      (x, y) => {
        engine.onPointerMove(x, y);
      },
      onParentPanel,
    );
    inputRef.current = input;

    const handleResize = () => {
      renderer.resize();
      engine.init(renderer.ctx, renderer.width, renderer.height);
    };

    window.addEventListener('resize', handleResize);

    renderer.start(
      (dt) => engine.update(dt),
      (ctx) => {
        engine.drawBackground(ctx);
        engine.draw(ctx);
      },
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      renderer.stop();
      input.destroy();
    };
  }, [gameId, canvasRef, onParentPanel]);

  useEffect(() => {
    const cleanup = init();
    return () => cleanup?.();
  }, [init]);

  return engineRef;
}
