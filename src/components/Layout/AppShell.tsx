import { useCallback } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { usePlayerStore } from '../../stores/playerStore';
import { Sidebar } from '../Sidebar/Sidebar';
import { VideoPlayer } from '../Player/VideoPlayer';
import logoImg from '../../assets/logo.png';
import './AppShell.css';

export function AppShell() {
  const player = usePlayer();
  const { viewMode, setViewMode, src, title } = usePlayerStore();

  const handleUrlSubmit = useCallback((url: string, title?: string) => {
    player.loadSource(url, title);
  }, [player]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar-left">
          <img src={logoImg} alt="Cine Genie" className="top-bar-logo" />
          <span className="top-bar-brand">cine genie</span>
        </div>
      </header>

      <div className="content-scroll">
        <div className={`player-card ${!src ? 'player-card--hero' : ''}`}>
          <VideoPlayer player={player} />
        </div>

        <Sidebar onUrlSubmit={handleUrlSubmit} />
      </div>

      {src && title && (
        <div className="now-playing-bar">
          <div className="npb-left">
            <div className="npb-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="npb-info">
              <span className="npb-title">{title}</span>
              <span className="npb-label">CONTINUE WATCHING</span>
            </div>
          </div>
          <button className="npb-close" onClick={() => player.loadSource('', '')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <nav className="bottom-nav">
        <button
          className={`bottom-nav-item ${viewMode === 'player' ? 'active' : ''}`}
          onClick={() => setViewMode('player')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={viewMode === 'player' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            {viewMode !== 'player' && <polyline points="9 22 9 12 15 12 15 22" />}
          </svg>
          <span>Home</span>
        </button>
        <button
          className={`bottom-nav-item ${viewMode === 'iptv' ? 'active' : ''}`}
          onClick={() => setViewMode('iptv')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={viewMode === 'iptv' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="2" />
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
          </svg>
          <span>Live TV</span>
        </button>
      </nav>
    </div>
  );
}
