export interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  chat_id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  updated_at?: string
}

export interface ChatWithPreview extends Chat {
  lastMessage: {
    content: string
    created_at: string
    role: 'user' | 'assistant'
  } | null
  messageCount: number
}

export interface ChatResponse {
  success: boolean
  data: {
    chat: Chat
    messages: ChatMessage[]
  }
  error?: string
  code?: string
}

export interface ChatsListResponse {
  success: boolean
  data: {
    chats: ChatWithPreview[]
  }
  error?: string
  code?: string
}

export interface CreateChatRequest {
  title: string
}

export interface UpdateChatRequest {
  title: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  code: string
}
