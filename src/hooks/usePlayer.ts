import { useRef, useCallback, useEffect } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { StreamManager } from '../services/streamManager';

export function usePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef(new StreamManager());
  const store = usePlayerStore();

  const loadSource = useCallback(async (src: string, title?: string) => {
    const video = videoRef.current;
    if (!video) return;

    store.setSrc(src, title);
    try {
      await streamRef.current.attach(video, src);
      store.setQualityLevels(streamRef.current.getQualityLevels());
      store.setAudioTracks(streamRef.current.getAudioTracks());
      store.setLoading(false);
    } catch {
      store.setLoading(false);
    }
  }, [store]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.max(0, Math.min(1, vol));
    store.setVolume(video.volume);
    if (video.volume > 0 && video.muted) {
      video.muted = false;
      store.setMuted(false);
    }
  }, [store]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    store.setMuted(video.muted);
  }, [store]);

  const toggleFullscreen = useCallback(async (container: HTMLElement | null) => {
    if (!container) return;
    if (!document.fullscreenElement) {
      await container.requestFullscreen();
      store.setFullscreen(true);
    } else {
      await document.exitFullscreen();
      store.setFullscreen(false);
    }
  }, [store]);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      store.setPiP(false);
    } else {
      await video.requestPictureInPicture();
      store.setPiP(true);
    }
  }, [store]);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    store.setPlaybackRate(rate);
  }, [store]);

  const setQuality = useCallback((index: number) => {
    if (index === -1) {
      streamRef.current.setAutoQuality();
    } else {
      streamRef.current.setQualityLevel(index);
    }
    store.setCurrentQuality(index);
  }, [store]);

  const setAudioTrack = useCallback((id: number) => {
    streamRef.current.setAudioTrack(id);
    store.setCurrentAudioTrack(id);
  }, [store]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlers: [string, EventListener][] = [
      ['play', () => store.setPlaying(true)],
      ['pause', () => store.setPlaying(false)],
      ['timeupdate', () => store.setCurrentTime(video.currentTime)],
      ['durationchange', () => store.setDuration(video.duration)],
      ['volumechange', () => {
        store.setVolume(video.volume);
        store.setMuted(video.muted);
      }],
      ['waiting', () => store.setLoading(true)],
      ['canplay', () => store.setLoading(false)],
      ['progress', () => {
        if (video.buffered.length > 0) {
          store.setBuffered(video.buffered.end(video.buffered.length - 1));
        }
      }],
      ['enterpictureinpicture', () => store.setPiP(true)],
      ['leavepictureinpicture', () => store.setPiP(false)],
    ];

    for (const [event, handler] of handlers) {
      video.addEventListener(event, handler);
    }

    return () => {
      for (const [event, handler] of handlers) {
        video.removeEventListener(event, handler);
      }
    };
  }, [store]);

  useEffect(() => {
    const onFullscreenChange = () => {
      store.setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [store]);

  useEffect(() => {
    return () => streamRef.current.detach();
  }, []);

  return {
    videoRef,
    loadSource,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
    togglePiP,
    setPlaybackRate,
    setQuality,
    setAudioTrack,
  };
}
