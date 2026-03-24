'use client';

import { useFullscreen } from '@/hooks/useFullscreen';

export default function FullscreenButton() {
  const { isFullscreen, toggle } = useFullscreen();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 z-40 bg-black/30 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm transition-all"
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? '⤡' : '⤢'}
    </button>
  );
}
