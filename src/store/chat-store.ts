import { create } from 'zustand'
import type { Message } from '../types'

export interface Suggestion {
  id: string
  title: string
  description: string
  prompt: string
  icon: React.ReactNode
  bgColor: string
}

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  activeSuggestion: Suggestion | null
  title: string
  currentChatId: string | null
  addMessage: (message: Message) => void
  clearMessages: () => void
  editMessage: (id: string, newMessageContent: string) => void
  setIsLoading: (isLoading: boolean) => void
  setActiveSuggestion: (suggestion: Suggestion | null) => void
  setCurrentChatId: (chatId: string | null) => void
  setMessages: (messages: Message[]) => void
  loadChatMessages: (chatId: string) => void
  saveMessageToChat: (message: Message, chatId: string) => void
}

// Helper functions for localStorage
const getStoredChats = () => {
  try {
    const stored = localStorage.getItem('amelia-chats')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const saveChatsToStorage = (chats: any) => {
  try {
    localStorage.setItem('amelia-chats', JSON.stringify(chats))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  title: '',
  activeSuggestion: null,
  currentChatId: null,

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

  setActiveSuggestion: (suggestion: Suggestion | null) => set({ activeSuggestion: suggestion }),

  setCurrentChatId: (chatId: string | null) => set({ currentChatId: chatId }),

  setMessages: (messages: Message[]) => set({ messages }),

  loadChatMessages: (chatId: string) => {
    try {
      const allChats = getStoredChats()
      const chat = allChats[chatId]

      if (chat) {
        set({
          messages: chat.messages || [],
          currentChatId: chatId,
          title: chat.title || 'Nueva conversación'
        })
      } else {
        set({
          messages: [],
          currentChatId: chatId,
          title: 'Nueva conversación'
        })
      }
    } catch (error) {
      console.error('Error loading chat messages:', error)
      set({ messages: [] })
    }
  },

  saveMessageToChat: (message: Message, chatId: string) => {
    try {
      const allChats = getStoredChats()

      if (!allChats[chatId]) {
        allChats[chatId] = {
          id: chatId,
          title: 'Nueva conversación',
          messages: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }

      allChats[chatId].messages.push(message)
      allChats[chatId].updated_at = new Date().toISOString()

      // Update title with first user message if it's still "Nueva conversación"
      if (allChats[chatId].title === 'Nueva conversación' && message.role === 'user') {
        allChats[chatId].title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
      }

      saveChatsToStorage(allChats)
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }
}))
