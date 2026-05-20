import React from 'react'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  fullWidth?: boolean
  icon?: React.ReactNode
}

export default function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
  icon,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-3 rounded-[var(--radius-md)]
        bg-white text-black font-medium text-[14px]
        transition-all duration-200
        hover:bg-white/90 active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  )
}
