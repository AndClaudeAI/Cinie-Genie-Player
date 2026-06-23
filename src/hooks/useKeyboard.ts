import { useEffect } from 'react';

interface KeyboardActions {
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleFullscreen: (container: HTMLElement | null) => void;
  togglePiP: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function useKeyboard(actions: KeyboardActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          actions.togglePlay();
          break;
        case 'f':
          e.preventDefault();
          actions.toggleFullscreen(actions.containerRef.current);
          break;
        case 'm':
          e.preventDefault();
          actions.toggleMute();
          break;
        case 'p':
          if (e.shiftKey) {
            e.preventDefault();
            actions.togglePiP();
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          actions.seek(actions.currentTime - 10);
          break;
        case 'arrowright':
          e.preventDefault();
          actions.seek(actions.currentTime + 10);
          break;
        case 'arrowup':
          e.preventDefault();
          actions.setVolume(Math.min(1, actions.volume + 0.05));
          break;
        case 'arrowdown':
          e.preventDefault();
          actions.setVolume(Math.max(0, actions.volume - 0.05));
          break;
        case 'j':
          e.preventDefault();
          actions.seek(actions.currentTime - 10);
          break;
        case 'l':
          e.preventDefault();
          actions.seek(actions.currentTime + 10);
          break;
        case '0':
        case 'home':
          e.preventDefault();
          actions.seek(0);
          break;
        case 'end':
          e.preventDefault();
          actions.seek(actions.duration);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);
}
