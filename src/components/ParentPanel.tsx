'use client';

import { useRouter } from 'next/navigation';
import { useFullscreen } from '@/hooks/useFullscreen';

interface Settings {
  sound: boolean;
  volume: number;
  mouseTrail: boolean;
  reduceMotion: boolean;
  emojiMode: boolean;
  particleIntensity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdate: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function ParentPanel({ isOpen, onClose, settings, onUpdate }: Props) {
  const router = useRouter();
  const { exit: exitFullscreen } = useFullscreen();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900/90 rounded-2xl p-6 max-w-md w-full mx-4 space-y-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">Parent Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Sound toggle */}
        <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
          <span className="text-white">🎵 Sound</span>
          <button
            onClick={() => onUpdate('sound', !settings.sound)}
            className={`w-12 h-6 rounded-full transition-colors ${settings.sound ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${settings.sound ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* Volume */}
        <div className="bg-gray-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white">🔊 Volume</span>
            <span className="text-gray-400 text-sm">{settings.volume}%</span>
          </div>
          <input
            type="range" min="0" max="100" value={settings.volume}
            onChange={(e) => onUpdate('volume', Number(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Mouse trail */}
        <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
          <span className="text-white">✨ Mouse Sparkle</span>
          <button
            onClick={() => onUpdate('mouseTrail', !settings.mouseTrail)}
            className={`w-12 h-6 rounded-full transition-colors ${settings.mouseTrail ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${settings.mouseTrail ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* Reduce motion */}
        <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
          <span className="text-white">🐢 Reduce Motion</span>
          <button
            onClick={() => onUpdate('reduceMotion', !settings.reduceMotion)}
            className={`w-12 h-6 rounded-full transition-colors ${settings.reduceMotion ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${settings.reduceMotion ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* Emoji mode */}
        <div className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
          <span className="text-white">😀 Emoji Mode</span>
          <button
            onClick={() => onUpdate('emojiMode', !settings.emojiMode)}
            className={`w-12 h-6 rounded-full transition-colors ${settings.emojiMode ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${settings.emojiMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        {/* Particle intensity */}
        <div className="bg-gray-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white">🔢 Particle Intensity</span>
            <span className="text-gray-400 text-sm">{settings.particleIntensity}</span>
          </div>
          <input
            type="range" min="1" max="5" value={settings.particleIntensity}
            onChange={(e) => onUpdate('particleIntensity', Number(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { exitFullscreen(); }}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            ⤢ Exit Fullscreen
          </button>
          <button
            onClick={() => { exitFullscreen(); router.push('/'); }}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            🔙 Back to Games
          </button>
        </div>
      </div>
    </div>
  );
}
