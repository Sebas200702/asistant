import { MesssageBox } from '@components/message-box'
import { useChatStore, type Suggestion } from '@store/chat-store'
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'

const suggestions: Suggestion[] = [
  {
    id: 'programas',
    title: 'Programas Académicos',
    description: 'Conoce nuestras carreras de pregrado y posgrado',
    prompt: '¿Qué programas académicos ofrece la Universidad de la Costa?',
    icon: (
      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" clipRule="evenodd" />
      </svg>
    ),
    bgColor: 'bg-blue-100'
  },
  {
    id: 'costos',
    title: 'Costos y Matrículas',
    description: 'Información sobre precios y formas de pago',
    prompt: '¿Cuáles son los costos de matrícula en la Universidad de la Costa?',
    icon: (
      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    ),
    bgColor: 'bg-green-100'
  },
  {
    id: 'admisiones',
    title: 'Admisiones',
    description: 'Proceso de inscripción y requisitos de ingreso',
    prompt: '¿Cuál es el proceso de admisión en la Universidad de la Costa?',
    icon: (
      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
    ),
    bgColor: 'bg-purple-100'
  },
  {
    id: 'campus',
    title: 'Campus y Servicios',
    description: 'Instalaciones, bibliotecas y servicios estudiantiles',
    prompt: '¿Qué servicios e instalaciones tiene el campus de la Universidad de la Costa?',
    icon: (
      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
      </svg>
    ),
    bgColor: 'bg-orange-100'
  }
]

export const MessagesComponent = () => {
  const { messages, activeSuggestion, setActiveSuggestion, isLoading } = useChatStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  // 1. Función checkScrollPosition actualizada con useCallback
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const threshold = 100 

    setIsNearBottom(distanceFromBottom <= threshold)
  }, [])

  // 4. Función handleScroll mejorada
  const handleScroll = useCallback(() => {
    checkScrollPosition()
    
    // Solo marcar como scrolled si el usuario se aleja del final
    const container = scrollContainerRef.current
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      
      if (distanceFromBottom > 100) {
        setUserHasScrolled(true)
      } else if (distanceFromBottom <= 10) {
        // Reset si el usuario vuelve muy cerca del final
        setUserHasScrolled(false)
      }
    }
  }, [checkScrollPosition])

  // 2. useLayoutEffect principal reemplazando useEffect
  useLayoutEffect(() => {
    if (messages.length === 0) return

    // Actualizar posición después de cada cambio de mensajes
    checkScrollPosition()

    // Auto scroll si se cumplen las condiciones
    if (messages.length === 1 || (!userHasScrolled && isNearBottom)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, checkScrollPosition, userHasScrolled, isNearBottom])

  // 3. Nuevo useEffect para manejar streaming
  useLayoutEffect(() => {
    if (isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant' && (isNearBottom || !userHasScrolled)) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [isLoading, messages, isNearBottom, userHasScrolled])

  // Efecto para resetear estado cuando no hay mensajes
  useEffect(() => {
    if (messages.length === 0) {
      setUserHasScrolled(false)
      setIsNearBottom(true)
    }
  }, [messages.length])

  // Efecto para detectar cuando termina el streaming y resetear estado si es necesario
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      // Pequeño delay para permitir que el DOM se actualice completamente
      const timer = setTimeout(() => {
        checkScrollPosition()
        // Si terminó el streaming y el usuario no había hecho scroll, mantener en el final
        if (!userHasScrolled) {
          setIsNearBottom(true)
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isLoading, checkScrollPosition, userHasScrolled])

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setActiveSuggestion(suggestion)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
        onScroll={handleScroll}
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-180px)] text-center">
              <div className="mb-6 sm:mb-8 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  ¡Hola! Soy Amelia
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
                  Tu asistente virtual de la Universidad de la Costa. Estoy aquí para ayudarte con información sobre nuestra universidad. ¿En qué puedo asistirte hoy?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl w-full px-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`bg-white rounded-xl p-4 sm:p-5 shadow-sm border transition-all duration-200 text-left group mobile-touch-target ${
                      activeSuggestion?.id === suggestion.id
                        ? 'border-brand-red-500 shadow-md ring-2 ring-brand-red-100'
                        : 'border-gray-100 hover:shadow-md hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 ${suggestion.bgColor} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0`}>
                        <div className="w-4 h-4 sm:w-5 sm:h-5">
                          {suggestion.icon}
                        </div>
                      </div>
                      <h3 className={`font-semibold text-sm sm:text-base transition-colors leading-tight ${
                        activeSuggestion?.id === suggestion.id
                          ? 'text-brand-red-600'
                          : 'text-gray-900 group-hover:text-brand-red-600'
                      }`}>
                        {suggestion.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed">
                      {suggestion.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Mobile helper text */}
              <div className="mt-6 sm:mt-8 px-4">
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                  Selecciona una categoría arriba o escribe tu pregunta directamente en el campo de texto
                </p>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-1 sm:space-y-2">
                {messages.map((message, index) => (
                  <MesssageBox
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    role={message.role}
                    timestamp={message.timestamp}
                    isLastMessage={index === messages.length - 1}
                  />
                ))}
              </ul>
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} className="h-4" />

              {/* Show scroll to bottom button when user is not near bottom */}
              {!isNearBottom && userHasScrolled && messages.length > 0 && (
                <div className="fixed md:bottom-20 right-4 bottom-40 z-10">
                  {/* 5. Botón de scroll actualizado */}
                  <button
                    onClick={() => {
                      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                      setUserHasScrolled(false) // Reset el estado
                      setIsNearBottom(true)
                    }}
                    className="bg-brand-red-500 hover:bg-brand-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 mobile-touch-target"
                    title="Ir al final"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}