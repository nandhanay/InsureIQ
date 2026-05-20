import React from 'react'

type RiskLevel = 'Low' | 'Moderate' | 'High'

interface RejectionRiskBadgeProps {
  level: RiskLevel
  score?: number
  className?: string
}

const levelStyles: Record<RiskLevel, { bg: string; text: string; dot: string }> = {
  Low: {
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  Moderate: {
    bg: 'bg-amber-400/10 border-amber-400/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  High: {
    bg: 'bg-red-400/10 border-red-400/20',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
}

export default function RejectionRiskBadge({ level, score, className = '' }: RejectionRiskBadgeProps) {
  const styles = levelStyles[level]

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        rounded-full border ${styles.bg}
        ${className}
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      <span className={`text-[12px] font-medium ${styles.text}`}>
        {level} Rejection Risk
      </span>
      {score !== undefined && (
        <span className={`text-[11px] ${styles.text} opacity-60`}>
          ({score}%)
        </span>
      )}
    </div>
  )
}
