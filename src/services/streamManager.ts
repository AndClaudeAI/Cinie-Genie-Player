import Hls from 'hls.js';
import type { QualityLevel, AudioTrack } from '../types';

export class StreamManager {
  private hls: Hls | null = null;
  private video: HTMLVideoElement | null = null;

  attach(video: HTMLVideoElement, src: string): Promise<void> {
    this.detach();
    this.video = video;

    if (src.includes('.m3u8') || src.includes('m3u8')) {
      if (Hls.isSupported()) {
        return this.attachHls(video, src);
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return Promise.resolve();
      }
    }

    video.src = src;
    return Promise.resolve();
  }

  private attachHls(video: HTMLVideoElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hls = new Hls({
        maxBufferLength: 60,
        maxMaxBufferLength: 120,
        enableWorker: true,
        lowLatencyMode: false,
        capLevelToPlayerSize: false,
        maxBufferSize: 120 * 1000 * 1000,
      });

      this.hls.loadSource(src);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => resolve());
      this.hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              this.hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              this.hls?.recoverMediaError();
              break;
            default:
              reject(new Error(`Fatal HLS error: ${data.details}`));
              this.detach();
              break;
          }
        }
      });
    });
  }

  getQualityLevels(): QualityLevel[] {
    if (!this.hls) return [];
    return this.hls.levels.map((level, index) => ({
      height: level.height,
      width: level.width,
      bitrate: level.bitrate,
      label: this.getResolutionLabel(level.height),
      index,
    }));
  }

  setQualityLevel(index: number): void {
    if (this.hls) {
      this.hls.currentLevel = index;
    }
  }

  setAutoQuality(): void {
    if (this.hls) {
      this.hls.currentLevel = -1;
    }
  }

  getCurrentQuality(): number {
    return this.hls?.currentLevel ?? -1;
  }

  getAudioTracks(): AudioTrack[] {
    if (!this.hls) return [];
    return this.hls.audioTracks.map((track, id) => ({
      id,
      name: track.name || `Track ${id + 1}`,
      lang: track.lang || 'unknown',
      codec: track.audioCodec ?? undefined,
      isDolbyAtmos: this.isDolbyAtmosCodec(track.audioCodec),
    }));
  }

  setAudioTrack(id: number): void {
    if (this.hls) {
      this.hls.audioTrack = id;
    }
  }

  detach(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.video) {
      this.video.removeAttribute('src');
      this.video.load();
      this.video = null;
    }
  }

  private getResolutionLabel(height: number): string {
    if (height >= 4320) return '8K';
    if (height >= 2160) return '4K';
    if (height >= 1440) return '1440p';
    if (height >= 1080) return '1080p';
    if (height >= 720) return '720p';
    if (height >= 480) return '480p';
    if (height >= 360) return '360p';
    return `${height}p`;
  }

  private isDolbyAtmosCodec(codec?: string | null): boolean {
    if (!codec) return false;
    const lower = codec.toLowerCase();
    return lower.includes('ec-3') || lower.includes('ac-3') || lower.includes('eac3');
  }
}
