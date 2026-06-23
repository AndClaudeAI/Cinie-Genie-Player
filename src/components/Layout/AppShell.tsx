import { useCallback } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { Sidebar } from '../Sidebar/Sidebar';
import { VideoPlayer } from '../Player/VideoPlayer';
import './AppShell.css';

export function AppShell() {
  const player = usePlayer();

  const handleUrlSubmit = useCallback((url: string, title?: string) => {
    player.loadSource(url, title);
  }, [player]);

  return (
    <div className="app-shell">
      <Sidebar onUrlSubmit={handleUrlSubmit} />
      <main className="app-main">
        <VideoPlayer player={player} />
      </main>
    </div>
  );
}
