import { chat } from '@libs/gemini'

import { getDynamicContext } from '@utils/get-dinamic-context'
import type { APIRoute } from 'astro'
import type { Message } from '../../types'

interface RequestBody {
  message: Message
  suggestionId?: string
}

export const POST: APIRoute = async ({ request }) => {
  const { message, suggestionId }: RequestBody = await request.json()
  const { content } = message

  const contextResults = await getDynamicContext(content)
  const bestContexts = contextResults.slice(0, 3).map((c) => c.content)

  // Crear prompt específico según la sugerencia
  let specificInstructions = ''

  if (suggestionId) {
    switch (suggestionId) {
      case 'programas':
        specificInstructions = `
        ENFÓCATE ESPECÍFICAMENTE EN:
        - Programas de pregrado disponibles
        - Programas de posgrado (maestrías, especializaciones, doctorados)
        - Modalidades de estudio (presencial, virtual, semipresencial)
        - Duración de cada programa
        - Requisitos académicos específicos
        - Acreditaciones y reconocimientos
        - Facultades y departamentos académicos
        `
        break
      case 'costos':
        specificInstructions = `
        ENFÓCATE ESPECÍFICAMENTE EN:
        - Costos de matrícula por semestre/año
        - Diferencias de costos entre programas
        - Formas de pago disponibles
        - Descuentos y becas disponibles
        - Costos adicionales (laboratorios, materiales, etc.)
        - Políticas de financiamiento
        - Convenios con entidades financieras
        `
        break
      case 'admisiones':
        specificInstructions = `
        ENFÓCATE ESPECÍFICAMENTE EN:
        - Proceso paso a paso de admisión
        - Documentos requeridos
        - Fechas importantes y cronograma
        - Exámenes de admisión (si aplica)
        - Requisitos académicos mínimos
        - Proceso para estudiantes internacionales
        - Transferencias y homologaciones
        - Contacto de oficina de admisiones
        `
        break
      case 'campus':
        specificInstructions = `
        ENFÓCATE ESPECÍFICAMENTE EN:
        - Instalaciones del campus (aulas, laboratorios, bibliotecas)
        - Servicios estudiantiles disponibles
        - Actividades extracurriculares y deportivas
        - Servicios de bienestar universitario
        - Cafeterías y espacios de recreación
        - Transporte y ubicación
        - Tecnología y recursos digitales
        - Seguridad del campus
        `
        break
      default:
        specificInstructions = `
        PROPORCIONA INFORMACIÓN GENERAL Y COMPLETA sobre la Universidad de la Costa.
        `
    }
  }

  const fullPrompt = `
    Eres Amelia, la asistente virtual oficial de la Universidad de la Costa (CUC) en Barranquilla, Colombia.

    ${specificInstructions}

    USA TODA LA INFORMACIÓN A CONTINUACIÓN PARA RESPONDER LA PREGUNTA DEL USUARIO:
    ${bestContexts.join('\n\n------\n')}

    INSTRUCCIONES IMPORTANTES:
    - Responde de manera amigable y profesional
    - Si no tienes información específica, indica que pueden contactar a la universidad
    - Proporciona información actualizada y precisa
    - Usa un tono conversacional pero informativo
    - Si es relevante, sugiere próximos pasos o contactos específicos

    PREGUNTA DEL USUARIO:
    ${content}
  `

  const response = await chat.sendMessageStream(fullPrompt)

  console.log('Suggestion ID:', suggestionId)
  console.log('Best contexts:', bestContexts)

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
