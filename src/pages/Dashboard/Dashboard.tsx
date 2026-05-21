import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, GitCompare, MessageCircle, TrendingUp, AlertCircle, RefreshCw, FileText } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import PlanCard from '../../components/ui/PlanCard'
import RiskMeter from '../../components/ui/RiskMeter'
import SHAPBar from '../../components/ui/SHAPBar'
import WatchlistChangeCard from '../../components/ui/WatchlistChangeCard'
import GhostButton from '../../components/ui/GhostButton'
import { useRecommendations } from '../../hooks/useRecommendations'
import { useProfile } from '../../hooks/useProfile'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useToggleWatchlist } from '../../hooks/useToggleWatchlist'
import { useDocuments } from '../../hooks/useDocuments'

export default function Dashboard() {
  const navigate = useNavigate()
  const { documents } = useDocuments()
  
  const { 
    data: recoData, 
    isLoading: recoLoading, 
    isError: recoError, 
    refetch: refetchReco 
  } = useRecommendations()
  
  const { data: profileData } = useProfile()
  const { data: watchlistData } = useWatchlist()
  const toggleWatchlistMutation = useToggleWatchlist()

  if (recoLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        <p className="text-[14px] text-white/40 animate-pulse">Running advanced AI risk analysis...</p>
      </div>
    )
  }

  if (recoError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <GlassCard className="p-8 max-w-[400px] flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <h2 className="text-[18px] font-medium text-white">Analysis Failed</h2>
          <p className="text-[13px] text-white/40">
            We encountered a network error while calculating your suitability models.
          </p>
          <button
            onClick={() => refetchReco()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/[0.08] text-white text-[13px] hover:bg-white/[0.12] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Assessment
          </button>
        </GlassCard>
      </div>
    )
  }

  const recommendations = recoData?.recommendations || []
  const riskScore = recoData?.riskScore ?? 30
  const riskTier = recoData?.riskTier ?? 'Low'
  const riskFactors = recoData?.riskFactors || []
  const userName = profileData?.name || 'User'
  const watchlistChanges = watchlistData?.changes || []

  const docCount = documents?.length || 0
  const latestDocDate = documents && documents.length > 0 && documents[0]?.created_at
    ? new Date(documents[0].created_at).toLocaleDateString()
    : 'Never'

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white">Your Recommendations</h1>
        <p className="text-[14px] text-white/40 mt-1">
          Based on {userName}'s risk profile — Score: {riskScore}/100 ({riskTier} Risk)
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
            <GhostButton onClick={() => navigate('/forecast/simulator')} icon={<MessageCircle className="w-4 h-4" />}>
              What-If Simulator
            </GhostButton>
          </div>

          {/* Plan Cards */}
          {recommendations.length > 0 ? (
            recommendations.map((plan: any) => (
              <PlanCard
                key={plan.id}
                data={plan}
                onViewDetail={(id) => navigate(`/plans/${id}`)}
                onToggleWatchlist={(id) => toggleWatchlistMutation.mutate(id)}
              />
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-[14px] text-white/30">No recommendations found. Please run intake first.</p>
              <button 
                onClick={() => navigate('/intake')}
                className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white text-[13px] hover:bg-white/20"
              >
                Go to Intake Wizard
              </button>
            </div>
          )}
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
              <RiskMeter score={riskScore} tier={riskTier} />
            </div>
          </GlassCard>

          {/* Risk Factors */}
          <GlassCard className="p-6">
            <h3 className="text-[14px] font-medium text-white/60 mb-4">
              Contributing Factors
            </h3>
            <div className="space-y-2">
              {riskFactors.length > 0 ? (
                riskFactors.map((f: any, i: number) => (
                  <SHAPBar key={i} label={f.label} value={f.value} />
                ))
              ) : (
                <p className="text-[13px] text-white/30">No risk factors identified</p>
              )}
            </div>
          </GlassCard>

          {/* Medical Documents Summary */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-white/60 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Medical Documents
              </h3>
              <span className="text-[12px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">
                {docCount} {docCount === 1 ? 'Report' : 'Reports'}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-white/40">Latest Update:</span>
                <span className="text-white/80 font-medium">{latestDocDate}</span>
              </div>
              
              <button
                onClick={() => navigate('/profile')}
                className="w-full py-2.5 rounded-[12px] bg-white/[0.08] text-white text-[13px] font-medium hover:bg-white/[0.12] transition-all flex items-center justify-center gap-2"
              >
                Manage Documents
              </button>
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
              {watchlistChanges.length > 0 ? (
                watchlistChanges.map((item: any, i: number) => (
                  <WatchlistChangeCard key={i} {...item} />
                ))
              ) : (
                <p className="text-[13px] text-white/30">Bookmark plans to view live growth changes and claim updates</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

