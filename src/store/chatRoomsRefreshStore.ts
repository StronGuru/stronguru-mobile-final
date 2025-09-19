import { create } from 'zustand';

interface ChatRoomsRefreshState {
  refreshKey: number;
  triggerRefresh: () => void;
}

export const useChatRoomsRefreshStore = create<ChatRoomsRefreshState>((set, get) => ({
  refreshKey: 0,
  triggerRefresh: () => set({ refreshKey: get().refreshKey + 1 }),
}));
