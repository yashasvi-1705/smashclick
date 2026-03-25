'use client';

import GameCanvas from '@/components/GameCanvas';
import KeyDisplay from '@/components/KeyDisplay';
import ABCGame from '@/components/ABCGame';

export default function PlayClient({ gameId }: { gameId: string }) {
  if (gameId === 'abc') {
    return <ABCGame />;
  }

  return (
    <>
      <GameCanvas gameId={gameId} />
      <KeyDisplay />
    </>
  );
}
