import { useRef, useState, useCallback } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { formatTime } from '../../utils/formatTime';
import './ProgressBar.css';

interface Props {
  onSeek: (time: number) => void;
}

export function ProgressBar({ onSeek }: Props) {
  const { currentTime, duration, buffered } = usePlayerStore();
  const barRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferProgress = duration > 0 ? (buffered / duration) * 100 : 0;

  const getTimeFromEvent = useCallback((e: React.MouseEvent | MouseEvent) => {
    const bar = barRef.current;
    if (!bar || !duration) return 0;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    return (x / rect.width) * duration;
  }, [duration]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const time = getTimeFromEvent(e);
    setHoverTime(time);
    const rect = barRef.current?.getBoundingClientRect();
    if (rect) setHoverX(e.clientX - rect.left);
  }, [getTimeFromEvent]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const time = getTimeFromEvent(e);
    onSeek(time);

    const handleMove = (ev: MouseEvent) => {
      const t = getTimeFromEvent(ev);
      onSeek(t);
    };

    const handleUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [getTimeFromEvent, onSeek]);

  return (
    <div className="progress-bar-wrapper">
      <span className="progress-time">{formatTime(currentTime)}</span>
      <div
        ref={barRef}
        className={`progress-bar ${isDragging ? 'dragging' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverTime(null)}
        onMouseDown={handleMouseDown}
      >
        <div className="progress-track">
          <div className="progress-buffer" style={{ width: `${bufferProgress}%` }} />
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <div className="progress-thumb" />
          </div>
        </div>
        {hoverTime !== null && (
          <div className="progress-tooltip" style={{ left: `${hoverX}px` }}>
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <span className="progress-time">{formatTime(duration)}</span>
    </div>
  );
}
