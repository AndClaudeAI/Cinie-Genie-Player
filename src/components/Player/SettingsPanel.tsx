import { useState } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import type { QualityLevel, AudioTrack } from '../../types';
import './SettingsPanel.css';

interface Props {
  onSetQuality: (index: number) => void;
  onSetPlaybackRate: (rate: number) => void;
  onSetAudioTrack: (id: number) => void;
}

type SettingsTab = 'main' | 'quality' | 'speed' | 'audio' | 'subtitleStyle';

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];

export function SettingsPanel({ onSetQuality, onSetPlaybackRate, onSetAudioTrack }: Props) {
  const {
    qualityLevels, currentQuality,
    audioTracks, currentAudioTrack,
    playbackRate, subtitleStyle, setSubtitleStyle,
  } = usePlayerStore();
  const [tab, setTab] = useState<SettingsTab>('main');

  const renderMain = () => (
    <div className="settings-menu">
      <button className="settings-item" onClick={() => setTab('quality')}>
        <span className="settings-item-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
        </span>
        <span>Quality</span>
        <span className="settings-item-value">
          {currentQuality === -1 ? 'Auto' : qualityLevels[currentQuality]?.label ?? 'Auto'}
        </span>
      </button>
      <button className="settings-item" onClick={() => setTab('speed')}>
        <span className="settings-item-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
        </span>
        <span>Speed</span>
        <span className="settings-item-value">{playbackRate}x</span>
      </button>
      {audioTracks.length > 0 && (
        <button className="settings-item" onClick={() => setTab('audio')}>
          <span className="settings-item-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          </span>
          <span>Audio</span>
          <span className="settings-item-value">{audioTracks[currentAudioTrack]?.name ?? ''}</span>
        </button>
      )}
      <button className="settings-item" onClick={() => setTab('subtitleStyle')}>
        <span className="settings-item-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>
        </span>
        <span>Subtitle Style</span>
      </button>
    </div>
  );

  const renderQuality = () => (
    <div className="settings-submenu">
      <button className="settings-back" onClick={() => setTab('main')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Quality
      </button>
      <button
        className={`settings-option ${currentQuality === -1 ? 'active' : ''}`}
        onClick={() => onSetQuality(-1)}
      >
        Auto
      </button>
      {qualityLevels.map((level: QualityLevel) => (
        <button
          key={level.index}
          className={`settings-option ${currentQuality === level.index ? 'active' : ''}`}
          onClick={() => onSetQuality(level.index)}
        >
          <span>{level.label}</span>
          <span className="settings-option-detail">{level.width}x{level.height}</span>
          {level.height >= 2160 && <span className="badge badge-premium">{level.height >= 4320 ? '8K' : '4K'}</span>}
        </button>
      ))}
    </div>
  );

  const renderSpeed = () => (
    <div className="settings-submenu">
      <button className="settings-back" onClick={() => setTab('main')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Speed
      </button>
      {SPEED_OPTIONS.map(speed => (
        <button
          key={speed}
          className={`settings-option ${playbackRate === speed ? 'active' : ''}`}
          onClick={() => onSetPlaybackRate(speed)}
        >
          {speed === 1 ? 'Normal' : `${speed}x`}
        </button>
      ))}
    </div>
  );

  const renderAudio = () => (
    <div className="settings-submenu">
      <button className="settings-back" onClick={() => setTab('main')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Audio Track
      </button>
      {audioTracks.map((track: AudioTrack) => (
        <button
          key={track.id}
          className={`settings-option ${currentAudioTrack === track.id ? 'active' : ''}`}
          onClick={() => onSetAudioTrack(track.id)}
        >
          <span>{track.name}</span>
          <span className="settings-option-detail">{track.lang}</span>
          {track.isDolbyAtmos && <span className="badge badge-atmos">ATMOS</span>}
        </button>
      ))}
    </div>
  );

  const renderSubtitleStyle = () => (
    <div className="settings-submenu">
      <button className="settings-back" onClick={() => setTab('main')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Subtitle Style
      </button>
      <div className="settings-field">
        <label>Font Size</label>
        <input
          type="range"
          min="14"
          max="40"
          value={subtitleStyle.fontSize}
          onChange={e => setSubtitleStyle({ fontSize: Number(e.target.value) })}
        />
        <span className="settings-field-value">{subtitleStyle.fontSize}px</span>
      </div>
      <div className="settings-field">
        <label>Font Color</label>
        <input
          type="color"
          value={subtitleStyle.fontColor}
          onChange={e => setSubtitleStyle({ fontColor: e.target.value })}
        />
      </div>
      <div className="settings-field">
        <label>Background Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={subtitleStyle.opacity}
          onChange={e => setSubtitleStyle({ opacity: Number(e.target.value) })}
        />
      </div>
    </div>
  );

  return (
    <div className="settings-panel glass-heavy" onClick={e => e.stopPropagation()}>
      {tab === 'main' && renderMain()}
      {tab === 'quality' && renderQuality()}
      {tab === 'speed' && renderSpeed()}
      {tab === 'audio' && renderAudio()}
      {tab === 'subtitleStyle' && renderSubtitleStyle()}
    </div>
  );
}
