type Role = 'user' | 'assistant'
export interface Message {
  id: string
  content: string
  role: Role
  timestamp: string
}

export interface IconProps {
  className?: string
}
