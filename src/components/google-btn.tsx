import { GoogleIcon } from '@components/icons/google-icon'
import { signIn } from 'auth-astro/client'

/**
 * GoogleBtn component renders a button for Google authentication.
 *
 * @description This component provides a Google sign-in button that triggers the authentication process.
 * It uses our custom authentication system to handle the sign-in flow with Google as the provider.
 * When clicked, the button initiates the OAuth flow, redirecting the user to Google's authentication page.
 *
 * The component is designed with a clean, recognizable interface featuring the Google icon for
 * immediate brand recognition. It maintains a consistent styling with other authentication options
 * while clearly indicating its purpose through the Google logo.
 *
 * The button is fully responsive and adapts to its container width, making it suitable for various
 * layout configurations. It follows accessibility best practices with proper button semantics and
 * visual indicators.
 *
 * @returns {JSX.Element} The rendered Google authentication button with icon
 *
 * @example
 * <GoogleBtn />
 */
export const GoogleBtn = () => {
  const handleGoogleClick = async () => {
    signIn('google', {
      callbackUrl: '/',
    })
  }
  return (
    <button
      type="button"
      className="w-full inline-flex justify-center items-center gap-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red-500 transition-colors duration-200"
      onClick={handleGoogleClick}
    >
      <GoogleIcon className="h-5 w-5" />
      <span>Continue with Google</span>
    </button>
  )
}
