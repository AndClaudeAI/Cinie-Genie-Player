import { create } from 'zustand';
import type { Channel } from '../types';
import { parseM3U } from '../services/m3uParser';

interface ChannelStore {
  channels: Channel[];
  groups: string[];
  activeChannel: Channel | null;
  activeGroup: string | null;
  searchQuery: string;
  isLoading: boolean;

  loadFromM3U: (content: string) => void;
  loadFromUrl: (url: string) => Promise<void>;
  setActiveChannel: (channel: Channel) => void;
  setActiveGroup: (group: string | null) => void;
  setSearchQuery: (query: string) => void;
  addChannel: (channel: Channel) => void;
  removeChannel: (id: string) => void;
  filteredChannels: () => Channel[];
}

export const useChannelStore = create<ChannelStore>((set, get) => ({
  channels: [],
  groups: [],
  activeChannel: null,
  activeGroup: null,
  searchQuery: '',
  isLoading: false,

  loadFromM3U: (content) => {
    const channels = parseM3U(content);
    const groups = [...new Set(channels.map(c => c.group).filter(Boolean))] as string[];
    set({ channels, groups, isLoading: false });
  },

  loadFromUrl: async (url) => {
    set({ isLoading: true });
    try {
      const resp = await fetch(url);
      const text = await resp.text();
      get().loadFromM3U(text);
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveChannel: (channel) => set({ activeChannel: channel }),
  setActiveGroup: (group) => set({ activeGroup: group }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, channel],
      groups: [...new Set([...state.groups, channel.group].filter(Boolean))] as string[],
    })),

  removeChannel: (id) =>
    set((state) => ({
      channels: state.channels.filter(c => c.id !== id),
    })),

  filteredChannels: () => {
    const { channels, activeGroup, searchQuery } = get();
    let filtered = channels;
    if (activeGroup) {
      filtered = filtered.filter(c => c.group === activeGroup);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q));
    }
    return filtered;
  },
}));
