import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'sm' | 'xl'
  interactive?: boolean
  onClick?: () => void
}

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  onClick,
}: GlassCardProps) {
  const variantClass = {
    default: 'glass',
    strong: 'glass-strong',
    sm: 'glass-sm',
    xl: 'glass-xl',
  }[variant]

  return (
    <div
      className={`${variantClass} ${interactive ? 'glass-interactive cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
