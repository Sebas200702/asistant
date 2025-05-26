import { useEffect, useState } from 'react'
import { useChatsStore } from '@store/chats-store'
import { useChatStore } from '@store/chat-store'
import type { ChatWithPreview } from '../types/chat'
import { navigate } from 'astro:transitions/client'

interface AsideProps {
  isOpen?: boolean
  onClose?: () => void
}

interface DeleteModalProps {
  isOpen: boolean
  chatTitle: string
  onConfirm: () => void
  onCancel: () => void
}

const DeleteModal = ({ isOpen, chatTitle, onConfirm, onCancel }: DeleteModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in-0 zoom-in-95 duration-200 mobile-modal">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Eliminar conversación</h3>
            <p className="text-sm text-gray-600 mt-1">Esta acción no se puede deshacer</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            ¿Estás seguro de que quieres eliminar la conversación{' '}
            <span className="font-medium text-gray-900">"{chatTitle}"</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Se eliminarán todos los mensajes de esta conversación permanentemente.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 mobile-touch-target"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-sm mobile-touch-target"
          >
            Eliminar conversación
          </button>
        </div>
      </div>
    </div>
  )
}

export const Aside = ({ isOpen = false, onClose }: AsideProps) => {
  const {
    chats,
    currentChatId,
    isLoadingChats,
    fetchChats,
    createChat,
    updateChatTitle,
    removeChatById,
    setCurrentChatId
  } = useChatsStore()

  const { clearMessages } = useChatStore()
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    chatId: string | null
    chatTitle: string
  }>({
    isOpen: false,
    chatId: null,
    chatTitle: ''
  })

  useEffect(() => {
    fetchChats().then(() => {
      setHasLoadedOnce(true)
    })
  }, [fetchChats])

  const handleNewChat = async () => {
    const newChat = await createChat()
    if (newChat) {
      setCurrentChatId(newChat.id)
      clearMessages()
      navigate(`/?chat=${newChat.id}`)
      // Close mobile menu after creating chat
      if (onClose) onClose()
    }
  }

  const handleChatClick = (chatId: string) => {
    setCurrentChatId(chatId)
    clearMessages()
    navigate(`/?chat=${chatId}`)
    // Close mobile menu after selecting chat
    if (onClose) onClose()
  }

  const handleEditStart = (chat: ChatWithPreview) => {
    setEditingChatId(chat.id)
    setEditTitle(chat.title)
  }

  const handleEditSave = async (chatId: string) => {
    if (editTitle.trim()) {
      await updateChatTitle(chatId, editTitle.trim())
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  const handleDeleteClick = (chat: ChatWithPreview) => {
    setDeleteModal({
      isOpen: true,
      chatId: chat.id,
      chatTitle: chat.title
    })
  }

  const handleDeleteConfirm = async () => {
    if (deleteModal.chatId) {
      await removeChatById(deleteModal.chatId)
      if (currentChatId === deleteModal.chatId) {
        setCurrentChatId(null)
        clearMessages()
        navigate('/')
      }
    }
    setDeleteModal({ isOpen: false, chatId: null, chatTitle: '' })
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, chatId: null, chatTitle: '' })
  }

  const formatLastMessage = (content: string) => {
    return content.length > 45 ? content.substring(0, 45) + '...' : content
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return 'Hoy'
    } else if (diffDays === 2) {
      return 'Ayer'
    } else if (diffDays <= 7) {
      return `${diffDays - 1}d`
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      })
    }
  }

  // Solo mostrar loading si es la primera carga y no hay chats
  const shouldShowLoading = isLoadingChats && !hasLoadedOnce && chats.length === 0

  return (
    <>
      <aside
        className={`w-full [grid-area:sidebar] bg-white border-r border-gray-200 shadow-sm md:relative md:translate-x-0 ${
          isOpen ? 'sidebar-open' : ''
        }`}
        data-grid-area="sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 mobile-spacing">
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mobile-touch-target z-10"
              aria-label="Cerrar menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-4 mt-10 md:mt-0 py-3 bg-gradient-to-r from-brand-red-500 to-brand-red-600 hover:from-brand-red-600 hover:to-brand-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] mobile-touch-target"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Nueva conversación</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {shouldShowLoading ? (
              <div className="p-3 space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="p-6 text-center mobile-spacing">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">No hay conversaciones</h3>
                  <p className="text-sm text-gray-500">
                    Inicia una nueva conversación con Amelia para comenzar
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative rounded-xl transition-all duration-200 ${
                      currentChatId === chat.id
                        ? 'bg-gradient-to-r from-brand-red-50 to-brand-red-25 border-2 border-brand-red-200 shadow-sm'
                        : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-100'
                    }`}
                  >
                    {editingChatId === chat.id ? (
                      <div className="p-4 mobile-spacing">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(chat.id)
                            if (e.key === 'Escape') handleEditCancel()
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-transparent mobile-input"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditSave(chat.id)}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-brand-red-500 text-white rounded-md hover:bg-brand-red-600 transition-colors mobile-touch-target"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mobile-touch-target"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleChatClick(chat.id)}
                          className="w-full p-4 text-left mobile-spacing mobile-touch-target"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-semibold text-sm truncate pr-3 leading-tight ${
                              currentChatId === chat.id ? 'text-brand-red-700' : 'text-gray-900'
                            }`}>
                              {chat.title}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 font-medium">
                              {formatDate(chat.updated_at)}
                            </span>
                          </div>

                          {chat.lastMessage && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                chat.lastMessage.role === 'user' ? 'bg-brand-red-400' : 'bg-gray-400'
                              }`} />
                              <p className="text-xs text-gray-600 truncate leading-relaxed">
                                {formatLastMessage(chat.lastMessage.content)}
                              </p>
                            </div>
                          )}

                          {chat.messageCount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">
                                {chat.messageCount} mensaje{chat.messageCount !== 1 ? 's' : ''}
                              </span>
                              {currentChatId === chat.id && (
                                <div className="w-2 h-2 bg-brand-red-500 rounded-full"></div>
                              )}
                            </div>
                          )}
                        </button>

                        {/* Actions Menu */}
                        <div className="absolute top-3 right-3  group-hover:opacity-100 md:group-hover:opacity-100 opacity-100 md:opacity-0 transition-opacity duration-200">
                          <div className="flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditStart(chat)
                              }}
                              className="p-2 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors mobile-touch-target"
                              title="Editar título"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(chat)
                              }}
                              className="p-2 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors mobile-touch-target"
                              title="Eliminar conversación"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 mobile-spacing">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-red-500 to-brand-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  Amelia
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Asistente Virtual - Universidad de la Costa
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        chatTitle={deleteModal.chatTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  )
}
