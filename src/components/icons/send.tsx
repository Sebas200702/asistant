import type { IconProps } from '../../types'

export const SendIcon = ({ className }: IconProps) => {
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
      <path d="M12 5v14M18 11l-6-6M6 11l6-6" />
    </svg>
  )
}
