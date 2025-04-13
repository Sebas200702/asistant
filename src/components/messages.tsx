import { MesssageBox } from '@components/message-box'
import { useChatStore } from '@store/chat-store'
import { useEffect } from 'react'

export const MessagesComponent = () => {
  const { messages } = useChatStore()
  useEffect(() => {
    console.log(messages.map((message) => message.content))
  }, [messages])

  return (
    <ul className="custom-scrollbar flex h-full max-h-180 w-full flex-col gap-6 overflow-y-auto p-4 px-80">
      {messages.length === 0 && (
        <div className="flex h-full w-full -translate-y-10 flex-col items-center justify-center gap-3 text-gray-600">
          <h2 className="text-3xl font-bold text-gray-900">
            Hola soy [Nombre]
          </h2>
          <p className="text-sm text-gray-600">En que puedo ayudarte hoy?</p>
        </div>
      )}
      {messages?.map((message, index) => (
        <MesssageBox
          key={message.id}
          id={message.id}
          content={message.content}
          role={message.role}
          timestamp={message.timestamp}
          avatarUrl={message.avatarUrl}
          isLastMessage={index === messages.length - 1}
        />
      ))}
    </ul>
  )
}
