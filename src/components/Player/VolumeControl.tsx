import { useRef, useState, useCallback } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import './VolumeControl.css';

interface Props {
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({ onVolumeChange, onToggleMute }: Props) {
  const { volume, isMuted } = usePlayerStore();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return 'volume-x';
    if (volume < 0.33) return 'volume';
    if (volume < 0.66) return 'volume-1';
    return 'volume-2';
  };

  const handleSliderClick = useCallback((e: React.MouseEvent) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onVolumeChange(vol);
  }, [onVolumeChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleSliderClick(e);

    const handleMove = (ev: MouseEvent) => {
      const slider = sliderRef.current;
      if (!slider) return;
      const rect = slider.getBoundingClientRect();
      const vol = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      onVolumeChange(vol);
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [handleSliderClick, onVolumeChange]);

  const icon = getVolumeIcon();

  return (
    <div
      className="volume-control"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="control-btn" onClick={onToggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {icon === 'volume-x' && (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
          {icon === 'volume' && (
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          )}
          {icon === 'volume-1' && (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          )}
          {icon === 'volume-2' && (
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          )}
        </svg>
      </button>
      <div className={`volume-slider-container ${isHovered ? 'visible' : ''}`}>
        <div
          ref={sliderRef}
          className="volume-slider"
          onMouseDown={handleMouseDown}
        >
          <div className="volume-track">
            <div className="volume-fill" style={{ width: `${effectiveVolume * 100}%` }}>
              <div className="volume-thumb" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
