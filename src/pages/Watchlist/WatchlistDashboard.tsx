import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, TrendingUp, Clock, ExternalLink } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'
import Badge from '../../components/ui/Badge'
import WatchlistChangeCard from '../../components/ui/WatchlistChangeCard'
import GhostButton from '../../components/ui/GhostButton'
import { useWatchlist } from '../../hooks/useWatchlist'

export default function WatchlistDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useWatchlist()

  const plans = data?.plans || []
  const changes = data?.changes || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white/80 animate-spin mb-4" />
        <p className="text-[14px] text-white/40">Fetching Your Watchlist...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-[26px] font-medium text-white flex items-center gap-3">
          <Bookmark className="w-6 h-6 text-white/50" fill="currentColor" />
          Watchlist
        </h1>
        <p className="text-[14px] text-white/40 mt-1">{plans.length} plans tracked</p>
      </div>


      <div className="flex flex-col lg:flex-row gap-6">
        {/* Saved Plans */}
        <div className="flex-1 space-y-4">
          <h3 className="text-[13px] text-white/40 font-medium uppercase tracking-wider">Saved Plans</h3>
          {plans.map((plan: any) => (
            <GlassCard key={plan.id} className="p-5" interactive onClick={() => navigate(`/plans/${plan.id}`)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[15px] font-medium text-white">{plan.name}</h3>
                  <p className="text-[12px] text-white/40">{plan.insurer}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/20" />
              </div>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge>{plan.planType}</Badge>
                <Badge variant="info">CSR {plan.csr}%</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center py-2 rounded-[8px] bg-white/[0.03]">
                  <p className="text-[11px] text-white/30">Premium</p>
                  <p className="text-[13px] text-white font-medium">₹{plan.premiumMin.toLocaleString()}</p>
                </div>
                <div className="text-center py-2 rounded-[8px] bg-white/[0.03]">
                  <p className="text-[11px] text-white/30">Coverage</p>
                  <p className="text-[13px] text-white font-medium">{plan.coverage}</p>
                </div>
                <div className="text-center py-2 rounded-[8px] bg-white/[0.03]">
                  <p className="text-[11px] text-white/30">Wait</p>
                  <p className="text-[13px] text-white font-medium">{plan.waitingPeriodDays}d</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Activity feed */}
        <div className="lg:w-[380px] space-y-4">
          <h3 className="text-[13px] text-white/40 font-medium uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            Recent Changes
          </h3>
          {changes.map((item: any, i: number) => (
            <WatchlistChangeCard key={i} {...item} />
          ))}

          {/* Timeline */}
          <GlassCard className="p-5">
            <h4 className="text-[13px] text-white/50 font-medium mb-4">Timeline</h4>
            <div className="space-y-4 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/[0.06]" />
              {[
                { date: 'May 18', event: 'Diabetes Safe premium revised', type: 'premium' },
                { date: 'May 15', event: 'Care Supreme CSR updated', type: 'csr' },
                { date: 'May 12', event: 'Star Comprehensive added to watchlist', type: 'added' },
                { date: 'May 10', event: 'Initial plan analysis completed', type: 'system' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 pl-0">
                  <div className="w-[15px] h-[15px] rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center flex-shrink-0 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  </div>
                  <div className="pb-1">
                    <p className="text-[12px] text-white/60">{item.event}</p>
                    <p className="text-[11px] text-white/25">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
