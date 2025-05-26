import { MarkdownFormatter } from '@components/markdown-formater'
import { useChatStore } from '@store/chat-store'
import type { Message } from '../types'

export const MesssageBox = ({
  content,
  role,
  timestamp,
  isLastMessage = false,
}: Message & { isLastMessage?: boolean }) => {
  const { isLoading } = useChatStore()

  if (role === 'user') {
    return (
      <li className="flex justify-end mb-4 sm:mb-6">
        <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] md:max-w-[70%] mobile-message">
          <div className="flex flex-col items-end flex-1">
            <div className="bg-brand-red-700 text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg">
              <div className="leading-relaxed text-white text-sm sm:text-base">
                {content}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-2 text-xs text-gray-500">
              <span className="font-medium">Tú</span>
              <span>•</span>
              <span>
                {new Date(timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="flex justify-start mb-6 sm:mb-8 relative">
      <div className="flex items-start gap-3 sm:gap-4 max-w-[95%] md:max-w-[90%] w-full">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-brand-red-500 to-brand-red-600 flex items-center justify-center shadow-md ring-2 ring-brand-red-100">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="mb-2 sm:mb-3">
            <span className="text-sm font-semibold text-brand-red-600">Amelia</span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
        </span>
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="text-gray-800 leading-relaxed text-sm sm:text-base">
              <MarkdownFormatter content={content} />
              {isLastMessage && isLoading && (
                <div className="mt-3 sm:mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full">
                    <div className="w-2 h-2 bg-brand-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-brand-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-brand-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500">Amelia está escribiendo...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Línea sutil de separación - oculta en móvil para mejor espaciado */}
      <div className="absolute bottom-0 left-12 sm:left-14 right-0 h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent hidden sm:block"></div>
    </li>
  )
}
