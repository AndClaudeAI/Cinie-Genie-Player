import { create } from 'zustand';
import type { PlaybackState, QualityLevel, AudioTrack, ViewMode, SubtitleStyle } from '../types';

interface PlayerStore extends PlaybackState {
  src: string;
  title: string;
  viewMode: ViewMode;
  qualityLevels: QualityLevel[];
  currentQuality: number;
  audioTracks: AudioTrack[];
  currentAudioTrack: number;
  showControls: boolean;
  showSettings: boolean;
  subtitleStyle: SubtitleStyle;

  setSrc: (src: string, title?: string) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setBuffered: (buffered: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setFullscreen: (fs: boolean) => void;
  setPiP: (pip: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  setLoading: (loading: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  setQualityLevels: (levels: QualityLevel[]) => void;
  setCurrentQuality: (index: number) => void;
  setAudioTracks: (tracks: AudioTrack[]) => void;
  setCurrentAudioTrack: (id: number) => void;
  setShowControls: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setSubtitleStyle: (style: Partial<SubtitleStyle>) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  src: '',
  title: '',
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  isPiP: false,
  playbackRate: 1,
  isLoading: false,
  viewMode: 'player',
  qualityLevels: [],
  currentQuality: -1,
  audioTracks: [],
  currentAudioTrack: 0,
  showControls: true,
  showSettings: false,
  subtitleStyle: {
    fontSize: 22,
    fontColor: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    fontFamily: 'inherit',
    opacity: 1,
  },

  setSrc: (src, title) => set({ src, title: title ?? '', isLoading: true }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setBuffered: (buffered) => set({ buffered }),
  setVolume: (volume) => set({ volume }),
  setMuted: (isMuted) => set({ isMuted }),
  setFullscreen: (isFullscreen) => set({ isFullscreen }),
  setPiP: (isPiP) => set({ isPiP }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setLoading: (isLoading) => set({ isLoading }),
  setViewMode: (viewMode) => set({ viewMode }),
  setQualityLevels: (qualityLevels) => set({ qualityLevels }),
  setCurrentQuality: (currentQuality) => set({ currentQuality }),
  setAudioTracks: (audioTracks) => set({ audioTracks }),
  setCurrentAudioTrack: (currentAudioTrack) => set({ currentAudioTrack }),
  setShowControls: (showControls) => set({ showControls }),
  setShowSettings: (showSettings) => set({ showSettings }),
  setSubtitleStyle: (style) =>
    set((state) => ({ subtitleStyle: { ...state.subtitleStyle, ...style } })),
}));
