import { chat } from '@libs/gemini'
import type { APIRoute } from 'astro'
import type { Message } from '../../types'

export const POST: APIRoute = async ({ request }) => {
  const { message }: { message: Message } = await request.json()
  const { content } = message
  const response = await chat.sendMessageStream(content)

  if (
    !response ||
    typeof response.stream[Symbol.asyncIterator] !== 'function'
  ) {
    return new Response('No response from Gemini', { status: 500 })
  }

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response.stream) {
        if (!chunk.text) return
        controller.enqueue(new TextEncoder().encode(chunk.text()))
      }

      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
