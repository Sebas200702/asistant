import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useState } from 'react'

const customOneDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#1a1a1a',
    borderRadius: '0.75rem',
    padding: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    overflow: 'auto',
    margin: '0.75rem 0',
    border: '1px solid #2d2d2d',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: '#1a1a1a',
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
}

// Componente mejorado para imágenes
const ImageComponent = ({ src, alt, title, ...props }: any) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!src) return null

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (hasError) {
    return (
      <div className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">No se pudo cargar la imagen</p>
          <p className="text-xs text-gray-500 mt-1">{alt || 'Imagen no disponible'}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="my-4 group">
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-red-500 rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500">Cargando imagen...</span>
              </div>
            </div>
          )}

          <img
            src={src}
            alt={alt || 'Imagen'}
            title={title}
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            onClick={toggleFullscreen}
            className={`
              w-full h-auto max-w-full object-contain cursor-zoom-in
              transition-all duration-300 group-hover:scale-[1.02]
              ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
            style={{
              maxHeight: '400px',
              minHeight: isLoading ? '200px' : 'auto'
            }}
            {...props}
          />

          {!isLoading && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={toggleFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg backdrop-blur-sm transition-colors"
                title="Ver en pantalla completa"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {(alt || title) && !isLoading && (
          <div className="mt-2 px-1">
            <p className="text-sm text-gray-600 italic text-center">
              {title || alt}
            </p>
          </div>
        )}
      </div>

      {/* Modal de pantalla completa */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-10"
              title="Cerrar"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <img
              src={src}
              alt={alt || 'Imagen'}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {(alt || title) && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg backdrop-blur-sm">
                <p className="text-center text-sm">
                  {title || alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export const MarkdownFormatter = ({ content }: { content: string }) => {
  const MarkdownComponents = {
    img: ImageComponent,
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={customOneDark}
          language={match[1]}
          PreTag="div"
          showLineNumbers={true}
          wrapLongLines={true}
          customStyle={{
            margin: '0.75rem 0',
            borderRadius: '0.75rem',
          }}
          codeTagProps={{
            style: {
              backgroundColor: '#1a1a1a',
            },
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      )
    },
    p({ children }: any) {
      return <p className="mb-4 last:mb-0 leading-relaxed text-gray-800">{children}</p>
    },
    h1({ children }: any) {
      return <h1 className="text-2xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">{children}</h1>
    },
    h2({ children }: any) {
      return <h2 className="text-xl font-semibold mb-3 text-gray-900 mt-6 first:mt-0">{children}</h2>
    },
    h3({ children }: any) {
      return <h3 className="text-lg font-semibold mb-2 text-gray-900 mt-4 first:mt-0">{children}</h3>
    },
    ul({ children }: any) {
      return <ul className="list-disc list-outside ml-6 mb-4 space-y-2">{children}</ul>
    },
    ol({ children }: any) {
      return <ol className="list-decimal list-outside ml-6 mb-4 space-y-2">{children}</ol>
    },
    li({ children }: any) {
      return <li className="text-gray-800 leading-relaxed">{children}</li>
    },
    blockquote({ children }: any) {
      return (
        <blockquote className="border-l-4 border-brand-red-300 pl-4 py-3 mb-4 bg-gray-50 rounded-r-lg italic text-gray-700 my-4">
          {children}
        </blockquote>
      )
    },
    a({ href, children }: any) {
      return (
        <a
          href={href}
          className="text-brand-red-600 hover:text-brand-red-700 underline decoration-brand-red-300 hover:decoration-brand-red-500 transition-colors font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    },
    strong({ children }: any) {
      return <strong className="font-semibold text-gray-900">{children}</strong>
    },
    em({ children }: any) {
      return <em className="italic text-gray-700">{children}</em>
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200">
          <table className="min-w-full">
            {children}
          </table>
        </div>
      )
    },
    thead({ children }: any) {
      return <thead className="bg-gray-50">{children}</thead>
    },
    tbody({ children }: any) {
      return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
    },
    tr({ children }: any) {
      return <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
    },
    th({ children }: any) {
      return <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{children}</th>
    },
    td({ children }: any) {
      return <td className="px-4 py-3 text-sm text-gray-800">{children}</td>
    },
    hr() {
      return <hr className="my-6 border-gray-300" />
    }
  }

  return (
    <div className="prose-sm max-w-none">
      <ReactMarkdown components={MarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
