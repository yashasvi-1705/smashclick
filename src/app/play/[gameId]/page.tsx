import { GAME_LIST } from '@/games';
import PlayClient from './PlayClient';

export function generateStaticParams() {
  return GAME_LIST.map((game) => ({
    gameId: game.id,
  }));
}

export default async function PlayPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;

  const game = GAME_LIST.find(g => g.id === gameId);
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Game not found. <a href="/" className="ml-2 text-purple-400 underline">Go back</a>
      </div>
    );
  }

  return <PlayClient gameId={gameId} />;
}
