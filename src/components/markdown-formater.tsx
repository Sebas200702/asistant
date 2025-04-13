import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const customOneDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#121218',
    borderRadius: '0.5rem',
    padding: '1rem',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    overflow: 'auto',
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: '#121218',
    padding: '0.25rem',
    fontSize: '0.875rem',
    borderRadius: '0.25rem',
    lineHeight: '1.5',
  },
}

export const MarkdownFormatter = ({ content }: { content: string }) => {
  const MarkdownComponents = {
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
            margin: '1rem 0',
          }}
          codeTagProps={{
            style: {
              backgroundColor: '#121218',
            },
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    a({ node, inline, className, children, href, ...props }: any) {
      return (
        <a
          className={className}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#3498db',
            textDecoration: 'underline',
            '&:hover': {
              color: '#34d399',
            },
          }}
          {...props}
        >
          {children}
        </a>
      )
    },
    h1({ node, inline, className, children, ...props }: any) {
      return (
        <h1
          className={className}
          style={{
            fontSize: '1.825remm',
            fontWeight: 700,
            marginTop: '1rem',
          }}
          {...props}
        >
          {children}
        </h1>
      )
    },
    h2({ node, inline, className, children, ...props }: any) {
      return (
        <h2
          className={className}
          style={{
            fontSize: '1.625rem',
            fontWeight: 600,
            marginTop: '1rem',
          }}
          {...props}
        >
          {children}
        </h2>
      )
    },
    h3({ node, inline, className, children, ...props }: any) {
      return (
        <h3
          className={className}
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            marginTop: '1rem',
          }}
          {...props}
        >
          {children}
        </h3>
      )
    },
    h4({ node, inline, className, children, ...props }: any) {
      return (
        <h4
          className={className}
          style={{
            fontSize: '1.35rem',
            fontWeight: 400,
            marginTop: '1rem',
          }}
          {...props}
        >
          {children}
        </h4>
      )
    },
    h5({ node, inline, className, children, ...props }: any) {
      return (
        <h5
          className={className}
          style={{
            fontSize: '1.25rem',
            fontWeight: 400,
            marginTop: '1rem',
          }}
          {...props}
        >
          {children}
        </h5>
      )
    },

    ul({ node, inline, className, children, ...props }: any) {
      return (
        <ul
          className={className}
          style={{
            listStyle: 'disc',
          }}
          {...props}
        >
          {children}
        </ul>
      )
    },
    ol({ node, inline, className, children, ...props }: any) {
      return (
        <ol
          className={className}
          style={{
            listStyle: 'none',
          }}
          {...props}
        >
          {children}
        </ol>
      )
    },
    li({ node, inline, className, children, ...props }: any) {
      return (
        <li
          className={className}
          style={{
            fontSize: '1rem',
            lineHeight: '1.5',
            listStyle: 'none',
          }}
          {...props}
        >
          {children}
        </li>
      )
    },
    img({ node, inline, className, children, alt, ...props }: any) {
      return (
        <img
          alt={alt || 'Image'}
          className={className}
          style={{
            maxWidth: '70%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '0.5rem',
            width: 'auto',
          }}
          {...props}
        />
      )
    },
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown components={MarkdownComponents} className="prose prose-sm">
        {content}
      </ReactMarkdown>
    </div>
  )
}
