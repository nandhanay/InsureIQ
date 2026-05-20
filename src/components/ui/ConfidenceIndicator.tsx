import React from 'react'
import { Brain } from 'lucide-react'

interface ConfidenceIndicatorProps {
  confidence: number // 0-100
  className?: string
}

export default function ConfidenceIndicator({ confidence, className = '' }: ConfidenceIndicatorProps) {
  const getColor = () => {
    if (confidence >= 85) return 'text-emerald-400'
    if (confidence >= 65) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Brain className="w-3.5 h-3.5 text-white/30" />
      <span className={`text-[12px] font-medium ${getColor()}`}>
        {confidence}% confidence
      </span>
    </div>
  )
}
