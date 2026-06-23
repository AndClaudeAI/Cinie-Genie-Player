import { useCallback } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { usePlayerStore } from '../../stores/playerStore';
import { Sidebar } from '../Sidebar/Sidebar';
import { VideoPlayer } from '../Player/VideoPlayer';
import logoImg from '../../assets/logo.png';
import './AppShell.css';

export function AppShell() {
  const player = usePlayer();
  const { viewMode, setViewMode } = usePlayerStore();

  const handleUrlSubmit = useCallback((url: string, title?: string) => {
    player.loadSource(url, title);
  }, [player]);

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <div className="mobile-header-left">
          <img src={logoImg} alt="Cine Genie" className="mobile-logo" />
          <span className="mobile-brand">Cine Genie</span>
        </div>
      </header>

      <Sidebar onUrlSubmit={handleUrlSubmit} />

      <main className="app-main">
        <VideoPlayer player={player} />
      </main>

      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item ${viewMode === 'player' ? 'active' : ''}`}
          onClick={() => setViewMode('player')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={viewMode === 'player' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Player</span>
        </button>
        <button
          className={`bottom-nav-item ${viewMode === 'iptv' ? 'active' : ''}`}
          onClick={() => setViewMode('iptv')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Live TV</span>
        </button>
      </nav>
    </div>
  );
}
