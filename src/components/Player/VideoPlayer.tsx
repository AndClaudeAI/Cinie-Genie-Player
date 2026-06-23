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

type SeekAnim = { side: 'left' | 'right'; key: number } | null;

export function VideoPlayer({ player }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<number>(0);
  const tapTimerRef = useRef<number>(0);
  const tapCountRef = useRef(0);
  const lastTapXRef = useRef(0);
  const lastTapWidthRef = useRef(0);
  const touchedRef = useRef(false);
  const { isPlaying, isLoading, src, showControls, setShowControls, setShowSettings } = usePlayerStore();
  const [showPlayAnim, setShowPlayAnim] = useState(false);
  const [seekAnim, setSeekAnim] = useState<SeekAnim>(null);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = window.setTimeout(() => {
      if (usePlayerStore.getState().isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3000);
  }, [setShowControls, setShowSettings]);

  const triggerPlayAnim = useCallback(() => {
    setShowPlayAnim(true);
    setTimeout(() => setShowPlayAnim(false), 400);
  }, []);

  const triggerSeekAnim = useCallback((side: 'left' | 'right') => {
    setSeekAnim({ side, key: Date.now() });
    setTimeout(() => setSeekAnim(null), 600);
  }, []);

  const doSeek = useCallback((seconds: number, side: 'left' | 'right') => {
    const { currentTime } = usePlayerStore.getState();
    player.seek(currentTime + seconds);
    triggerSeekAnim(side);
    resetControlsTimer();
  }, [player, triggerSeekAnim, resetControlsTimer]);

  const doTogglePlay = useCallback(() => {
    player.togglePlay();
    triggerPlayAnim();
    resetControlsTimer();
  }, [player, triggerPlayAnim, resetControlsTimer]);

  const executeSingleTap = useCallback((x: number, width: number) => {
    const zone = x / width;
    if (zone < 0.3) {
      doSeek(-10, 'left');
    } else if (zone > 0.7) {
      doSeek(10, 'right');
    } else {
      doTogglePlay();
    }
  }, [doSeek, doTogglePlay]);

  const executeDoubleTap = useCallback((x: number, width: number) => {
    const zone = x / width;
    if (zone < 0.35) {
      doSeek(-10, 'left');
    } else if (zone > 0.65) {
      doSeek(10, 'right');
    } else {
      player.toggleFullscreen(containerRef.current);
    }
  }, [player, doSeek]);

  const handleTouchStart = useCallback(() => {
    touchedRef.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!src) return;

    const target = e.target as HTMLElement;
    if (target.closest('.controls-bottom') || target.closest('.controls-top') || target.closest('.settings-panel')) {
      return;
    }

    e.preventDefault();

    const touch = e.changedTouches[0];
    if (!touch || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const width = rect.width;

    tapCountRef.current++;
    lastTapXRef.current = x;
    lastTapWidthRef.current = width;

    if (tapCountRef.current === 1) {
      tapTimerRef.current = window.setTimeout(() => {
        if (tapCountRef.current === 1) {
          executeSingleTap(lastTapXRef.current, lastTapWidthRef.current);
        }
        tapCountRef.current = 0;
      }, 250);
    } else if (tapCountRef.current >= 2) {
      clearTimeout(tapTimerRef.current);
      tapCountRef.current = 0;
      executeDoubleTap(x, width);
    }
  }, [src, executeSingleTap, executeDoubleTap]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (touchedRef.current) {
      touchedRef.current = false;
      return;
    }
    if (!src) return;

    const target = e.target as HTMLElement;
    if (target.closest('.controls-bottom') || target.closest('.controls-top') || target.closest('.settings-panel')) {
      return;
    }

    if (e.detail === 1) {
      doTogglePlay();
    }
  }, [src, doTogglePlay]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if (touchedRef.current) return;

    const target = e.target as HTMLElement;
    if (target.closest('.controls-bottom') || target.closest('.controls-top') || target.closest('.settings-panel')) {
      return;
    }

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
    return () => {
      clearTimeout(controlsTimerRef.current);
      clearTimeout(tapTimerRef.current);
    };
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
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
          setShowSettings(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onDragOver={e => e.preventDefault()}
      onDrop={handleFileDrop}
    >
      <video
        ref={player.videoRef}
        className="video-element"
        playsInline
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

      {seekAnim && (
        <div className={`seek-animation ${seekAnim.side}`} key={seekAnim.key}>
          <div className="seek-animation-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              {seekAnim.side === 'left' ? (
                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
              ) : (
                <path d="M11.5 8c2.65 0 5.05.99 6.9 2.6L22 7v9h-9l3.62-3.62c-1.39-1.16-3.16-1.88-5.12-1.88-3.54 0-6.55 2.31-7.6 5.5l-2.37-.78C2.92 11.03 6.85 8 11.5 8z" />
              )}
            </svg>
            <span>10s</span>
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
