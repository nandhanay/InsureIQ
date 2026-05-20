import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, GitCompare, MessageCircle, TrendingUp } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import PlanCard from '../../components/ui/PlanCard'
import RiskMeter from '../../components/ui/RiskMeter'
import SHAPBar from '../../components/ui/SHAPBar'
import WatchlistChangeCard from '../../components/ui/WatchlistChangeCard'
import GhostButton from '../../components/ui/GhostButton'
import { mockRecommendations, mockRiskFactors } from '../../data/mockRecommendations'
import { currentUser } from '../../data/mockUser'
import { mockWatchlistChanges } from '../../data/mockForecast'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">Your Recommendations</h1>
        <p className="text-[14px] text-white/40 mt-1">
          Based on {currentUser.name}'s risk profile — Score: {currentUser.riskScore}/100 ({currentUser.riskTier} Risk)
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column — 60% */}
        <div className="flex-1 lg:w-[60%] space-y-4">
          {/* CTA Bar */}
          <div className="flex gap-3 mb-2 flex-wrap">
            <GhostButton onClick={() => navigate('/forecast')} icon={<TrendingUp className="w-4 h-4" />}>
              View Forecast
            </GhostButton>
            <GhostButton onClick={() => navigate('/compare')} icon={<GitCompare className="w-4 h-4" />}>
              Compare Plans
            </GhostButton>
            <GhostButton onClick={() => {}} icon={<MessageCircle className="w-4 h-4" />}>
              AI Copilot
            </GhostButton>
          </div>

          {/* Plan Cards */}
          {mockRecommendations.map((plan) => (
            <PlanCard
              key={plan.id}
              data={plan}
              onViewDetail={(id) => navigate(`/plans/${id}`)}
              onToggleWatchlist={(id) => console.log('toggle watchlist', id)}
            />
          ))}
        </div>

        {/* Right Column — 40% */}
        <div className="lg:w-[40%] space-y-5">
          {/* Risk Meter */}
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-white/60 mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Health Risk Assessment
            </h3>
            <div className="flex justify-center mb-6">
              <RiskMeter score={currentUser.riskScore} tier={currentUser.riskTier} />
            </div>
          </GlassCard>

          {/* Risk Factors */}
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-white/60 mb-4">
              Contributing Factors
            </h3>
            <div className="space-y-2">
              {mockRiskFactors.map((f, i) => (
                <SHAPBar key={i} label={f.label} value={f.value} />
              ))}
            </div>
          </GlassCard>

          {/* Watchlist Activity */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-white/60">Watchlist Updates</h3>
              <button
                onClick={() => navigate('/watchlist')}
                className="text-[12px] text-white/30 hover:text-white/50 transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {mockWatchlistChanges.map((item, i) => (
                <WatchlistChangeCard key={i} {...item} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
