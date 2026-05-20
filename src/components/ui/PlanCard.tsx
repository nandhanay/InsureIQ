import React, { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import Badge from './Badge'
import RejectionRiskBadge from './RejectionRiskBadge'
import ConfidenceIndicator from './ConfidenceIndicator'
import WarningBanner from './WarningBanner'
import WatchlistButton from './WatchlistButton'
import SHAPBar from './SHAPBar'

export interface PlanCardData {
  id: string
  rank: number
  planName: string
  insurer: string
  planType: string
  suitabilityScore: number
  suitabilityBreakdown: { label: string; score: number }[]
  modelConfidence: number
  rejectionRisk: { label: 'Low' | 'Moderate' | 'High'; score: number }
  warnings: { type: string; severity: 'low' | 'medium' | 'high' | 'critical'; message: string }[]
  shapFactors: { label: string; value: number }[]
  explanationText: string
  premiumMin: number
  premiumMax: number
  csr: number
  premiumForecast: { year: number; premium: number }[]
  isWatchlisted?: boolean
}

interface PlanCardProps {
  data: PlanCardData
  onViewDetail?: (id: string) => void
  onToggleWatchlist?: (id: string) => void
}

export default function PlanCard({ data, onViewDetail, onToggleWatchlist }: PlanCardProps) {
  const [expanded, setExpanded] = useState(false)

  const scoreColor = data.suitabilityScore >= 75
    ? 'text-emerald-400'
    : data.suitabilityScore >= 50
      ? 'text-amber-400'
      : 'text-red-400'

  return (
    <div className="glass glass-interactive p-0 overflow-hidden animate-fade-in">
      {/* Header */}
      <div
        className="flex items-start justify-between p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-4 min-w-0">
          {/* Rank */}
          <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0">
            <span className="text-[13px] font-medium text-white/60">#{data.rank}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-medium text-white truncate">{data.planName}</h3>
              <Badge variant="default">{data.planType}</Badge>
            </div>
            <p className="text-[13px] text-white/40 mt-0.5">{data.insurer}</p>

            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <div className="flex items-baseline gap-1">
                <span className={`text-[20px] font-medium ${scoreColor}`}>
                  {data.suitabilityScore}
                </span>
                <span className="text-[12px] text-white/30">/100</span>
              </div>

              <RejectionRiskBadge level={data.rejectionRisk.label} score={data.rejectionRisk.score} />
              <ConfidenceIndicator confidence={data.modelConfidence} />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-[13px] text-white/50">
                ₹{data.premiumMin.toLocaleString()} — ₹{data.premiumMax.toLocaleString()}/yr
              </span>
              <span className="text-[12px] text-white/30">CSR: {data.csr}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <WatchlistButton
            isWatchlisted={data.isWatchlisted}
            onToggle={() => onToggleWatchlist?.(data.id)}
          />
          <div className="text-white/30">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-white/[0.06] p-5 space-y-5 animate-fade-in">
          {/* Warnings */}
          {data.warnings.length > 0 && (
            <div className="space-y-2">
              {data.warnings.map((w, i) => (
                <WarningBanner key={i} type={w.type} message={w.message} severity={w.severity} />
              ))}
            </div>
          )}

          {/* Explanation */}
          <div>
            <h4 className="text-[12px] text-white/40 font-medium uppercase tracking-wider mb-2">
              Why This Plan
            </h4>
            <p className="text-[13px] text-white/60 leading-relaxed">
              {data.explanationText}
            </p>
          </div>

          {/* SHAP Factors */}
          <div>
            <h4 className="text-[12px] text-white/40 font-medium uppercase tracking-wider mb-3">
              Key Factors (SHAP)
            </h4>
            <div className="space-y-1.5">
              {data.shapFactors.map((f, i) => (
                <SHAPBar key={i} label={f.label} value={f.value} />
              ))}
            </div>
          </div>

          {/* Suitability Breakdown */}
          <div>
            <h4 className="text-[12px] text-white/40 font-medium uppercase tracking-wider mb-3">
              Score Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {data.suitabilityBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-[10px] bg-white/[0.03]">
                  <span className="text-[12px] text-white/50">{item.label}</span>
                  <span className="text-[13px] text-white font-medium">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium forecast preview */}
          <div>
            <h4 className="text-[12px] text-white/40 font-medium uppercase tracking-wider mb-2">
              Premium Forecast
            </h4>
            <div className="flex items-center gap-4">
              {data.premiumForecast.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-white/[0.03]">
                  <TrendingUp className="w-3 h-3 text-white/30" />
                  <span className="text-[12px] text-white/50">Yr {f.year}:</span>
                  <span className="text-[13px] text-white font-medium">₹{f.premium.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onViewDetail?.(data.id)}
            className="text-[13px] text-white/60 hover:text-white transition-colors duration-200 underline underline-offset-2"
          >
            View full plan details →
          </button>
        </div>
      )}
    </div>
  )
}
