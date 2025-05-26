import { create } from 'zustand'
import type { Chat, ChatWithPreview } from '../types/chat'

interface ChatsStore {
  chats: ChatWithPreview[]
  currentChatId: string | null
  currentChat: Chat | null
  isLoadingChats: boolean

  // Actions
  setChats: (chats: ChatWithPreview[]) => void
  addChat: (chat: Chat) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  deleteChat: (chatId: string) => void
  setCurrentChatId: (chatId: string | null) => void
  setCurrentChat: (chat: Chat | null) => void
  setIsLoadingChats: (loading: boolean) => void

  // Local storage operations
  fetchChats: () => Promise<void>
  createChat: (title?: string) => Promise<Chat | null>
  updateChatTitle: (chatId: string, title: string) => Promise<void>
  removeChatById: (chatId: string) => Promise<void>
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

const convertToPreview = (chat: any): ChatWithPreview => {
  const messages = chat.messages || []
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null

  return {
    id: chat.id,
    title: chat.title,
    created_at: chat.created_at,
    updated_at: chat.updated_at,
    lastMessage,
    messageCount: messages.length
  }
}

export const useChatsStore = create<ChatsStore>((set, get) => ({
  chats: [],
  currentChatId: null,
  currentChat: null,
  isLoadingChats: false,

  setChats: (chats) => set({ chats }),

  addChat: (chat) => set((state) => ({
    chats: [
      {
        ...chat,
        lastMessage: null,
        messageCount: 0
      },
      ...state.chats
    ]
  })),

  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map(chat =>
      chat.id === chatId ? { ...chat, ...updates } : chat
    ),
    currentChat: state.currentChat?.id === chatId
      ? { ...state.currentChat, ...updates }
      : state.currentChat
  })),

  deleteChat: (chatId) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== chatId),
    currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
    currentChat: state.currentChat?.id === chatId ? null : state.currentChat
  })),

  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  setCurrentChat: (chat) => set({ currentChat: chat }),

  setIsLoadingChats: (loading) => set({ isLoadingChats: loading }),

  fetchChats: async () => {
    set({ isLoadingChats: true })
    try {
      // Simulate async operation for consistency
      await new Promise(resolve => setTimeout(resolve, 100))

      const allChats = getStoredChats()
      const chatPreviews = Object.values(allChats)
        .map((chat: any) => convertToPreview(chat))
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

      set({ chats: chatPreviews })
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      set({ isLoadingChats: false })
    }
  },

  createChat: async (title?: string) => {
    try {
      const chatId = crypto.randomUUID()
      const now = new Date().toISOString()

      const newChat: Chat = {
        id: chatId,
        title: title || 'Nueva conversación',
        created_at: now,
        updated_at: now
      }

      const allChats = getStoredChats()
      allChats[chatId] = {
        ...newChat,
        messages: []
      }

      saveChatsToStorage(allChats)
      get().addChat(newChat)

      return newChat
    } catch (error) {
      console.error('Error creating chat:', error)
      return null
    }
  },

  updateChatTitle: async (chatId: string, title: string) => {
    try {
      const allChats = getStoredChats()

      if (allChats[chatId]) {
        allChats[chatId].title = title
        allChats[chatId].updated_at = new Date().toISOString()
        saveChatsToStorage(allChats)

        get().updateChat(chatId, { title, updated_at: allChats[chatId].updated_at })
      }
    } catch (error) {
      console.error('Error updating chat:', error)
    }
  },

  removeChatById: async (chatId: string) => {
    try {
      const allChats = getStoredChats()
      delete allChats[chatId]
      saveChatsToStorage(allChats)

      get().deleteChat(chatId)
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }
}))
