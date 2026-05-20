import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, AlertTriangle, TrendingUp } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import WarningBanner from '../../components/ui/WarningBanner'
import RejectionRiskBadge from '../../components/ui/RejectionRiskBadge'
import WatchlistButton from '../../components/ui/WatchlistButton'
import GhostButton from '../../components/ui/GhostButton'
import { mockPlans } from '../../data/mockPlans'
import { mockRecommendations } from '../../data/mockRecommendations'

export default function PlanDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const plan = mockPlans.find(p => p.id === id)
  const reco = mockRecommendations.find(r => r.id === id)

  if (!plan) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-white/40">Plan not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-[13px]">Back</span>
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[24px] font-medium text-white">{plan.name}</h1>
            <Badge>{plan.planType}</Badge>
          </div>
          <p className="text-[14px] text-white/40">{plan.insurer}</p>
        </div>
        <WatchlistButton isWatchlisted={reco?.isWatchlisted} />
      </div>

      <div className="space-y-5">
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Premium', value: `₹${plan.premiumMin.toLocaleString()} — ₹${plan.premiumMax.toLocaleString()}` },
            { label: 'Coverage', value: plan.coverage },
            { label: 'CSR', value: `${plan.csr}%` },
            { label: 'Waiting Period', value: `${plan.waitingPeriodDays} days` },
          ].map((m, i) => (
            <GlassCard key={i} variant="sm" className="p-4 text-center">
              <p className="text-[11px] text-white/40 uppercase tracking-wider">{m.label}</p>
              <p className="text-[16px] font-medium text-white mt-1">{m.value}</p>
            </GlassCard>
          ))}
        </div>

        {/* Rejection risk */}
        {reco && (
          <div className="flex items-center gap-4 flex-wrap">
            <RejectionRiskBadge level={reco.rejectionRisk.label} score={reco.rejectionRisk.score} />
            {reco.suitabilityScore && (
              <span className="text-[13px] text-white/50">Suitability: <span className="text-white font-medium">{reco.suitabilityScore}/100</span></span>
            )}
          </div>
        )}

        {/* Warnings */}
        {reco && reco.warnings.length > 0 && (
          <div className="space-y-2">
            {reco.warnings.map((w, i) => (
              <WarningBanner key={i} type={w.type} message={w.message} severity={w.severity} />
            ))}
          </div>
        )}

        {/* Coverage table */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-4">Coverage Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[13px] text-white/40">Room Rent</span>
              <span className="text-[13px] text-white/70">{plan.roomRent}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.06]">
              <span className="text-[13px] text-white/40">Co-Pay</span>
              <span className="text-[13px] text-white/70">{plan.coPay}</span>
            </div>
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-[13px] text-white/60">{f}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Day-1 conditions */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-3">Day-1 Covered Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {plan.day1Conditions.map((c, i) => (
              <Badge key={i} variant="success">{c}</Badge>
            ))}
          </div>
        </GlassCard>

        {/* Exclusions */}
        <GlassCard className="p-6">
          <h3 className="text-[14px] font-medium text-white/60 mb-3">Exclusions</h3>
          <div className="space-y-2">
            {plan.exclusions.map((e, i) => (
              <div key={i} className="flex items-center gap-2">
                <X className="w-3.5 h-3.5 text-red-400/60 flex-shrink-0" />
                <span className="text-[13px] text-white/50">{e}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Pros / Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-emerald-400/70 mb-3">Pros</h3>
            <div className="space-y-2">
              {plan.pros.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-[13px] text-white/60">{p}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-red-400/70 mb-3">Cons</h3>
            <div className="space-y-2">
              {plan.cons.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" />
                  <span className="text-[13px] text-white/50">{c}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Forecast preview */}
        {reco && (
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-white/60 mb-3">Premium Forecast</h3>
            <div className="flex gap-4">
              {reco.premiumForecast.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-white/[0.03]">
                  <TrendingUp className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[12px] text-white/50">Year {f.year}:</span>
                  <span className="text-[14px] text-white font-medium">₹{f.premium.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <GhostButton onClick={() => navigate('/forecast')} className="mt-4">
              View Full Forecast →
            </GhostButton>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
