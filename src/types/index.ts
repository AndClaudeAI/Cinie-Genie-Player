export interface Channel {
  id: string;
  name: string;
  logo?: string;
  url: string;
  group?: string;
  tvgId?: string;
  tvgName?: string;
}

export interface Subtitle {
  id: string;
  label: string;
  language: string;
  src: string;
  kind: 'subtitles' | 'captions';
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  label: string;
  index: number;
}

export interface AudioTrack {
  id: number;
  name: string;
  lang: string;
  codec?: string;
  channels?: number;
  isDolbyAtmos?: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isPiP: boolean;
  playbackRate: number;
  isLoading: boolean;
}

export type ViewMode = 'player' | 'iptv';

export interface SubtitleStyle {
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  fontFamily: string;
  opacity: number;
}
