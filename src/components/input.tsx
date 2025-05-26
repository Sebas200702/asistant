import { useEffect, useRef, useState } from 'react'

import { MicrophoneIcon } from '@icons/microphone'
import { PlusIcon } from '@icons/plus'
import { SendIcon } from '@icons/send'
import { useChatStore, type Suggestion } from '@store/chat-store'
import { useChatsStore } from '@store/chats-store'
import type { Message } from '../types'
import { navigate } from 'astro:transitions/client'

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



export const Input = () => {
  const [query, setQuery] = useState('')
  const [showSuggestionDropdown, setShowSuggestionDropdown] = useState(false)
  const {
    setIsLoading,
    addMessage,
    editMessage,
    messages,
    activeSuggestion,
    setActiveSuggestion,
    currentChatId,
    setCurrentChatId,
    saveMessageToChat
  } = useChatStore()
  const { createChat } = useChatsStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lineHeight = useRef<number>(24)
  const maxRows = 6
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setQuery('')

    let messageToSend = ''
    let currentSuggestionId: string | undefined = undefined

    if (activeSuggestion && !query.trim()) {
      messageToSend = activeSuggestion.prompt
      currentSuggestionId = activeSuggestion.id
    } else if (query.trim()) {

      messageToSend = query.trim()

      currentSuggestionId = activeSuggestion?.id
    } else {

      return
    }

    setIsLoading(true)

    let chatId = currentChatId
    if (!chatId) {
      const newChat = await createChat(messageToSend.substring(0, 50))
      if (newChat) {
        chatId = newChat.id
        setCurrentChatId(chatId)
      } else {
        setIsLoading(false)
        return
      }
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: messageToSend,
      role: 'user',
      timestamp: new Date().toISOString(),
    }

    addMessage(userMessage)


    if (chatId) {
      saveMessageToChat(userMessage, chatId)
    }

    let reply = ''

    const botMessage: Message = {
      id: crypto.randomUUID(),
      content: reply,
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }
    addMessage(botMessage)

    try {
      const response = await fetch('/api/responseUserMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          suggestionId: currentSuggestionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get reader')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        reply += new TextDecoder().decode(value)
        editMessage(botMessage.id, reply)
      }

      if (chatId && reply) {
        const finalBotMessage = { ...botMessage, content: reply }
        saveMessageToChat(finalBotMessage, chatId)
      }

    } catch (error) {
      console.error('Error:', error)
      const errorMessage = 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor, inténtalo de nuevo.'
      editMessage(botMessage.id, errorMessage)


      if (chatId) {
        const errorBotMessage = { ...botMessage, content: errorMessage }
        saveMessageToChat(errorBotMessage, chatId)
      }
    } finally {
      setIsLoading(false)

      if (window.location.pathname === '/') {
        navigate(`/?chat=${chatId}`)
      }
    }
  }

  const handleClearSuggestion = () => {
    setActiveSuggestion(null)
  }

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setActiveSuggestion(suggestion)
    setShowSuggestionDropdown(false)
  }


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestionDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!textareaRef.current) return

    const style = window.getComputedStyle(textareaRef.current)
    lineHeight.current = parseInt(style.lineHeight, 10) || 24
    textareaRef.current.rows = 1
    const currentLines = Math.floor(
      textareaRef.current.scrollHeight / lineHeight.current
    )
    const newRows = Math.min(Math.max(currentLines, 1), maxRows)
    textareaRef.current.rows = newRows
  }, [query])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }

    textarea.addEventListener('keydown', handleKeyDown)
    return () => textarea.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="bg-gradient-to-t from-gray-50 to-transparent pt-4 sm:pt-6 pb-3 sm:pb-4">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">

        {activeSuggestion && (
          <div className="mb-3 bg-white rounded-xl border border-brand-red-200 p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-6 h-6 ${activeSuggestion.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {activeSuggestion.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-red-700 truncate">
                    {activeSuggestion.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {activeSuggestion.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearSuggestion}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200 flex-shrink-0 mobile-touch-target"
                title="Quitar sugerencia"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form
          ref={formRef}
          className="relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200 focus-within:ring-0.5 focus-within:ring-brand-red-500/50 focus-within:border-brand-red-500/50"
          onSubmit={handleSubmit}
        >
          <div className="flex items-end gap-2 sm:gap-3 p-3 sm:p-4">

            <button
              type="button"
              className="hidden sm:flex flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 mobile-touch-target"
              title="Adjuntar archivo"
            >
              <PlusIcon className="h-5 w-5" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowSuggestionDropdown(!showSuggestionDropdown)}
                className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200 mobile-touch-target ${
                  activeSuggestion
                    ? 'text-brand-red-600 bg-brand-red-50 hover:bg-brand-red-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title="Seleccionar tema de consulta"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Dropdown de sugerencias - responsive */}
              {showSuggestionDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-10 max-w-[calc(100vw-2rem)] sm:max-w-none">
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Temas de consulta</h3>
                    <p className="text-xs text-gray-600 mt-1">Selecciona un tema para obtener respuestas más precisas</p>
                  </div>
                  <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {/* Opción para quitar sugerencia */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSuggestion(null)
                        setShowSuggestionDropdown(false)
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-200 mb-1 mobile-touch-target ${
                        !activeSuggestion
                          ? 'bg-gray-50 border border-gray-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">Consulta general</p>
                          <p className="text-xs text-gray-600">Sin tema específico</p>
                        </div>
                        {!activeSuggestion && (
                          <div className="flex-shrink-0">
                            <svg className="w-4 h-4 text-brand-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Opciones de sugerencias */}
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 mb-1 mobile-touch-target ${
                          activeSuggestion?.id === suggestion.id
                            ? 'bg-brand-red-50 border border-brand-red-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 ${suggestion.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${
                              activeSuggestion?.id === suggestion.id
                                ? 'text-brand-red-700'
                                : 'text-gray-900'
                            }`}>
                              {suggestion.title}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {suggestion.description}
                            </p>
                          </div>
                          {activeSuggestion?.id === suggestion.id && (
                            <div className="flex-shrink-0">
                              <svg className="w-4 h-4 text-brand-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-[44px] max-h-[200px] overflow-hidden">
              <textarea
                ref={textareaRef}
                rows={1}
                spellCheck="false"
                autoCapitalize="sentences"
                autoComplete="off"
                autoCorrect="on"
                placeholder={activeSuggestion ? `Pregunta sobre: ${activeSuggestion.title}` : "Escribe tu mensaje aquí..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full resize-none border-none bg-transparent text-gray-900 placeholder-gray-500 outline-none focus:ring-0 text-sm sm:text-base leading-6 mobile-input"
                style={{ minHeight: '24px' }}
              />
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Botón micrófono - oculto en móvil para ahorrar espacio */}
              <button
                type="button"
                className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 mobile-touch-target"
                title="Grabar audio"
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={!query.trim() && !activeSuggestion}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-red-500 text-white rounded-lg flex items-center justify-center hover:bg-brand-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md mobile-touch-target"
                title="Enviar mensaje"
              >
                <SendIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          {/* Indicador de escritura - responsive */}
          <div className="px-3 sm:px-4 pb-2 sm:pb-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate pr-2">
                {activeSuggestion && !query.trim()
                  ? "Presiona Enter para enviar la pregunta sugerida"
                  : "Presiona Enter para enviar, Shift + Enter para nueva línea"
                }
              </span>
              <span className={`transition-opacity duration-200 flex-shrink-0 ${query.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                {query.length}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
