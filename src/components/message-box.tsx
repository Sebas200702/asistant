import { MarkdownFormatter } from '@components/markdown-formater'
import { useChatStore } from '@store/chat-store'
import type { Message } from '../types'

export const MesssageBox = ({
  content,
  role,
  timestamp,
  avatarUrl,
  isLastMessage = false,
}: Message & { isLastMessage?: boolean }) => {
  const { isLoading } = useChatStore()
  return (
    <li
      className={`flex flex-col gap-1 ${
        role === 'user'
          ? 'max-w-[500px] min-w-[200px] self-end rounded-2xl bg-gradient-to-br from-red-50 to-red-100 px-5 py-4 shadow-md ring-1 ring-red-200'
          : 'w-full text-gray-700'
      }`}
    >
      <header
        className={`mb-1 flex flex-row ${role === 'user' ? 'self-end' : ''} items-center gap-2 text-xs`}
      >
        <span
          className={`font-semibold capitalize ${
            role === 'user' ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {role}
        </span>
        <span className="text-gray-400">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </header>

      <div className="leading-relaxed tracking-wide whitespace-pre-wrap">
        <MarkdownFormatter content={content} />
        {isLastMessage && isLoading && role === 'assistant' && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-gray-400"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="h-2 w-2 animate-pulse rounded-full bg-gray-400"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        )}
      </div>
    </li>
  )
}
