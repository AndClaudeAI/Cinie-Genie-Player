import { useState, useEffect, useCallback } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { parseSubtitle } from '../../services/subtitleParser';
import type { SubtitleCue } from '../../types';
import './SubtitleOverlay.css';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function SubtitleOverlay({ videoRef }: Props) {
  const { subtitleStyle } = usePlayerStore();
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [activeCue, setActiveCue] = useState<string>('');
  const [subtitleFile, setSubtitleFile] = useState<string | null>(null);

  const loadSubtitle = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = parseSubtitle(text, file.name);
    setCues(parsed);
    setSubtitleFile(file.name);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || cues.length === 0) {
      setActiveCue('');
      return;
    }

    const update = () => {
      const time = video.currentTime;
      const active = cues.find(c => time >= c.start && time <= c.end);
      setActiveCue(active?.text ?? '');
    };

    video.addEventListener('timeupdate', update);
    return () => video.removeEventListener('timeupdate', update);
  }, [videoRef, cues]);

  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'srt' || ext === 'vtt') {
        e.preventDefault();
        e.stopPropagation();
        loadSubtitle(file);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('drop', handleDrop);
    window.addEventListener('dragover', handleDragOver);
    return () => {
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('dragover', handleDragOver);
    };
  }, [loadSubtitle]);

  return (
    <>
      {activeCue && (
        <div className="subtitle-overlay">
          <div
            className="subtitle-text"
            style={{
              fontSize: `${subtitleStyle.fontSize}px`,
              color: subtitleStyle.fontColor,
              backgroundColor: subtitleStyle.backgroundColor,
              fontFamily: subtitleStyle.fontFamily,
              opacity: subtitleStyle.opacity,
            }}
            dangerouslySetInnerHTML={{ __html: activeCue.replace(/\n/g, '<br/>') }}
          />
        </div>
      )}
      {subtitleFile && (
        <div className="subtitle-indicator">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>
          {subtitleFile}
        </div>
      )}
    </>
  );
}
