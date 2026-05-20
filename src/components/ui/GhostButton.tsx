import React from 'react'

interface GhostButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
}

export default function GhostButton({
  children,
  onClick,
  disabled = false,
  className = '',
  icon,
}: GhostButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-5 py-2.5 rounded-[var(--radius-md)]
        bg-transparent text-white/70 font-medium text-[14px]
        border border-white/10
        transition-all duration-200
        hover:bg-white/[0.06] hover:text-white hover:border-white/20
        active:scale-[0.98]
        disabled:opacity-30 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  )
}
