import { Input } from '@components/input'
import { MessagesComponent } from '@components/messages'
import { useChatStore } from '@store/chat-store'
import { useChatsStore } from '@store/chats-store'
import { useEffect, useState } from 'react'

export const Chat = () => {
  const { loadChatMessages, setCurrentChatId, clearMessages } = useChatStore()
  const { setCurrentChatId: setChatsCurrentChatId } = useChatsStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Obtener el chatId de la URL si existe
    const urlParams = new URLSearchParams(window.location.search)
    const chatId = urlParams.get('chat')

    if (chatId) {
      // Cargar mensajes del chat específico
      loadChatMessages(chatId)
      setChatsCurrentChatId(chatId)
    } else {
      // Limpiar mensajes si no hay chat específico
      clearMessages()
      setCurrentChatId(null)
      setChatsCurrentChatId(null)
    }
  }, [loadChatMessages, setCurrentChatId, setChatsCurrentChatId, clearMessages])

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Use global function if available
    if (typeof (window as any).toggleMobileMenu === 'function') {
      (window as any).toggleMobileMenu()
    }
  }

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false)
    // Use global function if available
    if (typeof (window as any).closeMobileMenu === 'function') {
      (window as any).closeMobileMenu()
    }
  }

  return (
    <section className="h-full w-full flex flex-col [grid-area:main] bg-gray-50 max-h-screen overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessagesComponent />
      </div>
      <div className="flex-shrink-0">
        <Input />
      </div>
    </section>
  )
}
