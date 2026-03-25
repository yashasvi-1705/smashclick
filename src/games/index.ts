import { GameEngine } from './types';
import { ConfettiGame } from './confetti';
import { BubblesGame } from './bubbles';
import { SpaceGame } from './space';
import { OceanGame } from './ocean';
import { FireworksGame } from './fireworks';
import { PaintGame } from './paint';
import { AnimalsGame } from './animals';
import { RainbowGame } from './rainbow';
import { DrumsGame } from './drums';
import { GardenGame } from './garden';

export type { GameEngine };

export const GAMES: Record<string, () => GameEngine> = {
  confetti: () => new ConfettiGame(),
  bubbles: () => new BubblesGame(),
  space: () => new SpaceGame(),
  ocean: () => new OceanGame(),
  fireworks: () => new FireworksGame(),
  paint: () => new PaintGame(),
  animals: () => new AnimalsGame(),
  rainbow: () => new RainbowGame(),
  drums: () => new DrumsGame(),
  garden: () => new GardenGame(),
};

export const GAME_LIST = [
  { id: 'confetti', name: 'Confetti Blast', emoji: '🎉', description: 'Explosions of colorful confetti!', gradient: 'from-purple-900 to-indigo-900' },
  { id: 'bubbles', name: 'Bubble Pop', emoji: '🫧', description: 'Floating dreamy bubbles!', gradient: 'from-blue-900 to-cyan-800' },
  { id: 'space', name: 'Space Explorer', emoji: '🪐', description: 'Stars, comets, and galaxies!', gradient: 'from-gray-900 to-indigo-950' },
  { id: 'ocean', name: 'Ocean Dive', emoji: '🐠', description: 'Swim with fish and jellyfish!', gradient: 'from-teal-800 to-cyan-700' },
  { id: 'fireworks', name: 'Fireworks Show', emoji: '🎆', description: 'Launch spectacular fireworks!', gradient: 'from-gray-900 to-purple-950' },
  { id: 'paint', name: 'Finger Paint', emoji: '🎨', description: 'Paint and splatter everywhere!', gradient: 'from-orange-300 to-pink-300' },
  { id: 'animals', name: 'Animal Parade', emoji: '🦁', description: 'A parade of cute animals!', gradient: 'from-green-500 to-emerald-600' },
  { id: 'rainbow', name: 'Rainbow Trail', emoji: '🌈', description: 'Draw rainbows across the sky!', gradient: 'from-pink-200 to-purple-200' },
  { id: 'drums', name: 'Drum Kit', emoji: '🥁', description: 'Beat the drums and make music!', gradient: 'from-slate-800 to-zinc-900' },
  { id: 'garden', name: 'Magic Garden', emoji: '🌸', description: 'Grow flowers and butterflies!', gradient: 'from-sky-400 to-green-500' },
  { id: 'abc', name: 'ABC Smash', emoji: '🔤', description: 'Learn the alphabet with sounds!', gradient: 'from-violet-600 to-blue-600' },
];
