import { useRef, useCallback, useEffect, useState } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { useKeyboard } from '../../hooks/useKeyboard';
import { Controls } from './Controls';
import { SubtitleOverlay } from '../Subtitles/SubtitleOverlay';
import type { usePlayer } from '../../hooks/usePlayer';
import './VideoPlayer.css';

interface Props {
  player: ReturnType<typeof usePlayer>;
}

export function VideoPlayer({ player }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<number>(0);
  const { isPlaying, isLoading, src, showControls, setShowControls, setShowSettings } = usePlayerStore();
  const [showPlayAnim, setShowPlayAnim] = useState(false);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => {
      if (usePlayerStore.getState().isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3000);
  }, [setShowControls, setShowSettings]);

  const handleClick = useCallback(() => {
    player.togglePlay();
    setShowPlayAnim(true);
    setTimeout(() => setShowPlayAnim(false), 400);
  }, [player]);

  const handleDoubleClick = useCallback(() => {
    player.toggleFullscreen(containerRef.current);
  }, [player]);

  useKeyboard({
    togglePlay: player.togglePlay,
    seek: player.seek,
    setVolume: player.setVolume,
    toggleMute: player.toggleMute,
    toggleFullscreen: (container) => player.toggleFullscreen(container),
    togglePiP: player.togglePiP,
    currentTime: usePlayerStore.getState().currentTime,
    duration: usePlayerStore.getState().duration,
    volume: usePlayerStore.getState().volume,
    containerRef,
  });

  useEffect(() => {
    return () => clearTimeout(controlsTimerRef.current);
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'srt' || ext === 'vtt') return;

    const url = URL.createObjectURL(file);
    player.loadSource(url, file.name);
  }, [player]);

  return (
    <div
      ref={containerRef}
      className={`player-container ${showControls ? 'controls-visible' : ''} ${!src ? 'empty' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
          setShowSettings(false);
        }
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={handleFileDrop}
    >
      <video
        ref={player.videoRef}
        className="video-element"
        playsInline
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      />

      {!src && (
        <div className="player-empty">
          <div className="player-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <p className="player-empty-text">Drop a video file or enter a URL to start</p>
          <p className="player-empty-hint">Supports MP4, WebM, MKV, HLS (.m3u8), and DASH (.mpd)</p>
        </div>
      )}

      {isLoading && src && (
        <div className="player-loading">
          <div className="loading-spinner" />
        </div>
      )}

      {showPlayAnim && (
        <div className="play-animation">
          <div className="play-animation-circle">
            {isPlaying ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            )}
          </div>
        </div>
      )}

      <SubtitleOverlay videoRef={player.videoRef} />

      {src && (
        <Controls
          onTogglePlay={player.togglePlay}
          onSeek={player.seek}
          onVolumeChange={player.setVolume}
          onToggleMute={player.toggleMute}
          onToggleFullscreen={() => player.toggleFullscreen(containerRef.current)}
          onTogglePiP={player.togglePiP}
          onSetQuality={player.setQuality}
          onSetPlaybackRate={player.setPlaybackRate}
          onSetAudioTrack={player.setAudioTrack}
        />
      )}
    </div>
  );
}
