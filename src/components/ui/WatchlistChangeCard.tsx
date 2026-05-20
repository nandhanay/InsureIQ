import React from 'react'
import { TrendingUp, TrendingDown, AlertCircle, Shield } from 'lucide-react'

interface WatchlistChange {
  type: 'premium' | 'csr' | 'exclusion' | 'metric'
  direction: 'up' | 'down' | 'neutral'
  label: string
  detail: string
  timestamp: string
}

interface WatchlistChangeCardProps {
  planName: string
  insurer: string
  changes: WatchlistChange[]
  className?: string
}

export default function WatchlistChangeCard({
  planName,
  insurer,
  changes,
  className = '',
}: WatchlistChangeCardProps) {
  const getIcon = (type: string, direction: string) => {
    if (direction === 'up') return <TrendingUp className="w-3.5 h-3.5 text-red-400" />
    if (direction === 'down') return <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
    if (type === 'exclusion') return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
    return <Shield className="w-3.5 h-3.5 text-white/40" />
  }

  return (
    <div className={`glass-sm p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[14px] font-medium text-white">{planName}</h4>
          <p className="text-[12px] text-white/40">{insurer}</p>
        </div>
        <span className="text-[11px] text-white/30">
          {changes.length} update{changes.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {changes.map((change, i) => (
          <div key={i} className="flex items-start gap-2.5 py-1.5 border-t border-white/[0.06]">
            <span className="mt-0.5 flex-shrink-0">
              {getIcon(change.type, change.direction)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white/70">{change.label}</p>
              <p className="text-[11px] text-white/40">{change.detail}</p>
            </div>
            <span className="text-[10px] text-white/25 flex-shrink-0">{change.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
