'use client';

import { useRef, useEffect } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { usePreventExit } from '@/hooks/usePreventExit';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useParentPanel } from '@/hooks/useParentPanel';
import { AudioEngine } from '@/engine/AudioEngine';
import ParentPanel from './ParentPanel';

interface Props {
  gameId: string;
}

export default function GameCanvas({ gameId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isOpen, open, close, settings, updateSetting } = useParentPanel();
  const { enter: enterFullscreen } = useFullscreen();

  usePreventExit();

  // Sync audio settings
  useEffect(() => {
    AudioEngine.setEnabled(settings.sound);
    AudioEngine.setVolume(settings.volume / 100);
  }, [settings.sound, settings.volume]);

  // Auto-enter fullscreen on mount
  useEffect(() => {
    const timer = setTimeout(() => enterFullscreen(), 300);
    return () => clearTimeout(timer);
  }, [enterFullscreen]);

  useGameEngine(gameId, canvasRef, open);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full touch-none"
        style={{ cursor: 'crosshair' }}
      />
      <ParentPanel
        isOpen={isOpen}
        onClose={close}
        settings={settings}
        onUpdate={updateSetting}
      />
    </>
  );
}
