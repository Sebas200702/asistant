import type { IconProps } from '../../types'
export const MicrophoneIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className={className}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M9 5a3 3 0 0 1 3-3h0a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3z" />
      <path d="M5 10a7 7 0 0 0 14 0M8 21h8M12 17v4" />
    </svg>
  )
}
