'use client';

import { useEffect, useState } from 'react';

interface KeyEvent {
  key: string;
  id: number;
  x: number;
  y: number;
}

export default function KeyDisplay() {
  const [keys, setKeys] = useState<KeyEvent[]>([]);

  useEffect(() => {
    let nextId = 0;
    const handler = (e: KeyboardEvent) => {
      const id = nextId++;
      const display = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      setKeys(prev => [...prev.slice(-5), {
        key: display,
        id,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
      }]);
      setTimeout(() => {
        setKeys(prev => prev.filter(k => k.id !== id));
      }, 800);
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {keys.map(k => (
        <div
          key={k.id}
          className="absolute animate-bounce text-white font-bold text-6xl md:text-8xl opacity-80"
          style={{
            left: `${k.x}%`,
            top: `${k.y}%`,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
            animation: 'keyPop 0.8s ease-out forwards',
          }}
        >
          {k.key}
        </div>
      ))}
    </div>
  );
}
