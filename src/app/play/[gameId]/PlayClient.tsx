'use client';

import GameCanvas from '@/components/GameCanvas';
import KeyDisplay from '@/components/KeyDisplay';

export default function PlayClient({ gameId }: { gameId: string }) {
  return (
    <>
      <GameCanvas gameId={gameId} />
      <KeyDisplay />
    </>
  );
}
