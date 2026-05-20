import React from 'react'
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react'

type WarningSeverity = 'low' | 'medium' | 'high' | 'critical'

interface WarningBannerProps {
  type: string
  message: string
  severity: WarningSeverity
  className?: string
}

const severityConfig: Record<WarningSeverity, { icon: React.ReactNode; bg: string; border: string; text: string }> = {
  low: {
    icon: <Info className="w-4 h-4" />,
    bg: 'bg-blue-400/[0.06]',
    border: 'border-blue-400/20',
    text: 'text-blue-400',
  },
  medium: {
    icon: <AlertCircle className="w-4 h-4" />,
    bg: 'bg-amber-400/[0.06]',
    border: 'border-amber-400/20',
    text: 'text-amber-400',
  },
  high: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bg: 'bg-red-400/[0.06]',
    border: 'border-red-400/20',
    text: 'text-red-400',
  },
  critical: {
    icon: <ShieldAlert className="w-4 h-4" />,
    bg: 'bg-red-500/[0.08]',
    border: 'border-red-500/25',
    text: 'text-red-400',
  },
}

export default function WarningBanner({ type, message, severity, className = '' }: WarningBannerProps) {
  const config = severityConfig[severity]

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3
        rounded-[var(--radius-md)]
        ${config.bg} border ${config.border}
        ${className}
      `}
    >
      <span className={`mt-0.5 flex-shrink-0 ${config.text}`}>
        {config.icon}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className={`text-[11px] font-medium uppercase tracking-wider ${config.text}`}>
          {type}
        </span>
        <span className="text-[13px] text-white/70 leading-relaxed">
          {message}
        </span>
      </div>
    </div>
  )
}
