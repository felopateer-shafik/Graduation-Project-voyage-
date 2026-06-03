import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  error: null,

  // Actions
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...message,
    }],
  })),

  setTyping: (isTyping) => set({ isTyping }),

  clearMessages: () => set({ messages: [], error: null }),

  setError: (error) => set({ error }),
}));

export default useChatStore;
