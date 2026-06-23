# Cinie Genie Player

A sophisticated streaming video player with an ITVX-inspired glassmorphism UI. Functions as both an IPTV player and a standalone video player.

## Features

- **Streaming-Platform UI** - Dark theme with glassmorphism/liquid glass effects inspired by ITVX
- **Dual Mode** - Switch between standard Player mode and IPTV mode
- **Up to 8K Video** - HLS adaptive streaming with quality selection up to 8K UHD
- **IPTV Support** - Load M3U/M3U8 playlists, browse channels by group, search and filter
- **Subtitles & Captions** - SRT and VTT subtitle support with customizable styling
- **Dolby Atmos** - Audio codec detection with Dolby Atmos/surround indicators
- **Full Controls** - Play/pause, seek, volume, fullscreen, picture-in-picture, playback speed
- **Keyboard Shortcuts** - Space/K (play), F (fullscreen), M (mute), arrows (seek/volume), J/L (skip)
- **Drag & Drop** - Drop video files or subtitle files directly onto the player

## Tech Stack

- React 19 + TypeScript
- Vite
- HLS.js for adaptive streaming
- Zustand for state management

## Getting Started

```bash
npm install
npm run dev
```

## Usage

### Player Mode
- Enter a stream URL (HLS, DASH, MP4, WebM) in the sidebar
- Or drag and drop a video file onto the player
- Drop .srt or .vtt files to add subtitles

### IPTV Mode
- Switch to IPTV tab in the sidebar
- Enter an M3U playlist URL or upload an M3U file
- Browse, search, and filter channels by group
- Click a channel to start watching
