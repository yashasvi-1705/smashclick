'use client';

import { useEffect } from 'react';

export function usePreventExit() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!document.fullscreenElement) return;

      // Suppress Ctrl+W, Cmd+W, Ctrl+Q, Cmd+Q
      if ((e.ctrlKey || e.metaKey) && ['w', 'q', 'W', 'Q'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (document.fullscreenElement) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handler, true);
    window.addEventListener('beforeunload', beforeUnload);

    return () => {
      window.removeEventListener('keydown', handler, true);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, []);
}
