interface HeaderProps {
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export const Header = ({ onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between h-12 p-4  [grid-area:header]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors duration-200 mobile-touch-target"
          aria-label="Abrir menú"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="md:hidden">
          <h1 className="text-lg font-semibold text-gray-900">Amelia</h1>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-red-500 to-brand-red-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">Amelia</span>
        </div>
      </div>
    </header>
  )
}
