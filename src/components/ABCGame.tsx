'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { usePreventExit } from '@/hooks/usePreventExit';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useParentPanel } from '@/hooks/useParentPanel';
import { AudioEngine } from '@/engine/AudioEngine';
import ParentPanel from './ParentPanel';

/* ─── Alphabet Data ─── */

const ABC: Record<string, { word: string; emoji: string; color: string }> = {
  A: { word: 'Apple', emoji: '🍎', color: '#ef4444' },
  B: { word: 'Ball', emoji: '⚽', color: '#f97316' },
  C: { word: 'Cat', emoji: '🐱', color: '#eab308' },
  D: { word: 'Dog', emoji: '🐶', color: '#84cc16' },
  E: { word: 'Elephant', emoji: '🐘', color: '#22c55e' },
  F: { word: 'Fish', emoji: '🐟', color: '#14b8a6' },
  G: { word: 'Grapes', emoji: '🍇', color: '#06b6d4' },
  H: { word: 'Hat', emoji: '🎩', color: '#3b82f6' },
  I: { word: 'Ice Cream', emoji: '🍦', color: '#6366f1' },
  J: { word: 'Jellyfish', emoji: '🪼', color: '#8b5cf6' },
  K: { word: 'Kite', emoji: '🪁', color: '#a855f7' },
  L: { word: 'Lion', emoji: '🦁', color: '#d946ef' },
  M: { word: 'Moon', emoji: '🌙', color: '#ec4899' },
  N: { word: 'Nest', emoji: '🪺', color: '#f43f5e' },
  O: { word: 'Orange', emoji: '🍊', color: '#f97316' },
  P: { word: 'Penguin', emoji: '🐧', color: '#64748b' },
  Q: { word: 'Queen', emoji: '👑', color: '#eab308' },
  R: { word: 'Rainbow', emoji: '🌈', color: '#ef4444' },
  S: { word: 'Star', emoji: '⭐', color: '#f59e0b' },
  T: { word: 'Tiger', emoji: '🐯', color: '#f97316' },
  U: { word: 'Umbrella', emoji: '☂️', color: '#3b82f6' },
  V: { word: 'Violin', emoji: '🎻', color: '#8b5cf6' },
  W: { word: 'Whale', emoji: '🐋', color: '#0ea5e9' },
  X: { word: 'Xylophone', emoji: '🎵', color: '#ec4899' },
  Y: { word: 'Yacht', emoji: '⛵', color: '#14b8a6' },
  Z: { word: 'Zebra', emoji: '🦓', color: '#1e293b' },
};

const LETTERS = Object.keys(ABC);

const NOTE_FREQ: Record<string, number> = {
  A: 261.6, B: 293.7, C: 329.6, D: 349.2, E: 392.0, F: 440.0, G: 493.9,
  H: 523.3, I: 587.3, J: 659.3, K: 698.5, L: 784.0, M: 880.0,
  N: 523.2, O: 587.4, P: 659.2, Q: 698.4, R: 784.0, S: 880.0,
  T: 987.8, U: 1046.6, V: 1174.6, W: 1318.6, X: 1397.0, Y: 1568.0, Z: 1760.0,
};

/* ─── Particle System ─── */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'star' | 'rect';
}

function createParticle(x: number, y: number, color: string): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2 + Math.random() * 8;
  const types: Particle['type'][] = ['circle', 'star', 'rect'];
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 2,
    size: 4 + Math.random() * 8,
    color,
    life: 1,
    maxLife: 1 + Math.random() * 0.5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    type: types[Math.floor(Math.random() * types.length)],
  };
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rotation: number) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = rotation + (i * Math.PI * 2) / 5 - Math.PI / 2;
    const outerX = cx + Math.cos(angle) * r;
    const outerY = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    const innerAngle = angle + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(innerAngle) * r * 0.4, cy + Math.sin(innerAngle) * r * 0.4);
  }
  ctx.closePath();
  ctx.fill();
}

/* ─── Speech ─── */

let voicesLoaded = false;
let selectedVoice: SpeechSynthesisVoice | null = null;

function loadVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;
  voicesLoaded = true;
  selectedVoice =
    voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
    voices.find(v => v.lang === 'en-US') ||
    voices.find(v => v.lang.startsWith('en')) ||
    null;
}

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.85;
  utter.pitch = 1.1;
  if (selectedVoice) utter.voice = selectedVoice;
  speechSynthesis.speak(utter);
}

/* ─── Component ─── */

export default function ABCGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const { isOpen, open, close, settings, updateSetting } = useParentPanel();
  const { enter: enterFullscreen } = useFullscreen();

  const [overlay, setOverlay] = useState<{ letter: string; visible: boolean } | null>(null);
  const [bouncingBtn, setBouncingBtn] = useState<string | null>(null);

  usePreventExit();

  // Sync audio
  useEffect(() => {
    AudioEngine.setEnabled(settings.sound);
    AudioEngine.setVolume(settings.volume / 100);
  }, [settings.sound, settings.volume]);

  // Auto fullscreen
  useEffect(() => {
    const timer = setTimeout(() => enterFullscreen(), 300);
    return () => clearTimeout(timer);
  }, [enterFullscreen]);

  // Load voices
  useEffect(() => {
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Canvas particle loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.12;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life -= 0.016 / p.maxLife;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'circle') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.type === 'star') {
          drawStar(ctx, 0, 0, p.size, 0);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Spawn particles
  const spawnParticles = useCallback((tapX: number, tapY: number, color: string) => {
    const particles = particlesRef.current;
    // 20 at tap point
    for (let i = 0; i < 20; i++) {
      particles.push(createParticle(tapX, tapY, color));
    }
    // 50 from center
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle(cx, cy, color));
    }
  }, []);

  // Trigger letter
  const triggerLetter = useCallback((letter: string, tapX?: number, tapY?: number) => {
    const data = ABC[letter];
    if (!data) return;

    AudioEngine.resume();

    // Musical note
    AudioEngine.playNote(NOTE_FREQ[letter], 'triangle', 0.4, 0.3);

    // Speech with delay
    if (!voicesLoaded) loadVoices();
    setTimeout(() => speak(`${letter} for ${data.word}`), 200);

    // Overlay
    setOverlay({ letter, visible: true });
    setTimeout(() => setOverlay(null), 2200);

    // Button bounce
    setBouncingBtn(letter);
    setTimeout(() => setBouncingBtn(null), 400);

    // Particles
    const x = tapX ?? window.innerWidth / 2;
    const y = tapY ?? window.innerHeight / 2;
    spawnParticles(x, y, data.color);
  }, [spawnParticles]);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key >= 'A' && key <= 'Z' && key.length === 1) {
        e.preventDefault();
        triggerLetter(key);
      }
      if (e.key === 'Escape') {
        open();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [triggerLetter, open]);

  // Parent panel: hold top-left
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCornerDown = useCallback((e: React.PointerEvent) => {
    if (e.clientX < 80 && e.clientY < 80) {
      holdTimerRef.current = setTimeout(() => open(), 2000);
    }
  }, [open]);
  const handleCornerUp = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const overlayData = overlay ? ABC[overlay.letter] : null;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)' }}
      onPointerDown={handleCornerDown}
      onPointerUp={handleCornerUp}
      onPointerCancel={handleCornerUp}
    >
      {/* Title Bar */}
      <div
        className="relative z-10 text-center py-3 px-4"
        style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.9), transparent)' }}
      >
        <h1
          className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          🔤 ABC Smash
        </h1>
        <p className="text-white/50 text-xs md:text-sm">Press a letter or tap to learn!</p>
      </div>

      {/* Letter Grid */}
      <div className="relative z-10 flex-1 p-3 md:p-6 overflow-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        <div
          className="grid gap-2 md:gap-3 mx-auto"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            maxWidth: '1200px',
          }}
        >
          {LETTERS.map((letter) => {
            const { color } = ABC[letter];
            const isBouncing = bouncingBtn === letter;
            return (
              <button
                key={letter}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  triggerLetter(letter, rect.left + rect.width / 2, rect.top + rect.height / 2);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  triggerLetter(letter, touch.clientX, touch.clientY);
                }}
                className="relative aspect-square rounded-xl flex items-center justify-center text-white font-bold select-none transition-transform duration-150"
                style={{
                  background: `linear-gradient(135deg, ${color}, ${darkenColor(color, 30)})`,
                  border: '2px solid rgba(255,255,255,0.1)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontFamily: "'Fredoka', sans-serif",
                  transform: isBouncing
                    ? 'scale(1.2)'
                    : undefined,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 20 }}
      />

      {/* Letter Overlay */}
      {overlay && overlayData && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{
            zIndex: 30,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(15px)',
            animation: 'abcFadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(10rem, 30vw, 20rem)',
              color: overlayData.color,
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              lineHeight: 1,
              animation: 'abcLetterBounce 0.5s ease-out',
              textShadow: `0 0 60px ${overlayData.color}40`,
            }}
          >
            {overlay.letter}
          </div>
          <div
            style={{
              fontSize: 'clamp(4rem, 12vw, 8rem)',
              lineHeight: 1.2,
              animation: 'abcEmojiPop 0.4s ease-out 0.15s both',
            }}
          >
            {overlayData.emoji}
          </div>
          <div
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              color: '#fff',
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 600,
              marginTop: '0.5rem',
              animation: 'abcWordSlide 0.4s ease-out 0.25s both',
            }}
          >
            {overlay.letter} for {overlayData.word}
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes abcFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes abcLetterBounce {
          0% { transform: scale(0) rotate(-15deg); }
          60% { transform: scale(1.15) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes abcEmojiPop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes abcWordSlide {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Parent Panel */}
      <ParentPanel
        isOpen={isOpen}
        onClose={close}
        settings={settings}
        onUpdate={updateSetting}
      />
    </div>
  );
}

/* ─── Helpers ─── */

function darkenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
