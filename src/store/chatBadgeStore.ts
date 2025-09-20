import { create } from 'zustand';

interface ChatBadgeState {
  maxUnread: number;
  setMaxUnread: (n: number) => void;
}

export const useChatBadgeStore = create<ChatBadgeState>((set) => ({
  maxUnread: 0,
  setMaxUnread: (n) => set({ maxUnread: n }),
}));
