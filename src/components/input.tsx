import { useEffect, useRef, useState } from 'react'

import { MicrophoneIcon } from '@icons/microphone'
import { PlusIcon } from '@icons/plus'
import { SendIcon } from '@icons/send'
import { useChatStore } from '@store/chat-store'
import type { Message } from '../types'

export const Input = () => {
  const [query, setQuery] = useState('')
  const { setIsLoading, addMessage, editMessage, messages } = useChatStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineHeight = useRef<number>(24)
  const maxRows = 9
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: query,
      role: 'user',
      timestamp: new Date().toISOString(),
    }
    addMessage(userMessage)
    let reply = ''

    const botMessage: Message = {
      id: crypto.randomUUID(),
      content: reply,
      role: 'assistant',
      timestamp: new Date().toISOString(),
    }
    addMessage(botMessage)
    setQuery('')
    const response = await fetch('/api/responseUserMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
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
    setIsLoading(false)
  }

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
    <form
      ref={formRef}
      className={`flex h-min w-full max-w-3xl flex-col gap-2 items-center rounded-3xl border border-gray-400/40 bg-gray-100 px-4 py-2 shadow-md ${!messages.length ? 'absolute top-1/2 ' : '[grid-area:input] '}
      `}
      onSubmit={handleSubmit}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        spellCheck="false"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        placeholder="Pregunta algo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full resize-none overflow-y-auto border-none bg-transparent p-2 text-gray-800 placeholder-gray-500 outline-none"
      />
      <footer className="mt-2 flex w-full items-center justify-between">
        <button
          type="button"
          className="group mr-2 cursor-pointer rounded-full p-1"
        >
          <PlusIcon className="h-6 w-6 text-gray-500 transition-colors duration-200 group-hover:text-gray-700" />
        </button>
        <div className="flex-1" />
        <button type="button" className="group cursor-pointer rounded-full p-1">
          <MicrophoneIcon className="h-6 w-6 text-gray-500 transition-colors duration-200 group-hover:text-gray-700" />
        </button>
        <button
          type="submit"
          className="ml-2 cursor-pointer rounded-full bg-[#e41e24] p-1 transition-colors duration-200 hover:bg-[#c0151a]"
        >
          <SendIcon className="h-6 w-6 text-white" />
        </button>
      </footer>
    </form>
  )
}
