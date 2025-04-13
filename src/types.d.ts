type Role = 'user' | 'assistant'
export interface Message {
  id: `${string}-${string}-${string}-${string}-${string}`
  content: string
  role: Role
  timestamp: string
  avatarUrl?: string
}

export interface IconProps {
  className?: string
}
