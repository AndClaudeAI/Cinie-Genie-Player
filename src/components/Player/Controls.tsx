import { useState } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SettingsPanel } from './SettingsPanel';
import './Controls.css';

interface Props {
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onSetQuality: (index: number) => void;
  onSetPlaybackRate: (rate: number) => void;
  onSetAudioTrack: (id: number) => void;
}

export function Controls({
  onTogglePlay, onSeek, onVolumeChange, onToggleMute,
  onToggleFullscreen, onTogglePiP,
  onSetQuality, onSetPlaybackRate, onSetAudioTrack,
}: Props) {
  const { isPlaying, isFullscreen, title, audioTracks, showSettings, setShowSettings } = usePlayerStore();
  const [showInfo, setShowInfo] = useState(false);

  const hasAtmos = audioTracks.some(t => t.isDolbyAtmos);

  return (
    <div className="controls-wrapper" onClick={e => e.stopPropagation()}>
      <div className="controls-gradient" />

      <div className="controls-top">
        {title && (
          <div className="controls-title-bar">
            <h2 className="controls-title">{title}</h2>
            {hasAtmos && (
              <span className="audio-badge atmos-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                Dolby Atmos
              </span>
            )}
          </div>
        )}
      </div>

      <div className="controls-bottom">
        <ProgressBar onSeek={onSeek} />

        <div className="controls-bar">
          <div className="controls-left">
            <button className="control-btn" onClick={onTogglePlay} title={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg>
              )}
            </button>

            <VolumeControl onVolumeChange={onVolumeChange} onToggleMute={onToggleMute} />
          </div>

          <div className="controls-right">
            <button
              className="control-btn"
              onClick={() => setShowInfo(!showInfo)}
              title="Info"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            </button>

            <button
              className={`control-btn ${showSettings ? 'active' : ''}`}
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            <button className="control-btn" onClick={onTogglePiP} title="Picture-in-Picture">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><rect x="12" y="9" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" /><rect x="12" y="9" width="8" height="6" rx="1" /></svg>
            </button>

            <button className="control-btn" onClick={onToggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              {isFullscreen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {showSettings && (
        <SettingsPanel
          onSetQuality={(idx) => { onSetQuality(idx); setShowSettings(false); }}
          onSetPlaybackRate={(rate) => { onSetPlaybackRate(rate); setShowSettings(false); }}
          onSetAudioTrack={(id) => { onSetAudioTrack(id); setShowSettings(false); }}
        />
      )}
    </div>
  );
}
