import { useState, useCallback } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { useChannelStore } from '../../stores/channelStore';
import './Sidebar.css';

interface Props {
  onUrlSubmit: (url: string, title?: string) => void;
}

export function Sidebar({ onUrlSubmit }: Props) {
  const { viewMode, setViewMode, src } = usePlayerStore();
  const { channels, groups, activeGroup, setActiveGroup, filteredChannels, setActiveChannel, searchQuery, setSearchQuery, loadFromUrl, loadFromM3U, isLoading: channelsLoading } = useChannelStore();
  const [urlInput, setUrlInput] = useState('');
  const [m3uInput, setM3uInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
    }
  }, [urlInput, onUrlSubmit]);

  const handleM3uSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (m3uInput.trim()) {
      loadFromUrl(m3uInput.trim());
      setM3uInput('');
    }
  }, [m3uInput, loadFromUrl]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'm3u' || ext === 'm3u8') {
      file.text().then(text => loadFromM3U(text));
    } else {
      const url = URL.createObjectURL(file);
      onUrlSubmit(url, file.name);
    }
    e.target.value = '';
  }, [loadFromM3U, onUrlSubmit]);

  const handleChannelClick = useCallback((channel: typeof channels[0]) => {
    setActiveChannel(channel);
    onUrlSubmit(channel.url, channel.name);
  }, [setActiveChannel, onUrlSubmit]);

  const displayChannels = filteredChannels();

  return (
    <aside className={`sidebar glass-heavy ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d4aa" />
                  <stop offset="100%" stopColor="#7b2fbe" />
                </linearGradient>
              </defs>
              <polygon points="5 3 19 12 5 21 5 3" fill="url(#logoGrad)" />
            </svg>
          </div>
          {!isCollapsed && <span className="logo-text">Cinie Genie</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isCollapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <>
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${viewMode === 'player' ? 'active' : ''}`}
              onClick={() => setViewMode('player')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              <span>Player</span>
            </button>
            <button
              className={`nav-item ${viewMode === 'iptv' ? 'active' : ''}`}
              onClick={() => setViewMode('iptv')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
              <span>IPTV</span>
            </button>
          </nav>

          <div className="sidebar-content">
            {viewMode === 'player' && (
              <div className="sidebar-section">
                <form className="url-form" onSubmit={handleUrlSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      placeholder="Enter stream URL..."
                      className="glass-input"
                    />
                    <button type="submit" className="input-btn" disabled={!urlInput.trim()}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </button>
                  </div>
                </form>

                <label className="file-upload glass-light">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span>Open File</span>
                  <input type="file" accept="video/*,.m3u,.m3u8,.srt,.vtt" onChange={handleFileUpload} hidden />
                </label>

                {src && (
                  <div className="now-playing glass-light">
                    <div className="now-playing-indicator" />
                    <span className="now-playing-text">Now Playing</span>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'iptv' && (
              <div className="sidebar-section">
                <form className="url-form" onSubmit={handleM3uSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={m3uInput}
                      onChange={e => setM3uInput(e.target.value)}
                      placeholder="M3U playlist URL..."
                      className="glass-input"
                    />
                    <button type="submit" className="input-btn" disabled={!m3uInput.trim()}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    </button>
                  </div>
                </form>

                <label className="file-upload glass-light">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span>Load M3U File</span>
                  <input type="file" accept=".m3u,.m3u8" onChange={handleFileUpload} hidden />
                </label>

                {channelsLoading && (
                  <div className="loading-channels">
                    <div className="loading-spinner small" />
                    <span>Loading channels...</span>
                  </div>
                )}

                {channels.length > 0 && (
                  <>
                    <div className="channel-search">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search channels..."
                        className="search-input"
                      />
                    </div>

                    {groups.length > 0 && (
                      <div className="group-filter">
                        <button
                          className={`group-pill ${activeGroup === null ? 'active' : ''}`}
                          onClick={() => setActiveGroup(null)}
                        >
                          All
                        </button>
                        {groups.map(group => (
                          <button
                            key={group}
                            className={`group-pill ${activeGroup === group ? 'active' : ''}`}
                            onClick={() => setActiveGroup(group)}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="channel-list">
                      {displayChannels.map(channel => (
                        <button
                          key={channel.id}
                          className="channel-item glass-light"
                          onClick={() => handleChannelClick(channel)}
                        >
                          {channel.logo ? (
                            <img src={channel.logo} alt="" className="channel-logo" loading="lazy" />
                          ) : (
                            <div className="channel-logo-fallback">
                              {channel.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="channel-info">
                            <span className="channel-name">{channel.name}</span>
                            {channel.group && <span className="channel-group">{channel.group}</span>}
                          </div>
                        </button>
                      ))}
                      {displayChannels.length === 0 && (
                        <div className="no-channels">No channels found</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
