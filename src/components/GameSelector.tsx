'use client';

import Link from 'next/link';
import { GAME_LIST } from '@/games';

export default function GameSelector() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto">
      {GAME_LIST.map((game) => (
        <Link
          key={game.id}
          href={`/play/${game.id}`}
          className={`group relative bg-gradient-to-br ${game.gradient} rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 active:scale-95 min-h-[160px] md:min-h-[200px]`}
        >
          <span className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {game.emoji}
          </span>
          <h3 className="text-white font-bold text-lg md:text-xl mb-1">
            {game.name}
          </h3>
          <p className="text-white/60 text-xs md:text-sm">
            {game.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
