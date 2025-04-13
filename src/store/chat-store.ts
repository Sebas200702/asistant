import { create } from 'zustand'
import type { Message } from '../types'

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  addMessage: (message: Message) => void
  clearMessages: () => void
  editMessage: (id: string, newMessageContent: string) => void
  setIsLoading: (isLoading: boolean) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  editMessage: (id: string, newMessageContent: string) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, content: newMessageContent } : message
      ),
    })),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}))
