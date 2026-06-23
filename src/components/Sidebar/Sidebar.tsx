import { useState, useCallback } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { useChannelStore } from '../../stores/channelStore';
import { pickVideoFiles, pickDirectory, getFileUrl, formatFileSize, isSubtitleFile, type LocalFile } from '../../services/fileSystem';
import logoImg from '../../assets/logo.png';
import './Sidebar.css';

interface Props {
  onUrlSubmit: (url: string, title?: string) => void;
  onSubtitleFile?: (file: File) => void;
}

export function Sidebar({ onUrlSubmit, onSubtitleFile }: Props) {
  const { viewMode, setViewMode, src } = usePlayerStore();
  const { channels, groups, activeGroup, setActiveGroup, filteredChannels, setActiveChannel, searchQuery, setSearchQuery, loadFromUrl, loadFromM3U, isLoading: channelsLoading } = useChannelStore();
  const [urlInput, setUrlInput] = useState('');
  const [m3uInput, setM3uInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [library, setLibrary] = useState<LocalFile[]>([]);
  const [librarySearch, setLibrarySearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);

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

  const handlePickFiles = useCallback(async () => {
    const files = await pickVideoFiles();
    if (files.length === 0) return;

    for (const f of files) {
      if (isSubtitleFile(f.name)) {
        if (onSubtitleFile && f.handle) {
          const file = await f.handle.getFile();
          onSubtitleFile(file);
        }
        continue;
      }
    }

    const videoFiles = files.filter(f => !isSubtitleFile(f.name));
    if (videoFiles.length === 1) {
      const url = await getFileUrl(videoFiles[0]);
      onUrlSubmit(url, videoFiles[0].name);
    } else if (videoFiles.length > 1) {
      setLibrary(prev => {
        const existingNames = new Set(prev.map(f => f.name));
        const newFiles = videoFiles.filter(f => !existingNames.has(f.name));
        return [...prev, ...newFiles];
      });
    }
  }, [onUrlSubmit, onSubtitleFile]);

  const handleBrowseFolder = useCallback(async () => {
    setIsScanning(true);
    const files = await pickDirectory();
    setLibrary(prev => {
      const existingNames = new Set(prev.map(f => f.name));
      const newFiles = files.filter(f => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });
    setIsScanning(false);
  }, []);

  const handlePlayLibraryFile = useCallback(async (file: LocalFile) => {
    const url = await getFileUrl(file);
    const displayName = file.name.split('/').pop() ?? file.name;
    onUrlSubmit(url, displayName);
  }, [onUrlSubmit]);

  const handleChannelClick = useCallback((channel: typeof channels[0]) => {
    setActiveChannel(channel);
    onUrlSubmit(channel.url, channel.name);
  }, [setActiveChannel, onUrlSubmit]);

  const displayChannels = filteredChannels();

  const filteredLibrary = librarySearch
    ? library.filter(f => f.name.toLowerCase().includes(librarySearch.toLowerCase()))
    : library;

  return (
    <aside className={`sidebar glass-heavy ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={logoImg} alt="Cine Genie" className="logo-img" />
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
                      placeholder="Paste stream URL or link..."
                      className="glass-input"
                    />
                    <button type="submit" className="input-btn" disabled={!urlInput.trim()}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </button>
                  </div>
                </form>

                <div className="section-header">
                  <span className="section-title">Quick Actions</span>
                </div>

                <div className="action-cards">
                  <button className="action-card" onClick={handlePickFiles}>
                    <div className="action-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                    </div>
                    <span className="action-card-label">Open Files</span>
                  </button>
                  <button className="action-card" onClick={handleBrowseFolder}>
                    <div className="action-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                    </div>
                    <span className="action-card-label">Browse Folder</span>
                  </button>
                  <label className="action-card">
                    <div className="action-card-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <span className="action-card-label">Upload</span>
                    <input type="file" accept="video/*,.m3u,.m3u8,.srt,.vtt" onChange={handleFileUpload} hidden />
                  </label>
                </div>

                {src && (
                  <div className="now-playing-card">
                    <div className="now-playing-indicator" />
                    <span className="now-playing-text">Now Playing</span>
                  </div>
                )}

                {isScanning && (
                  <div className="loading-channels">
                    <div className="loading-spinner small" />
                    <span>Scanning folder...</span>
                  </div>
                )}

                {library.length > 0 && (
                  <>
                    <div className="section-header">
                      <span className="section-title">Your Library</span>
                      <button className="section-action" onClick={() => setLibrary([])}>Clear All</button>
                    </div>

                    {library.length > 5 && (
                      <div className="search-bar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                          type="text"
                          value={librarySearch}
                          onChange={e => setLibrarySearch(e.target.value)}
                          placeholder="Search library..."
                          className="search-input"
                        />
                      </div>
                    )}

                    <div className="content-list">
                      {filteredLibrary.map((file, idx) => (
                        <button
                          key={`${file.name}-${idx}`}
                          className="content-item"
                          onClick={() => handlePlayLibraryFile(file)}
                        >
                          <div className="content-item-thumb">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          </div>
                          <div className="content-item-info">
                            <span className="content-item-name">{file.name.split('/').pop()}</span>
                            <span className="content-item-meta">{formatFileSize(file.size)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
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

                <label className="upload-card">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  <span>Load M3U Playlist File</span>
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
                    <div className="section-header">
                      <span className="section-title">Channels</span>
                      <span className="section-count">{channels.length}</span>
                    </div>

                    <div className="search-bar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search channels..."
                        className="search-input"
                      />
                    </div>

                    {groups.length > 0 && (
                      <div className="category-pills">
                        <button
                          className={`pill ${activeGroup === null ? 'active' : ''}`}
                          onClick={() => setActiveGroup(null)}
                        >
                          All
                        </button>
                        {groups.map(group => (
                          <button
                            key={group}
                            className={`pill ${activeGroup === group ? 'active' : ''}`}
                            onClick={() => setActiveGroup(group)}
                          >
                            {group}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="content-list">
                      {displayChannels.map(channel => (
                        <button
                          key={channel.id}
                          className="content-item"
                          onClick={() => handleChannelClick(channel)}
                        >
                          {channel.logo ? (
                            <img src={channel.logo} alt="" className="content-item-logo" loading="lazy" />
                          ) : (
                            <div className="content-item-thumb channel-thumb">
                              {channel.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="content-item-info">
                            <span className="content-item-name">{channel.name}</span>
                            {channel.group && <span className="content-item-meta">{channel.group}</span>}
                          </div>
                        </button>
                      ))}
                      {displayChannels.length === 0 && (
                        <div className="empty-state">No channels found</div>
                      )}
                    </div>
                  </>
                )}

                {channels.length === 0 && !channelsLoading && (
                  <div className="empty-state">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                      <circle cx="12" cy="12" r="2" />
                      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                    </svg>
                    <p>Add an M3U playlist to get started</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
